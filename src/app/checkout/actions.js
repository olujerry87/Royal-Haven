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
 * Server-side Square Payment Capture
 *
 * Calls Square Payments REST API /v2/payments with autocomplete: true.
 * This is the ACTUAL charge/capture step. The nonce from cardInstance.tokenize()
 * on the frontend is only a single-use authorization token — without this call,
 * the payment sits as an uncaptured hold in the Square Dashboard.
 *
 * @param {string} sourceId       - The payment nonce from Square Web Payments SDK
 * @param {number} amountCents    - Total charge amount in cents (e.g. 9999 = $99.99 CAD)
 * @param {string} currency       - ISO currency code, default "CAD"
 * @param {string} buyerEmail     - Buyer email for Square receipt
 * @returns {object}              - Square Payment object { id, status, ... }
 */
async function chargeSquare(sourceId, amountCents, currency = "CAD", buyerEmail = null) {
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const squareEnv   = (process.env.SQUARE_ENVIRONMENT || "production").trim().toLowerCase();

    if (!accessToken) {
        throw new Error(
            "SQUARE_ACCESS_TOKEN is not set in environment variables. " +
            "Add it in Vercel → Project → Settings → Environment Variables."
        );
    }

    const baseUrl = squareEnv === "sandbox"
        ? "https://connect.squareupsandbox.com"
        : "https://connect.squareup.com";

    // Idempotency key: unique per request to prevent duplicate charges on retry
    const idempotencyKey = `royal-haven-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const body = {
        source_id: sourceId,
        idempotency_key: idempotencyKey,
        amount_money: {
            amount: Math.round(amountCents), // must be integer cents
            currency: currency.toUpperCase(),
        },
        autocomplete: true, // true = immediate capture; false = authorize-only hold
        note: "Royal Haven — Online Store Order",
    };

    if (buyerEmail) {
        body.buyer_email_address = buyerEmail;
    }

    const response = await fetch(`${baseUrl}/v2/payments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Square-Version": "2024-02-22",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || (data.errors && data.errors.length > 0)) {
        const squareError = data.errors?.[0];
        const detail = squareError?.detail || squareError?.code || "Square payment charge failed";
        console.error("[chargeSquare] Square API error:", data.errors);
        throw new Error(detail);
    }

    if (!data.payment || data.payment.status !== "COMPLETED") {
        throw new Error(
            `Square payment did not complete. Status: ${data.payment?.status || "unknown"}`
        );
    }

    return data.payment; // { id, status: "COMPLETED", receipt_url, ... }
}

/**
 * Server Action to place an order securely.
 * STRICT: Requires a valid Square credit card paymentToken (sourceId).
 */
export async function placeOrder(cart, customerData, paymentToken = null, chargeAmountCents = 0) {
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

        // ── STEP 1: Charge the card via Square Payments REST API ─────────
        // cardInstance.tokenize() on the frontend returns a ONE-TIME nonce (pre-auth only).
        // We MUST call /v2/payments server-side with autocomplete: true to actually
        // capture/charge the card. Without this, Square shows an uncaptured hold.
        let squarePayment;
        try {
            squarePayment = await chargeSquare(
                paymentToken,
                chargeAmountCents,
                "CAD",
                customerData.billing?.email || null
            );
            console.log("[placeOrder] Square charge COMPLETED:", squarePayment.id, squarePayment.status);
        } catch (squareErr) {
            console.error("[placeOrder] Square charge failed:", squareErr.message);
            return {
                success: false,
                error: `Payment declined: ${squareErr.message}. Your card was not charged.`,
            };
        }

        // ── STEP 2: Create WooCommerce order with real Square payment ID ──
        // Setting status: "processing" + set_paid: true triggers WC receipt emails.
        orderData.payment_method = "square";
        orderData.payment_method_title = "Credit Card (Square)";
        orderData.transaction_id = squarePayment.id; // Real Square Payment ID, not the nonce
        orderData.set_paid = true;
        orderData.status = "processing";

        if (!orderData.meta_data) orderData.meta_data = [];
        orderData.meta_data.push({ key: "_square_payment_id",     value: squarePayment.id });
        orderData.meta_data.push({ key: "_square_payment_status", value: squarePayment.status });
        orderData.meta_data.push({ key: "Square Payment Status",  value: "COMPLETED — Captured via Square REST API" });
        if (squarePayment.receipt_url) {
            orderData.meta_data.push({ key: "Square Receipt URL", value: squarePayment.receipt_url });
        }

        // ── STEP 3: Create order via WooCommerce REST API ─────────────────
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
