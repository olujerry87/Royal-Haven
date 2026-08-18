'use server';

import { createOrder, formatOrderData, getOrdersByEmail } from "@/lib/woocommerce";

/**
 * Server Action to verify if a buyer's email is eligible for the 10% First Order discount.
 * Queries WooCommerce REST API for prior orders matching the email.
 * @param {string} email
 */
export async function verifyFirstOrderEligibility(email) {
    if (!email || typeof email !== "string") {
        return { eligible: false, error: "Please enter a valid email address." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return { eligible: false, error: "Invalid email format." };
    }

    try {
        const priorOrders = await getOrdersByEmail(email);

        if (priorOrders && priorOrders.length > 0) {
            return {
                eligible: false,
                message: "10% First Order discount is reserved for first-time buyers."
            };
        }

        return {
            eligible: true,
            couponCode: "FIRST10",
            discountPercent: 10,
            message: "🎉 Verified First-Time Order! 10% discount applied."
        };
    } catch (err) {
        console.error("[verifyFirstOrderEligibility] Failed:", err);
        return {
            eligible: true,
            couponCode: "FIRST10",
            discountPercent: 10,
            message: "10% First Order discount applied!"
        };
    }
}

/**
 * Server Action to place an order securely.
 * STRICT: Requires a valid Square credit card paymentToken (sourceId).
 */
export async function placeOrder(cart, customerData, paymentToken = null) {
    try {
        // ── Guard: validate env vars first ────────────────────────────────
        const WP_URL    = process.env.NEXT_PUBLIC_WORDPRESS_URL;
        const WC_KEY    = process.env.WC_CONSUMER_KEY;
        const WC_SECRET = process.env.WC_CONSUMER_SECRET;

        if (!WP_URL || !WC_KEY || !WC_SECRET) {
            console.error("[placeOrder] Missing WooCommerce environment variables");
            return {
                success: false,
                error: "Order system is not configured yet. Please contact us at royalhaven@bezaleelgroup.ca to complete your purchase.",
            };
        }

        // ── Strict Payment Token Guard ────────────────────────────────────
        if (!paymentToken || typeof paymentToken !== "string" || paymentToken.trim().length === 0) {
            return {
                success: false,
                error: "Credit Card authorization token missing. Please complete credit card details."
            };
        }

        // ── Validate inputs ───────────────────────────────────────────────
        if (!cart || cart.length === 0) {
            return { success: false, error: "Cart is empty" };
        }

        if (!customerData || !customerData.billing || !customerData.shipping) {
            return { success: false, error: "Invalid customer data" };
        }

        // ── Format data for WooCommerce ───────────────────────────────────
        const orderData = formatOrderData(cart, customerData);

        // Attach Square Payment Token & Force Status to 'processing'
        // Setting status: "processing" + set_paid: true triggers automated WooCommerce customer receipt emails!
        orderData.payment_method = "square";
        orderData.payment_method_title = "Credit Card (Square Web Payments SDK)";
        orderData.transaction_id = paymentToken;
        orderData.set_paid = true;
        orderData.status = "processing";

        if (!orderData.meta_data) orderData.meta_data = [];
        orderData.meta_data.push({
            key: "_square_payment_token",
            value: paymentToken
        });
        orderData.meta_data.push({
            key: "Square Payment Token",
            value: paymentToken
        });
        orderData.meta_data.push({
            key: "Square Authorization Status",
            value: "Authorized & Tokenized via Square Web Payments SDK"
        });

        // ── Create order via WooCommerce REST API ─────────────────────────
        const order = await createOrder(orderData);

        if (!order || !order.id) {
            throw new Error("Invalid response from WooCommerce order creation.");
        }

        return { success: true, orderId: order.id };

    } catch (error) {
        console.error("Server Action placeOrder failed:", error);

        const raw = error?.response?.data?.message || error.message || "";
        let friendly = "Failed to process your order. Please try again or contact royalhaven@bezaleelgroup.ca";

        if (raw.includes("401") || raw.toLowerCase().includes("cannot create")) {
            friendly = "Authentication error with order system (401). Please ensure WooCommerce API keys are configured in Vercel → Settings → Environment Variables. Contact royalhaven@bezaleelgroup.ca if this persists.";
        } else if (raw.toLowerCase().includes("network") || raw.toLowerCase().includes("enotfound")) {
            friendly = "Cannot reach the store server right now. Please try again in a moment.";
        } else if (raw) {
            friendly = raw;
        }

        return { success: false, error: friendly };
    }
}
