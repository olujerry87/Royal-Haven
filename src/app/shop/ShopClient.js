"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";

export default function ShopClient({ products }) {
    const [activeCategory, setActiveCategory] = useState("All");

    // Extract unique categories from WooCommerce products
    const wcCategories = products.flatMap(p =>
        p.categories ? p.categories.map(cat => cat.name) : []
    );
    const uniqueCategories = ["All", ...new Set(wcCategories)];

    // Filter products by category
    const filteredProducts = activeCategory === "All"
        ? products
        : products.filter(p =>
            p.categories?.some(cat => cat.name === activeCategory)
        );

    return (
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <h3 className={styles.filterTitle}>Category</h3>
                <ul className={styles.categoryList}>
                    {uniqueCategories.map(cat => (
                        <li key={cat}>
                            <button
                                className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Product Grid */}
            <section className={styles.grid}>
                {filteredProducts.map(product => {
                    // Transform WooCommerce product to our ProductCard format
                    const transformedProduct = {
                        id: product.id,
                        name: product.name,
                        price: product.price && !isNaN(parseFloat(product.price))
                            ? parseFloat(product.price)
                            : 0,
                        images: product.images?.map(img => img.src) || [],
                        slug: product.slug,
                        category: product.categories?.[0]?.name || 'Uncategorized'
                    };

                    return (
                        <ProductCard key={product.id} product={transformedProduct} />
                    );
                })}
            </section>
        </div>
    );
}
