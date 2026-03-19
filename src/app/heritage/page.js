import { getPageBySlug } from "@/lib/wordpress";
import HeritageClient from "./HeritageClient";

export const metadata = {
    title: "Heritage | Wura & Ewa",
    description: "The story of Royal Haven - where indigenous fashion meets modern artistry.",
};

export default async function Heritage() {
    let pageData = null;

    try {
        // Try 'heritage' first, then 'about' as fallback
        pageData = await getPageBySlug('heritage') || await getPageBySlug('about');
    } catch (error) {
        console.error("Failed to fetch heritage page:", error);
    }

    return <HeritageClient page={pageData} />;
}
