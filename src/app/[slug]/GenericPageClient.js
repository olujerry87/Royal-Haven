"use client";

import Hero from "@/components/Hero";
import styles from "@/app/services/book/page.module.css"; // Reusing booking styles for consistency

export default function GenericPageClient({ page }) {
    if (!page) {
        return (
            <main style={{ padding: '6rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
                <h1>Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
            </main>
        );
    }

    const title = page.title?.rendered || "Page";
    const content = page.content?.rendered || "";
    // Check if there is a custom hero image in ACF, otherwise default
    const heroImage = page.acf?.hero_image || "/images/spotlight.jpg";

    return (
        <main>
            <Hero
                title={title}
                subtitle=""
                imagePath={heroImage}
            />

            <div className={styles.container} style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div
                    className="wordpress-content"
                    dangerouslySetInnerHTML={{ __html: content }}
                    style={{
                        lineHeight: '1.8',
                        fontSize: '1.1rem',
                        color: 'var(--charcoal)',
                        padding: '4rem 0'
                    }}
                />
            </div>
        </main>
    );
}
