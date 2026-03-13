"use client";

import { motion } from "framer-motion";
import styles from "./Heritage.module.css";

export default function Heritage({
    title = "Where Heritage Meets <br /> Modern Luxury",
    text = "Wura & Ewa represents the duality of the modern individual. The intersection of timeless fashion and transformative artistry. Rooted in culture, designed for the contemporary world."
}) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    dangerouslySetInnerHTML={{ __html: title }}
                />

                <motion.p
                    className={styles.text}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {text}
                </motion.p>
            </div>
        </section>
    );
}
