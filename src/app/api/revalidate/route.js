/**
 * /api/revalidate — On-Demand ISR webhook endpoint.
 *
 * WordPress/WooCommerce calls this URL when products are created, updated or deleted.
 * Set up a webhook in: WordPress Admin → WooCommerce → Settings → Advanced → Webhooks
 *   Delivery URL: https://your-vercel-domain.vercel.app/api/revalidate
 *   Secret: matches REVALIDATE_SECRET env var
 *   Topic: Product created / Product updated / Product deleted
 */
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(request) {
    try {
        const { searchParams } = new URL(request.url);
        const manualSecret = searchParams.get("secret");
        
        // 1. Check if it's a manual/Builder.io call via URL secret
        if (manualSecret && REVALIDATE_SECRET && manualSecret === REVALIDATE_SECRET) {
            const path = searchParams.get("path") || "/";
            revalidatePath(path);
            console.log(`[ISR] Manual revalidation for: ${path}`);
            return NextResponse.json({ revalidated: true, path });
        }

        // 2. Check if it's a WooCommerce Webhook (uses header secret)
        const wcSecret = request.headers.get("x-wc-webhook-secret");
        if (REVALIDATE_SECRET && wcSecret === REVALIDATE_SECRET) {
            const body = await request.json().catch(() => ({}));
            revalidatePath("/shop");
            revalidateTag("woocommerce-products");
            if (body?.slug) revalidatePath(`/shop/${body.slug}`);
            console.log("[ISR] WooCommerce revalidated.");
            return NextResponse.json({ revalidated: true });
        }

        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } catch (err) {
        console.error("[ISR] Revalidation error:", err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// GET remains for easy browser testing
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const path = searchParams.get("path") || "/";

    if (REVALIDATE_SECRET && secret !== REVALIDATE_SECRET) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    revalidatePath(path);
    console.log(`[ISR] GET revalidation for: ${path}`);
    return NextResponse.json({ revalidated: true, path });
}
