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
import { SITE_MEDIA } from "@/config/media";

export default function HomeClient({ 
    acf,
    wuraSubtitle,
    wuraBgVideo,
    wuraBgImage,
    ewaSubtitle,
    ewaBgVideo,
    ewaBgImage,
    spotlight1Title,
    spotlight1Desc,
    spotlight1Image,
    spotlight2Image,
}) {
    const [hoveredSection, setHoveredSection] = useState(null);

    // Fallback data if ACF/Builder is missing/empty
    const data = {
        wura: {
            bgImage: wuraBgImage || acf?.wura_bg_image || SITE_MEDIA.heritage.duality_wura,
            bgVideo: wuraBgVideo || acf?.wura_bg_video || SITE_MEDIA.home.wura_video,
            logo: acf?.wura_logo || SITE_MEDIA.logos.wura,
            subtitle: wuraSubtitle || acf?.wura_subtitle || "Modern Indigenous Fashion. <br /> Unisex & Female Collections.",
            link: acf?.wura_link || "/shop"
        },
        ewa: {
            bgImage: ewaBgImage || acf?.ewa_bg_image || SITE_MEDIA.heritage.duality_ewa,
            bgVideo: ewaBgVideo || acf?.ewa_bg_video || SITE_MEDIA.home.ewa_video,
            logo: acf?.ewa_logo || SITE_MEDIA.logos.ewa,
            subtitle: ewaSubtitle || acf?.ewa_subtitle || "Luxury Artistry. <br /> Bridal, Editorial & Hair.",
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
            title: spotlight1Title || acf?.spotlight_1_title || "Set For Effortless Intentions",
            description: spotlight1Desc || acf?.spotlight_1_desc || "Move with purpose. Breathe with ease. <br /> Our new Heritage collection is designed for moments of pure clarity and effortless intention.",
            image: spotlight1Image || acf?.spotlight_1_image || SITE_MEDIA.home.spotlight_1,
            link: acf?.spotlight_1_link || "/shop"
        },
        spotlight2: {
            image: spotlight2Image || acf?.spotlight_2_image || SITE_MEDIA.home.spotlight_2,
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

            <div style={{ height: '80px', backgroundColor: '#FFFFFF', width: '100%' }} className={styles.mobileDivider} />



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
