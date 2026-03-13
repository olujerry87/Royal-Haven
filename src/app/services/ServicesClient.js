"use client";

import Hero from "@/components/Hero";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./page.module.css";

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
        services: page?.acf?.service_menu || [
            { title: "Bridal Consultation & Trial", price: "from $150" },
            { title: "Wedding Day Glam (Bride)", price: "Inquire" },
            { title: "Editorial / Campaign (Half Day)", price: "from $500" },
            { title: "Occasion Makeup (Studio)", price: "$120" }
        ]
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
                {/* Service Menu */}
                <section className={styles.menuSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Service Menu</h2>
                    </div>
                    <div className={styles.menuList}>
                        {data.services.map((service, index) => (
                            <div key={index} className={styles.menuItem}>
                                <span className={styles.itemTitle}>{service.title || service.service_name}</span>
                                <span className={styles.itemPrice}>{service.price || service.service_price}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '3rem' }}>
                        <Link href="/services/book" className="btn-primary">
                            Book Now
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
