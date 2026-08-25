import { notFound } from "next/navigation";
import { getProductBySlug, getProductVariations, getRelatedProducts } from "@/lib/woocommerce";
import ProductDetailClient from "./ProductDetailClient";

// Force-dynamic: product pages always fetch fresh data from WooCommerce
export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }) {
    const { slug } = await params;

    let product = null;
    try {
        product = await getProductBySlug(slug);
    } catch (error) {
        console.error(`Error fetching product by slug "${slug}":`, error);
    }

    if (!product) {
        notFound();
    }

    // Redirect Gift Card products safely to their dedicated purchase flow
    if (product.slug && product.slug.includes('-gift-card')) {
        const { redirect } = await import('next/navigation');
        redirect('/gift-card');
    }

    // Fetch variations (for variable products) and related products in parallel
    const [variations, relatedRaw] = await Promise.all([
        product.type === 'variable' ? getProductVariations(product.id) : Promise.resolve([]),
        getRelatedProducts(product),
    ]);

    // Transform WooCommerce product data to our format
    const transformedProduct = {
        id: product.id,
        name: product.name,
        price: product.price && !isNaN(parseFloat(product.price))
            ? parseFloat(product.price)
            : 0,
        regular_price: product.regular_price ? parseFloat(product.regular_price) : null,
        sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
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
        type: product.type || 'simple',
        meta_data: product.meta_data || [],
    };

    // Transform variations for client
    const transformedVariations = variations.map(v => ({
        id: v.id,
        attributes: v.attributes || [],
        price: v.price ? parseFloat(v.price) : transformedProduct.price,
        regular_price: v.regular_price ? parseFloat(v.regular_price) : null,
        sale_price: v.sale_price ? parseFloat(v.sale_price) : null,
        stock_status: v.stock_status || 'instock',
        stock_quantity: v.stock_quantity,
        image: v.image?.src || null,
    }));

    // Transform related products for client
    const relatedProducts = relatedRaw.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price && !isNaN(parseFloat(p.price)) ? parseFloat(p.price) : 0,
        regular_price: p.regular_price ? parseFloat(p.regular_price) : null,
        sale_price: p.sale_price ? parseFloat(p.sale_price) : null,
        image: p.images?.[0]?.src || '/images/placeholder.jpg',
        stock_status: p.stock_status || 'instock',
    }));

    return (
        <ProductDetailClient 
            product={transformedProduct} 
            variations={transformedVariations}
            relatedProducts={relatedProducts}
        />
    );
}
