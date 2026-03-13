import { getPageBySlug, getPortfolio, getTestimonials } from "@/lib/wordpress";
import ServicesClient from "./ServicesClient";

export const metadata = {
    title: "Services | Royal Haven",
    description: "Bridal, Editorial, and Bespoke Beauty Services by Ewa.",
};

export default async function Services() {
    // Fetch data with error handling
    let pageData = null;
    let portfolioData = [];
    let testimonialsData = [];

    try {
        pageData = await getPageBySlug('services');
    } catch (error) {
        console.error("Failed to fetch services page:", error);
    }

    try {
        portfolioData = await getPortfolio({ per_page: 4 });
    } catch (error) {
        console.error("Failed to fetch portfolio:", error);
    }

    try {
        testimonialsData = await getTestimonials({ per_page: 3 });
    } catch (error) {
        console.error("Failed to fetch testimonials:", error);
    }

    return (
        <ServicesClient
            page={pageData}
            portfolio={portfolioData}
            testimonials={testimonialsData}
        />
    );
}
