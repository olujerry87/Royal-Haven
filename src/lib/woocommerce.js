/**
 * WooCommerce REST API Utility
 * Uses @woocommerce/woocommerce-rest-api package for authenticated requests.
 * All functions are server-side only — API keys are never exposed to the client.
 */
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

if (!WP_URL || !WC_KEY || !WC_SECRET) {
    console.warn("[WooCommerce] Missing env vars: NEXT_PUBLIC_WORDPRESS_URL, WC_CONSUMER_KEY, or WC_CONSUMER_SECRET");
}

const api = new WooCommerceRestApi({
    url: WP_URL,
    consumerKey: WC_KEY,
    consumerSecret: WC_SECRET,
    version: "wc/v3",
    queryStringAuth: true, // Bypass Hostinger stripping the Authorization header
});

/**
 * Fetch all products from WooCommerce.
 * ISR: Cached by Next.js fetch, revalidated by webhook at /api/revalidate.
 * @param {object} params - Query parameters (per_page, page, category, etc.)
 * @param {string} lang - WPML language code (default: 'en')
 */
export async function getProducts(params = {}, lang = 'en') {
    try {
        const { data } = await api.get("products", { per_page: 100, status: "publish", lang, ...params });
        if (lang !== 'en' && (!data || data.length === 0)) {
            // WPML fallback: retry in English if no results for requested language
            const { data: fallback } = await api.get("products", { per_page: 100, status: "publish", lang: 'en', ...params });
            return fallback || [];
        }
        return data || [];
    } catch (error) {
        console.error("[WooCommerce] getProducts failed:", error.response?.data || error.message);
        return [];
    }
}

/**
 * Fetch a single product by slug.
 * @param {string} slug
 * @param {string} lang - WPML language code (default: 'en')
 */
export async function getProductBySlug(slug, lang = 'en') {
    try {
        const { data } = await api.get("products", { slug, lang });
        if (lang !== 'en' && (!data || data.length === 0)) {
            // WPML fallback: retry in English if no translation exists
            const { data: fallback } = await api.get("products", { slug, lang: 'en' });
            return fallback?.[0] || null;
        }
        return data?.[0] || null;
    } catch (error) {
        console.error(`[WooCommerce] getProductBySlug(${slug}) failed:`, error.response?.data || error.message);
        // Fallback to English on error
        if (lang !== 'en') {
            try {
                const { data: fallback } = await api.get("products", { slug, lang: 'en' });
                return fallback?.[0] || null;
            } catch {
                return null;
            }
        }
        return null;
    }
}

/**
 * Fetch a single product by ID.
 * @param {number} productId
 */
export async function getProductById(productId) {
    try {
        const { data } = await api.get(`products/${productId}`);
        return data;
    } catch (error) {
        console.error(`[WooCommerce] getProductById(${productId}) failed:`, error.response?.data || error.message);
        return null;
    }
}

/**
 * Fetch product categories.
 * @param {string} lang - WPML language code (default: 'en')
 */
export async function getProductCategories(lang = 'en') {
    try {
        const { data } = await api.get("products/categories", { lang });
        return data || [];
    } catch (error) {
        console.error("[WooCommerce] getProductCategories failed:", error.response?.data || error.message);
        return [];
    }
}

/**
 * Fetch products by category ID.
 * @param {number} categoryId
 * @param {object} params - Additional query params
 * @param {string} lang - WPML language code (default: 'en')
 */
export async function getProductsByCategory(categoryId, params = {}, lang = 'en') {
    try {
        const { data } = await api.get("products", { category: categoryId, lang, ...params });
        if (lang !== 'en' && (!data || data.length === 0)) {
            const { data: fallback } = await api.get("products", { category: categoryId, lang: 'en', ...params });
            return fallback || [];
        }
        return data || [];
    } catch (error) {
        console.error(`[WooCommerce] getProductsByCategory(${categoryId}) failed:`, error.response?.data || error.message);
        return [];
    }
}

/**
 * Create an order in WooCommerce.
 * @param {object} orderData
 */
