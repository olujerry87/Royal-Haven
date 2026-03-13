import { getPageBySlug } from "@/lib/wordpress";
import AboutClient from "./AboutClient";

export const metadata = {
    title: "Our Heritage | Wura & Ewa",
    description: "The story of Royal Haven - where indigenous fashion meets modern artistry.",
};

export default async function About() {
    let pageData = null;

    try {
        pageData = await getPageBySlug('about');
        // If the API returns a page, but it doesn't have the expected structure or fields
        // we pass it anyway, and the Client Component handles the fallbacks.
    } catch (error) {
        console.error("Failed to fetch about page:", error);
    }

    return <AboutClient page={pageData} />;
}
