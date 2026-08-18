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
                message: "This 10% discount token is reserved exclusively for first-time orders."
            };
        }

        return {
            eligible: true,
            couponCode: "FIRST10",
            discountPercent: 10,
            message: "10% First Order discount verified & applied!"
        };
    } catch (err) {
        console.error("[verifyFirstOrderEligibility] Failed:", err);
        // Fallback: allow first-order eligibility if WC check fails silently
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
 * Accepts cart, customerData, and Square paymentToken (sourceId).
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

        // ── Validate inputs ───────────────────────────────────────────────
        if (!cart || cart.length === 0) {
            return { success: false, error: "Cart is empty" };
        }

        if (!customerData || !customerData.billing || !customerData.shipping) {
            return { success: false, error: "Invalid customer data" };
        }

        // ── Format data for WooCommerce ───────────────────────────────────
        const orderData = formatOrderData(cart, customerData);

        // Attach Square payment token metadata if available
        if (paymentToken) {
            orderData.transaction_id = paymentToken;
            if (!orderData.meta_data) orderData.meta_data = [];
            orderData.meta_data.push({
                key: "Square Payment Token",
                value: paymentToken
            });
            orderData.meta_data.push({
                key: "Square Web Payments SDK Status",
                value: "Tokenized Successfully (Authorized)"
            });
            orderData.set_paid = true; // Mark as paid when token is authorized
        }

        // ── Create order via WooCommerce REST API ─────────────────────────
        const order = await createOrder(orderData);

        if (!order || !order.id) {
            throw new Error("Invalid response from WooCommerce");
        }

        return { success: true, orderId: order.id };

    } catch (error) {
        console.error("Server Action placeOrder failed:", error);

        // Surface a friendly message for common errors
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