export async function createOrder(orderData) {
    try {
        const { data } = await api.post("orders", orderData);
        return data;
    } catch (error) {
        console.error("[WooCommerce] createOrder failed:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * Get an order by ID.
 * @param {number} orderId
 */
export async function getOrderById(orderId) {
    try {
        const { data } = await api.get(`orders/${orderId}`);
        return data;
    } catch (error) {
        console.error(`[WooCommerce] getOrderById(${orderId}) failed:`, error.response?.data || error.message);
        return null;
    }
}

/**
 * Query orders by customer email address to verify first-time buyer status.
 * @param {string} email
 */
export async function getOrdersByEmail(email) {
    if (!email || typeof email !== "string") return [];
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const { data } = await api.get("orders", { search: normalizedEmail, per_page: 5 });
        const matched = (data || []).filter(o =>
            o.billing?.email?.toLowerCase() === normalizedEmail ||
            o.shipping?.email?.toLowerCase() === normalizedEmail
        );
        return matched;
    } catch (error) {
        console.error(`[WooCommerce] getOrdersByEmail(${email}) failed:`, error.response?.data || error.message);
        return [];
    }
}

/**
 * Fetch all variations for a variable product.
 * Returns array of variation objects with id, attributes, price, stock_status, image.
 * @param {number} productId
 * @param {string} lang - WPML language code (default: 'en')
 */
export async function getProductVariations(productId, lang = 'en') {
    try {
        const { data } = await api.get(`products/${productId}/variations`, { per_page: 100, lang });
        return data || [];
    } catch (error) {
        console.error(`[WooCommerce] getProductVariations(${productId}) failed:`, error.response?.data || error.message);
        return [];
    }
}

/**
 * Fetch related products from same categories (excluding current product).
 * @param {object} product - Product object with id and categories array
 * @param {number} limit - Max number of related products to return
 * @param {string} lang - WPML language code (default: 'en')
 */
export async function getRelatedProducts(product, limit = 8, lang = 'en') {
    try {
        const categoryIds = (product.categories || []).map(c => c.id).filter(Boolean);
        if (categoryIds.length === 0) {
            // Fallback: just get recent products excluding current
            const { data } = await api.get('products', { per_page: limit + 1, status: 'publish', exclude: [product.id], lang });
            return (data || []).slice(0, limit);
        }
        const { data } = await api.get('products', {
            category: categoryIds.join(','),
            per_page: limit + 1,
            status: 'publish',
            exclude: [product.id],
            lang,
        });
        const results = (data || []).slice(0, limit);
        // WPML fallback: if no localized results, try English
        if (lang !== 'en' && results.length === 0) {
            const { data: fallback } = await api.get('products', {
                category: categoryIds.join(','),
                per_page: limit + 1,
                status: 'publish',
                exclude: [product.id],
                lang: 'en',
            });
            return (fallback || []).slice(0, limit);
        }
        return results;
    } catch (error) {
        console.error(`[WooCommerce] getRelatedProducts failed:`, error.response?.data || error.message);
        return [];
    }
}

/**
 * Convert cart items to WooCommerce order format.
 * @param {array} cartItems
 * @param {object} customerData
 */
export function formatOrderData(cartItems, customerData) {
    const lineItems = cartItems.map(item => {
        const meta = [
            { key: "Size", value: item.size || "Fixed" },
            ...(item.color ? [{ key: "Color", value: item.color }] : []),
            ...(item.fit ? [{ key: "Fit", value: item.fit }] : []),
        ];
        
        // Add Omnichannel Square Gift Card metadata if item is a digital gift card
        if (item.recipient_email || item.title?.includes("Gift Card")) {
            const sqCode = `ROYAL-SQGC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            meta.push({ key: "Square Gift Card Code", value: sqCode });
            meta.push({ key: "Square Terminal Compatible", value: "Yes (Physical POS Barcode Scan Enabled)" });
            if (item.recipient_email) {
                meta.push({ key: "Recipient Email", value: item.recipient_email });
            }
            if (item.recipient_name) {
                meta.push({ key: "Recipient Name", value: item.recipient_name });
            }
            if (item.message) {
                meta.push({ key: "Gift Message", value: item.message });
            }
        }

        return {
            product_id: item.id || 110,
            // variation_id > 0 tells WooCommerce which specific variation was ordered.
            // Without this, WC records variation_id: 0 (parent fallback) and never
            // decrements the variation's stock, causing overselling.
            ...(item.variation_id && item.variation_id > 0
                ? { variation_id: item.variation_id }
                : {}),
            quantity: item.quantity,
            meta_data: meta,
        };
    });

    // Use the shipping method selected on the checkout form
    const shippingLine = customerData.shippingLine || {
        method_id: "flat_rate",
        method_title: "Standard Shipping",
        total: "0.00",
    };

    const order = {
        payment_method: customerData.paymentMethod || "square",
        payment_method_title: customerData.paymentMethodTitle || "Square / Credit Card",
        set_paid: false,
        currency: "CAD",
        billing: customerData.billing,
        shipping: customerData.shipping,
        line_items: lineItems,
        shipping_lines: [
            {
                method_id: shippingLine.method_id,
                method_title: shippingLine.method_title,
                total: shippingLine.total,
            },
        ],
    };

    const coupons = [];
    const feeLines = [];

    // First-order 10% discount — recorded as a negative fee so WC admin shows the correct total.
    // No real coupon code is needed in WooCommerce; the discount is validated server-side via
    // verifyFirstOrderEligibility() before payment and applied client-side for Square charge.
    if (customerData.discountAmount && customerData.discountAmount > 0) {
        feeLines.push({
            name: customerData.discountLabel || "First Order Discount (10%)",
            total: `-${parseFloat(customerData.discountAmount).toFixed(2)}`,
            tax_status: "none",
        });
    }

    if (customerData.appliedGiftCard) {
        feeLines.push({
            name: `Gift Card Discount (${customerData.appliedGiftCard.code})`,
            total: `-${customerData.appliedGiftCard.balance.toFixed(2)}`,
            tax_status: "none",
        });
    }

    if (feeLines.length > 0) {
        order.fee_lines = feeLines;
    }

    if (coupons.length > 0) {
        order.coupon_lines = coupons;
    }

    return order;
}
