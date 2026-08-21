import { NextResponse } from "next/server";
import { getHeritageMorphData, updateHeritageMorphConfig, saveHeritageMicroCards } from "@/lib/heritageSupabase";

export async function GET() {
    try {
        const data = await getHeritageMorphData();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { config, cards } = body;

        if (config) {
            await updateHeritageMorphConfig(config);
        }
        if (cards && Array.isArray(cards)) {
            await saveHeritageMicroCards(cards);
        }

        const updated = await getHeritageMorphData();
        return NextResponse.json({ success: true, message: "Heritage morph configuration updated successfully.", data: updated });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
