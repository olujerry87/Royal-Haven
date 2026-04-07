"use client";

import styles from "./Hero.module.css";
import { SITE_MEDIA } from "@/config/media";

export default function Hero({ title, subtitle, imagePath = SITE_MEDIA.placeholders.hero, mobileImagePath, overlayImage, height = "70vh" }) {
    const overlayStyle = overlayImage ? {
        backgroundImage: `url(${overlayImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover"
    } : {};

    // Generate a unique identifier for this specific Hero instance's injected style
    const heroId = `hero-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <section
            className={`${styles.hero} ${heroId}`}
            style={{
                backgroundImage: `url(${imagePath})`,
                height: height
            }}
        >
            {/* Inject mobile-specific background via inline pseudo-stylesheet if mobile path exists */}
            {mobileImagePath && (
                <style dangerouslySetInnerHTML={{__html: `
                    @media (max-width: 768px) {
                        .${heroId} {
                            background-image: url('${mobileImagePath}') !important;
                            background-position: top center !important;
                        }
                    }
                `}} />
            )}

            <div className={styles.overlay} style={overlayStyle}></div>
            <div className={styles.content}>
                <h1 className={styles.title}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
        </section>
    );
}
