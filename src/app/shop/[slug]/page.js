import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/woocommerce";
import ProductDetailClient from "./ProductDetailClient";

// Force-dynamic: product pages always fetch fresh data from WooCommerce
// This ensures custom fields and gallery images are never stale-cached.
export const dynamic = 'force-dynamic';

// In Next.js 15, params is a Promise that needs to be awaited
export default async function ProductPage({ params }) {
    // Await params in Next.js 15+
    const { slug } = await params;

    // Fetch product from WooCommerce
    let product = null;
    try {
        product = await getProductBySlug(slug);
    } catch (error) {
        console.error(`Error fetching product by slug "${slug}":`, error);
    }

    if (!product) {
        notFound();
    }

    // Transform WooCommerce product data to our format
    const transformedProduct = {
        id: product.id,
        name: product.name,
        price: product.price && !isNaN(parseFloat(product.price))
            ? parseFloat(product.price)
            : 0,
        images: product.images && product.images.length > 0
            ? product.images.map(img => img.src)
            : ['/images/placeholder.jpg'],
        slug: product.slug,
        short_description: product.short_description || '',
        description: product.description || product.short_description || '',
        attributes: product.attributes || [],
        sku: product.sku || '',
        stock_status: product.stock_status || 'instock',
        categories: product.categories || [],
        // ✅ Pass WooCommerce custom fields (rh_origin, rh_fabric, rh_care, rh_styling, rh_ntag_id)
        meta_data: product.meta_data || [],
    };

    return <ProductDetailClient product={transformedProduct} />;
}
