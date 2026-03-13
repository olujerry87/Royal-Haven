// WooCommerce REST API using native fetch
// This approach is more reliable than the @woocommerce/woocommerce-rest-api package

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8080';
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

/**
 * Build WooCommerce API URL with authentication
 * @param {string} endpoint - API endpoint (e.g., "products", "orders")
 * @param {object} params - Query parameters
 */
function buildWCUrl(endpoint, params = {}) {
    const url = new URL(`${WP_URL}/wp-json/wc/v3/${endpoint}`);

    // Add authentication
    url.searchParams.append('consumer_key', CONSUMER_KEY);
    url.searchParams.append('consumer_secret', CONSUMER_SECRET);

    // Add other params
    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });

    return url.toString();
}

/**
 * Generic fetch function for WooCommerce API
 */
async function fetchWC(endpoint, params = {}, options = {}) {
    const url = buildWCUrl(endpoint, params);

    // Debug: Check if keys are present (only log on server or if explicit debug flag is set)
    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
        console.error("⚠️ WooCommerce API Keys are missing! Check WC_CONSUMER_KEY and WC_CONSUMER_SECRET in .env.local");
    }

    try {
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`WooCommerce API error: ${res.status} ${res.statusText} - ${errorText}`);
        }

        return res.json();
    } catch (error) {
        console.error(`Error fetching from WooCommerce: ${endpoint}`, error);
        throw error;
    }
}

/**
 * Fetch all products from WooCommerce
 * @param {object} params - Query parameters (per_page, page, category, etc.)
 */
import { mockProducts } from './mockData';

// ... (keep existing imports/code if any, but we are replacing the function)

/**
 * Fetch all products from WooCommerce
 * @param {object} params - Query parameters (per_page, page, category, etc.)
 */
export async function getProducts(params = {}) {
    // TEMPORARY: Return mock data efficiently
    console.log("Serving Mock Data for Products");
    return new Promise((resolve) => {
        setTimeout(() => {
            // Return raw objects because consumers (ShopClient, ProductPage) expect [{ src: ... }]
            resolve(mockProducts);
        }, 500);
    });
    // return fetchWC('products', { per_page: 100, ...params });
}

/**
 * Fetch a single product by slug
 * @param {string} slug - Product slug
 */
/**
 * Fetch a single product by slug
 * @param {string} slug - Product slug
 */
export async function getProductBySlug(slug) {
    console.log(`Serving Mock Data for Product Slug: ${slug}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            const product = mockProducts.find(p => p.slug === slug);
            resolve(product || null);
        }, 300);
    });
    // const products = await fetchWC('products', { slug });
    // return products[0] || null;
}

/**
 * Fetch a single product by ID
 * @param {number} productId - Product ID
 */
export async function getProductById(productId) {
    // console.log(`Serving Mock Data for Product ID: ${productId}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            const product = mockProducts.find(p => p.id === parseInt(productId));
            resolve(product || null);
        }, 300);
    });
    // return fetchWC(`products/${productId}`);
}

/**
 * Fetch product categories
 */
export async function getProductCategories() {
    return fetchWC('products/categories');
}

/**
 * Fetch products by category
 * @param {number} categoryId - Category ID
 */
export async function getProductsByCategory(categoryId, params = {}) {
    return fetchWC('products', { category: categoryId, ...params });
}

/**
 * Create an order in WooCommerce
 * @param {object} orderData - Order data (line_items, billing, shipping, etc.)
 */
export async function createOrder(orderData) {
    return fetchWC('orders', {}, {
        method: 'POST',
        body: JSON.stringify(orderData),
    });
}

/**
 * Get order by ID
 * @param {number} orderId - Order ID
 */
export async function getOrderById(orderId) {
    return fetchWC(`orders/${orderId}`);
}

/**
 * Convert cart items to WooCommerce order format
 * @param {array} cartItems - Array of cart items from CartContext
 * @param {object} customerData - Customer billing/shipping info
 */
export function formatOrderData(cartItems, customerData) {
    const lineItems = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        // Add variation_id if using product variations for sizes
        meta_data: [
            {
                key: 'Size',
                value: item.size
            }
        ]
    }));

    const order = {
        payment_method: "bacs", // Bank transfer (change as needed)
        payment_method_title: "Direct Bank Transfer",
        set_paid: false,
        billing: customerData.billing,
        shipping: customerData.shipping,
        line_items: lineItems,
        shipping_lines: [
            {
                method_id: "flat_rate",
                method_title: "Flat Rate",
                total: "0.00" // Update with actual shipping cost
            }
        ]
    };

    // Add coupon if present
    if (customerData.couponCode) {
        order.coupon_lines = [
            {
                code: customerData.couponCode
            }
        ];
    }

    return order;
}
