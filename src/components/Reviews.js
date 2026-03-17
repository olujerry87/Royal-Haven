"use client";

import { Star } from "lucide-react";
import styles from "./Reviews.module.css";
import { motion } from "framer-motion";

// Default Data Structure matching typical Google Place API response
const defaultReviews = [
    {
        id: 1,
        author_name: "Sarah Jenkins",
        rating: 5,
        text: "Absolutely stunning craftsmanship. The silk tunic I bought is my new favorite piece. It feels so regal yet comfortable.",
        relative_time_description: "2 weeks ago",
        profile_photo_url: "https://lh3.googleusercontent.com/a-/ALV-UjW..." // Placeholder
    },
    {
        id: 2,
        author_name: "Amara Okeke",
        rating: 5,
        text: "Ewa's makeup artistry was perfect for my wedding. She really understood the 'natural glam' look I wanted.",
        relative_time_description: "1 month ago",
        profile_photo_url: ""
    },
    {
        id: 3,
        author_name: "Priya Patel",
        rating: 4,
        text: "Beautiful fabrics. Shipping took a little longer than expected but it was worth the wait.",
        relative_time_description: "3 months ago",
        profile_photo_url: ""
    },
    {
        id: 4,
        author_name: "Chloe D.",
        rating: 5,
        text: "The quality is unmatched. I love the story behind the brand as much as the clothes themselves.",
        relative_time_description: "1 week ago",
        profile_photo_url: ""
    }
];

export default function Reviews({ reviews = defaultReviews }) {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Client Love</h2>
                    <div className={styles.googleBadge}>
                        <span className={styles.gLogo}>G</span>
                        <span>4.9 Stars on Google</span>
                    </div>
                </div>

                <div className={styles.scroller}>
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            className={styles.card}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.avatar}>
                                    {review.author_name.charAt(0)}
                                </div>
                                <div className={styles.meta}>
                                    <h4 className={styles.author}>{review.author_name}</h4>
                                    <span className={styles.date}>{review.relative_time_description}</span>
                                </div>
                            </div>
                            <div className={styles.stars}>
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        fill={i < review.rating ? "#F4C430" : "none"}
                                        color={i < review.rating ? "#F4C430" : "#E5E5E5"}
                                    />
                                ))}
                            </div>
                            <p className={styles.text}>&quot;{review.text}&quot;</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
