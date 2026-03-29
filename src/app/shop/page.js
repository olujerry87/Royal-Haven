import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Reviews from "@/components/Reviews";
import styles from "./page.module.css";
import { getProducts } from "@/lib/woocommerce";
import ShopClient from "./ShopClient";
import { SITE_MEDIA } from "@/config/media";

export const dynamic = 'force-dynamic';

export default async function Shop({ searchParams }) {
    const sParams = await searchParams;
    const categoryQuery = sParams?.category || "All";
    // Fetch products from WooCommerce (Server Component)
    let products = [];
    let error = null;

    try {
        products = await getProducts();
    } catch (err) {
        error = err.message;
        console.error("Failed to fetch products from WooCommerce:", err);
    }

    return (
        <main className={styles.shopContainer}>
            <Hero
                title="The Collection"
                subtitle="Heritage Woven Into Modern Silhouettes"
                imagePath={SITE_MEDIA.shop.hero}
            />

            {error ? (
                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <h2>Unable to load products</h2>
                    <p>Please check your WordPress connection: {error}</p>
                </div>
            ) : products.length === 0 ? (
                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <h2>No products found</h2>
                    <p>Add products in your WordPress admin: WooCommerce → Products</p>
                </div>
            ) : (
                <ShopClient products={products} initialCategory={categoryQuery} />
            )}

            <Reviews />
        </main>
    );
}
