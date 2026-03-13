'use server';

import { createOrder, formatOrderData } from "@/lib/woocommerce";

/**
 * Server Action to place an order securely.
 * This runs on the server, keeping API keys private.
 */
export async function placeOrder(cart, customerData) {
    try {
        // Validate inputs
        if (!cart || cart.length === 0) {
            return { success: false, error: "Cart is empty" };
        }

        if (!customerData || !customerData.billing || !customerData.shipping) {
            return { success: false, error: "Invalid customer data" };
        }

        // 1. Format data for WooCommerce
        const orderData = formatOrderData(cart, customerData);

        // 2. Create order via WooCommerce API
        const order = await createOrder(orderData);

        if (!order || !order.id) {
            throw new Error("Invalid response from WooCommerce");
        }

        return { success: true, orderId: order.id };

    } catch (error) {
        console.error("Server Action placeOrder failed:", error);
        return {
            success: false,
            error: error.message || "Failed to create order. Please try again."
        };
    }
}
