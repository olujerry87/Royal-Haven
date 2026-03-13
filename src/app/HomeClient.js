"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import Heritage from "@/components/Heritage";
import PromoBanner from "@/components/PromoBanner";
import FeaturedSpotlight from "@/components/FeaturedSpotlight";
import FAQ from "@/components/FAQ";
import Reviews from "@/components/Reviews";
import ScrollProgress from "@/components/ScrollProgress";

export default function HomeClient({ acf }) {
    const [hoveredSection, setHoveredSection] = useState(null);

    // Fallback data if ACF is missing/empty
    const data = {
        wura: {
            bgImage: acf?.wura_bg_image || "/images/wura-idle.jpg",
            bgVideo: acf?.wura_bg_video || "/videos/wura-bg.mp4",
            logo: acf?.wura_logo || "/logos/wura-logo.png",
            subtitle: acf?.wura_subtitle || "Modern Indigenous Fashion. <br /> Unisex & Female Collections.",
            link: acf?.wura_link || "/shop"
        },
        ewa: {
            bgImage: acf?.ewa_bg_image || "/images/ewa-idle.jpg",
            bgVideo: acf?.ewa_bg_video || "/videos/ewa-bg.mp4",
            logo: acf?.ewa_logo || "/logos/ewa-logo.png",
            subtitle: acf?.ewa_subtitle || "Luxury Artistry. <br /> Bridal, Editorial & Hair.",
            link: acf?.ewa_link || "/services"
        },
        heritage: {
            title: acf?.heritage_title, // component has default
            text: acf?.heritage_text    // component has default
        },
        promoSlides: acf?.promo_slides ? acf.promo_slides.map(slide => ({
            type: slide.type,
            content: slide.content,
            sub: slide.sub_text,
            image: slide.image,
            alt: slide.alt_text || "Promo",
            link: slide.link || "/shop"
        })) : undefined, // undefined triggers default in component
        spotlight1: {
            title: acf?.spotlight_1_title || "Set For Effortless Intentions",
            description: acf?.spotlight_1_desc || "Move with purpose. Breathe with ease. <br /> Our new Heritage Silk collection is designed for moments of pure clarity.",
            image: acf?.spotlight_1_image || "/images/spotlight.jpg",
            link: acf?.spotlight_1_link || "/shop"
        },
        spotlight2: {
            image: acf?.spotlight_2_image || "/images/journal.jpg",
            link: acf?.spotlight_2_link || null
        }
    };

    return (
        <main className={styles.main}>
            {/* 100vh Split Screen Hero Wrapper */}
            <div className={styles.splitWrapper}>

                {/* Wura Section (Left/Top) */}
                <motion.div
                    className={`${styles.splitSection} ${styles.wura}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    onMouseEnter={() => setHoveredSection('wura')}
                    onMouseLeave={() => setHoveredSection(null)}
                >
                    <div className={styles.bgContainer}>
                        {/* Idle Background Image */}
                        <Image
                            src={data.wura.bgImage}
                            alt="Wura Background"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className={styles.bgImage}
                            priority
                        />

                        {/* Video Background - Fades in on Hover */}
                        <video
                            className={`${styles.bgVideo} ${hoveredSection === 'wura' ? styles.videoVisible : ''}`}
                            autoPlay
                            muted
                            loop
                            playsInline
                            poster={data.wura.bgImage}
                        >
                            <source src={data.wura.bgVideo} type="video/mp4" />
                        </video>

                        <div className={styles.overlay}></div>
                    </div>

                    <div className={styles.content}>
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className={styles.logoContainer}
                        >
                            <Image
                                src={data.wura.logo}
                                alt="WURA"
                                width={1120}
                                height={440}
                                className={styles.logo}
                                priority
                            />
                        </motion.div>

                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            dangerouslySetInnerHTML={{ __html: data.wura.subtitle }}
                        />

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                        >
                            <Link href={data.wura.link} className="btn-primary">
                                Shop The Collection
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Ewa Section (Right/Bottom) */}
                <motion.div
                    className={`${styles.splitSection} ${styles.ewa}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    onMouseEnter={() => setHoveredSection('ewa')}
                    onMouseLeave={() => setHoveredSection(null)}
                >
                    <div className={styles.bgContainer}>
                        {/* Idle Background Image */}
                        <Image
                            src={data.ewa.bgImage}
                            alt="Ewa Background"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className={styles.bgImage}
                            priority
                        />

                        {/* Video Background - Fades in on Hover */}
                        <video
                            className={`${styles.bgVideo} ${hoveredSection === 'ewa' ? styles.videoVisible : ''}`}
                            autoPlay
                            muted
                            loop
                            playsInline
                            poster={data.ewa.bgImage}
                        >
                            <source src={data.ewa.bgVideo} type="video/mp4" />
                        </video>

                        <div className={styles.overlay}></div>
                    </div>

                    <div className={styles.content}>
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className={styles.logoContainer}
                        >
                            <Image
                                src={data.ewa.logo}
                                alt="EWA"
                                width={976}
                                height={526}
                                className={styles.logo}
                            />
                        </motion.div>

                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                        >
                            <span dangerouslySetInnerHTML={{ __html: data.ewa.subtitle }} />
                        </motion.p>
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                        >
                            <Link href={data.ewa.link} className="btn-primary">
                                Book Appointment <ArrowRight size={16} style={{ display: 'inline', marginLeft: '8px' }} />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Sticky Progress Bar */}
            <ScrollProgress />

            {/* Expanded Content */}
            <Heritage
                title={data.heritage.title}
                text={data.heritage.text}
            />
            <PromoBanner slides={data.promoSlides} />

            <div style={{ height: '40px', backgroundColor: '#FFFFFF', width: '100%' }} />

            <FeaturedSpotlight
                title={data.spotlight1.title}
                description={data.spotlight1.description}
                imagePath={data.spotlight1.image}
                ctaLink={data.spotlight1.link}
            />

            <FAQ />

            <FeaturedSpotlight
                title={null}
                description={null}
                ctaText={null}
                ctaLink={data.spotlight2.link}
                imagePath={data.spotlight2.image}
                hasGlassCard={false}
            />

            <Reviews />
        </main>
    );
}
