import { getPageBySlug } from "@/lib/wordpress";
import BookClient from "./BookClient";

export const metadata = {
    title: "Book an Appointment | Royal Haven",
    description: "Schedule your bridal consultation, editorial shoot, or bespoke beauty session.",
};

export default async function Book() {
    let pageData = null;

    try {
        pageData = await getPageBySlug('book');
    } catch (error) {
        console.error("Failed to fetch book page:", error);
    }

    return <BookClient page={pageData} />;
}
