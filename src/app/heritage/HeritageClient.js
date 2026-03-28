"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Hero from "@/components/Hero";
import HeritageAnimation from "@/components/HeritageAnimation";
import styles from "./page.module.css";
import WeatherStyling from "@/components/passport/WeatherStyling";
import WardrobeWidget from "@/components/wardrobe/WardrobeWidget";
import SocialShare from "@/components/passport/SocialShare";

export default function AboutClient({ page }) {
    // Fallback data
    const acf = page?.acf || {};

    // Helper to safely get value
    const getVal = (key, fallback) => acf[key] || fallback;

    const data = {
        hero: {
            title: getVal('hero_title', 'Our Heritage'),
            subtitle: getVal('hero_subtitle', 'The Convergence of Fashion & Artistry'),
            image: getVal('hero_image', '/images/spotlight.jpg')
        },
        duality: {
            heading: getVal('duality_heading', 'Two Worlds. One Vision.'),
            lead: getVal('duality_lead', 'Wura & Ewa was born from the desire to merge the tactile elegance of indigenous fashion with the ethereal beauty of modern artistry.'),
            text: getVal('duality_text', '"Wura" (Gold) represents our clothing line—precious, timeless, and forged with intent. "Ewa" (Beauty) embodies our artistry services—enhancing the natural essence of every individual. Together, they form a sanctuary of style known as Royal Haven, a subsidary of Bezaleel Group.'),
            image1: getVal('duality_image_1', '/images/wura-idle.jpg'),
            image2: getVal('duality_image_2', '/images/ewa-idle.jpg')
        },
        values: [
            {
                title: getVal('value_1_title', 'Craftsmanship'),
                text: getVal('value_1_text', 'Every stitch tells a story. We prioritize high-quality fabrics and indigenous techniques that honor our roots.')
            },
            {
                title: getVal('value_2_title', 'Culture'),
                text: getVal('value_2_text', 'We are a modern reimagining of heritage. Our designs and services are deeply rooted in cultural pride.')
            },
            {
                title: getVal('value_3_title', 'Elegance'),
                text: getVal('value_3_text', 'True luxury is effortless. Whether it\'s a garment or a bridal look, our goal is timeless sophistication.')
            }
        ],
        journey: {
            heading: getVal('journey_heading', 'The Journey'),
            text: getVal('journey_text', 'Founded in 2017 in Nigeria, Wura & Ewa began as a passion project exploring the duality of fashion and artistry. Evolving significantly over the years, the brand was formally refounded in Canada in 2026, bringing its rich African heritage to a global audience.'),
            quote: getVal('journey_quote', '"We don\'t just dress you; we adorn you."')
        }
    };

    return (
        <main className={styles.main}>
            <Hero
                title={data.hero.title}
                subtitle={data.hero.subtitle}
                imagePath={data.hero.image}
                overlayImage="https://cdn.builder.io/api/v1/image/assets%2F48904b6ada2c4086ab7af82900bb21db%2Ff7dee33d8cd74ba183c59b0e10d0912d"
            />

            {/* The Duality */}
            <section className={styles.section}>
                <div className={styles.dualityContainer}>
                    <motion.div
                        className={styles.dualityContent}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className={styles.heading} dangerouslySetInnerHTML={{ __html: data.duality.heading }} />
                        <p className={`${styles.text} ${styles.lead}`} dangerouslySetInnerHTML={{ __html: data.duality.lead }} />
                        <p className={styles.text} dangerouslySetInnerHTML={{ __html: data.duality.text }} />
                    </motion.div>

                    <div className={styles.imageGrid}>
                        <motion.div
                            className={styles.imageWrapper}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <img src={data.duality.image1} alt="Wura Fashion" className={styles.image} />
                        </motion.div>
                        <motion.div
                            className={styles.imageWrapper}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <img src={data.duality.image2} alt="Ewa Artistry" className={styles.image} />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className={styles.valuesSection}>
                <div className={styles.valuesContainer}>
                    {data.values.map((val, i) => (
                        <motion.div
                            key={i}
                            className={styles.valueItem}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <h3>{val.title}</h3>
                            <p>{val.text}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* The Journey */}
            <section className={styles.section}>
                <div className={styles.journeySection}>
                    <motion.h2
                        className={styles.heading}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        {data.journey.heading}
                    </motion.h2>
                    <motion.p
                        className={styles.text}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        dangerouslySetInnerHTML={{ __html: data.journey.text }}
                    />
                    <motion.blockquote
                        className={styles.blockquote}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {data.journey.quote}
                    </motion.blockquote>
                </div>
            </section>

            {/* Living Heritage Animation */}
            <HeritageAnimation />

            {/* Styling Intelligence — Digital Closet */}
            <section id="styling" className={styles.section} style={{ backgroundColor: 'var(--obsidian)', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <div className={styles.journeySection}>
                    <h2 className={styles.heading} style={{ color: 'var(--gold)' }}>Styling Intelligence</h2>
                    <p className={styles.text} style={{ color: 'var(--off-white)', marginBottom: '3rem' }}>
                        Beat closet paralysis. Tell us your vibe and we&apos;ll build your look around today&apos;s weather — no sign-up needed.
                    </p>
                    <WardrobeWidget />
                </div>
            </section>

            {/* Social Sharing */}
             <section className={styles.section} style={{ backgroundColor: 'var(--obsidian)', paddingBottom: '4rem' }}>
                <div className={styles.journeySection}>
                     <SocialShare 
                        garment={{ 
                            garment_name: "Signature Wura Silk", 
                            collection: "Heritage", 
                            id: "royal-haven-exclusive" 
                        }} 
                        context="heritage" 
                    />
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2 className={styles.heading} style={{ color: 'var(--obsidian)' }}>Experience the Brand</h2>
                    <div className={styles.ctaButtons}>
                        <Link href="/shop" className="btn-primary">
                            Shop Wura Collection
                        </Link>
                        <Link href="/services" className="btn-primary">
                            Book Ewa Services
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
