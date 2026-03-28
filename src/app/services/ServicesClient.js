"use client";

import Hero from "@/components/Hero";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./page.module.css";

const GENERAL_PRICING = [
    { title: "Hair Artistry", price: "from $40" },
    { title: "Makeup & Glam", price: "from $70" },
    { title: "Gele Tying", price: "from $25" }
];

export default function ServicesClient({ page, portfolio, testimonials }) {
    // Fallback data
    const data = {
        title: page?.acf?.hero_title || "Artistry Services",
        subtitle: page?.acf?.hero_subtitle || "Bridal, Editorial, and Bespoke Beauty",
        heroImage: page?.acf?.hero_image || "/images/spotlight.jpg",
        introTitle: page?.acf?.intro_title || "The Ewa Experience",
        introText: page?.acf?.intro_text || "We believe that beauty is an art form. Our approach is rooted in enhancing your natural essence while delivering a polished, high-editorial finish. Whether you are walking down the aisle or stepping onto a set, Ewa ensures you look—and feel—radiant.",
        portfolio: portfolio && portfolio.length > 0 ? portfolio.map(item => ({
            id: item.id,
            image: item.acf?.image || item.featured_media_url || "/images/spotlight.jpg",
            title: item.title?.rendered || "Portfolio Item"
        })) : [
            { id: 1, image: "/images/spotlight.jpg", title: "Bridal Glamour" },
            { id: 2, image: "/images/banner-1.jpg", title: "Editorial Campaign" },
            { id: 3, image: "/images/ewa-idle.jpg", title: "Traditional Elegance" },
            { id: 4, image: "/images/journal.jpg", title: "Studio Portraits" }
        ],
        testimonials: testimonials && testimonials.length > 0 ? testimonials.map(item => ({
            id: item.id,
            quote: item.content?.rendered?.replace(/<[^>]+>/g, '') || "Testimonial content",
            author: item.title?.rendered || "Client"
        })) : [
            { id: 1, quote: "Ewa made me feel like royalty on my wedding day. The attention to detail was unmatched.", author: "Adeola B." },
            { id: 2, quote: "Professional, calm, and incredibly talented. My entire bridal party looked stunning.", author: "Chioma O." },
            { id: 3, quote: "The best editorial make-up artist I've worked with. She understands light and skin texture perfectly.", author: "Studio 54 Photography" }
        ],
    };

    return (
        <main>
            <Hero
                title={data.title}
                subtitle={data.subtitle}
                imagePath={data.heroImage}
            />

            <div className={styles.container}>
                {/* Intro */}
                <div className={styles.intro}>
                    <motion.h2
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {data.introTitle}
                    </motion.h2>
                    <p className={styles.text} dangerouslySetInnerHTML={{ __html: data.introText }} />
                    <Link href="/services/book" className="btn-primary">
                        Inquire for Availability
                    </Link>
                </div>

                {/* Portfolio Grid */}
                <section className={styles.portfolioSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Selected Works</h2>
                    </div>
                    <div className={styles.grid}>
                        {data.portfolio.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className={styles.gridItem}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <img src={item.image} alt={item.title} className={styles.gridImage} />
                                <div className={styles.caption}>{item.title}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Love Notes (Testimonials) */}
            <section className={styles.loveNotesSection}>
                <h2 className={styles.title} style={{ color: 'var(--off-white)' }}>Love Notes</h2>
                <div className={styles.notesGrid}>
                    {data.testimonials.map((note) => (
                        <div key={note.id} className={styles.noteCard}>
                            <p className={styles.quote}>&quot;{note.quote}&quot;</p>
                            <p className={styles.author}>— {note.author}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className={styles.container}>
                {/* Simplified Service Menu */}
                <section className={styles.menuSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Service Menu</h2>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                        {GENERAL_PRICING.map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1rem', paddingTop: '1rem' }}>
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '1.2rem', color: 'var(--obsidian)' }}>{item.title}</span>
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '1.2rem', fontWeight: 500, color: 'var(--charcoal)' }}>{item.price}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <Link href="/services/details" className={styles.detailsBtn}>
                            View Detailed Pricing
                        </Link>
                    </div>

                    <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--gold)', color: 'var(--obsidian)', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Additional Information</p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>* Home service charge applies on all services depending on location.</p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', marginTop: '0.2rem' }}>* Available to travel.</p>
                    </div>

                    <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                        <Link href="/services/book" className="btn-primary">
                            Book Now
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
