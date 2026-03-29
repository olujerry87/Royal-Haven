"use client";

import styles from "./Hero.module.css";
import { SITE_MEDIA } from "@/config/media";

export default function Hero({ title, subtitle, imagePath = SITE_MEDIA.placeholders.hero, overlayImage, height = "70vh" }) {
    const overlayStyle = overlayImage ? {
        backgroundImage: `url(${overlayImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover"
    } : {};

    return (
        <section
            className={styles.hero}
            style={{
                backgroundImage: `url(${imagePath})`,
                height: height
            }}
        >
            <div className={styles.overlay} style={overlayStyle}></div>
            <div className={styles.content}>
                <h1 className={styles.title}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
        </section>
    );
}
