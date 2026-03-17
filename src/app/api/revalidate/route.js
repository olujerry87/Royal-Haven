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
        // 1. Verify the secret token sent by WordPress webhook
        const secret = request.headers.get("x-wc-webhook-secret");
        if (REVALIDATE_SECRET && secret !== REVALIDATE_SECRET) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json().catch(() => ({}));

        // 2. Purge the shop pages and individual product if we can
        revalidatePath("/shop");
        revalidateTag("woocommerce-products");

        if (body?.slug) {
            revalidatePath(`/shop/${body.slug}`);
        }

        console.log("[ISR] Revalidated /shop and product pages via webhook.");
        return NextResponse.json({ revalidated: true, timestamp: Date.now() });
    } catch (err) {
        console.error("[ISR] Revalidation error:", err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// Also support GET for easy manual testing: /api/revalidate?secret=xxx&path=/shop
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const path = searchParams.get("path") || "/shop";

    if (REVALIDATE_SECRET && secret !== REVALIDATE_SECRET) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path, timestamp: Date.now() });
}
