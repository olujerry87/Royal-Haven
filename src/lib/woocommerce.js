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
 */
export async function getProducts(params = {}) {
    try {
        const { data } = await api.get("products", { per_page: 100, status: "publish", ...params });
        return data;
    } catch (error) {
        console.error("[WooCommerce] getProducts failed:", error.response?.data || error.message);
        return [];
    }
}

/**
 * Fetch a single product by slug.
 * @param {string} slug
 */
export async function getProductBySlug(slug) {
    try {
        const { data } = await api.get("products", { slug });
        return data[0] || null;
    } catch (error) {
        console.error(`[WooCommerce] getProductBySlug(${slug}) failed:`, error.response?.data || error.message);
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
 */
export async function getProductCategories() {
    try {
        const { data } = await api.get("products/categories");
        return data;
    } catch (error) {
        console.error("[WooCommerce] getProductCategories failed:", error.response?.data || error.message);
        return [];
    }
}

/**
 * Fetch products by category ID.
 * @param {number} categoryId
 */
export async function getProductsByCategory(categoryId, params = {}) {
    try {
        const { data } = await api.get("products", { category: categoryId, ...params });
        return data;
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
 * Convert cart items to WooCommerce order format.
 * @param {array} cartItems
 * @param {object} customerData
 */
export function formatOrderData(cartItems, customerData) {
    const lineItems = cartItems.map(item => {
        const meta = [{ key: "Size", value: item.size || "Fixed" }];
        
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
            quantity: item.quantity,
            meta_data: meta,
        };
    });

    const order = {
        payment_method: customerData.paymentMethod || "square",
        payment_method_title: customerData.paymentMethodTitle || "Square / Credit Card",
        set_paid: false,
        billing: customerData.billing,
        shipping: customerData.shipping,
        line_items: lineItems,
        shipping_lines: [
            { method_id: "flat_rate", method_title: "Standard Shipping", total: "0.00" },
        ],
    };

    const coupons = [];
    if (customerData.couponCode) {
        coupons.push({ code: customerData.couponCode });
    }
    if (customerData.appliedGiftCard) {
        coupons.push({ code: customerData.appliedGiftCard.code });
        order.fee_lines = [
            {
                name: `Gift Card Discount (${customerData.appliedGiftCard.code})`,
                total: `-${customerData.appliedGiftCard.balance.toFixed(2)}`,
                tax_status: "none"
            }
        ];
    }

    if (coupons.length > 0) {
        order.coupon_lines = coupons;
    }

    return order;
}
