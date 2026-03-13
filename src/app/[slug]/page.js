import { getPageBySlug } from "@/lib/wordpress";
import GenericPageClient from "./GenericPageClient";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);

    if (!page) {
        return {
            title: "Page Not Found | Royal Haven"
        };
    }

    return {
        title: `${page.title.rendered} | Royal Haven`,
        description: page.excerpt?.rendered?.replace(/<[^>]+>/g, '') || "Royal Haven Page"
    };
}

export default async function GenericPage({ params }) {
    const { slug } = await params;
    let pageData = null;

    try {
        pageData = await getPageBySlug(slug);
    } catch (error) {
        console.error(`Failed to fetch page: ${slug}`, error);
    }

    return <GenericPageClient page={pageData} />;
}
