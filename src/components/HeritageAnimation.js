"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Scissors, Feather, Gem, Sparkles, User, Palette, Image as ImageIcon } from "lucide-react";
import styles from "./HeritageAnimation.module.css";

// You can swap the 'image_url' fields below with your public Supabase Storage bucket URLs!
// e.g., "https://xyz.supabase.co/storage/v1/object/public/royal_haven_assets/hero/precision-cut.png"
const floatingElements = [
    { id: 1, text: "Precision Cut", icon: Scissors, x: -250, y: -150, image_url: null },
    { id: 2, text: "Silk Textures", icon: Feather, x: 250, y: -150, image_url: null },
    { id: 3, text: "Royal Gems", icon: Gem, x: -300, y: 0, image_url: null },
    { id: 4, text: "Artistic Vision", icon: Palette, x: 300, y: 0, image_url: null },
    { id: 5, text: "Custom Fit", icon: User, x: -250, y: 150, image_url: null },
    { id: 6, text: "Beaded Detail", icon: Sparkles, x: 250, y: 150, image_url: null },
];

function FloatingCard({ item, index, isMobile }) {
    // Dynamically scale down the positioning bounds on mobile so they hug the model closer
    const responsiveX = isMobile ? item.x * 0.45 : item.x;
    const responsiveY = isMobile ? item.y * 0.5 : item.y;
    return (
        <motion.div
            className={styles.glassCard}
            style={{ 
                left: `calc(50% + ${responsiveX}px)`, 
                top: `calc(50% + ${responsiveY}px)`,
                transform: 'translate(-50%, -50%)',
                zoom: isMobile ? 0.65 : 1 // Shrink physical card size significantly on mobile
            }}
            // Smooth continuous breathing animation
            animate={{
                y: [0, -15, 0],
                rotate: [0, responsiveX > 0 ? 2 : -2, 0]
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "mirror",
                delay: index * 0.5,
                ease: "easeInOut"
            }}
        >
            <div className={styles.iconPlaceholder} style={{ overflow: "hidden", position: "relative" }}>
                {item.image_url ? (
                    <Image src={item.image_url} alt={item.text} fill style={{objectFit: 'cover'}} unoptimized />
                ) : (
                    <ImageIcon size={20} style={{ opacity: 0.5 }} />
                )}
            </div>
            <div className={styles.cardText}>
                {item.text}
            </div>
        </motion.div>
    );
}

export default function HeritageAnimation() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section className={styles.container}>
            <div className={styles.stickyWrapper}>

                {/* Central Model Placeholder */}
                <motion.div
                    className={styles.modelPlaceholder}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <div>Living Heritage</div>
                </motion.div>


                {/* Floating Elements */}
                {floatingElements.map((item, index) => (
                    <FloatingCard
                        key={item.id}
                        item={item}
                        index={index}
                        isMobile={isMobile}
                    />
                ))}
            </div>
        </section>
    );
}
