"use client";

import { Scissors, MapPin, Sparkles, HeartHandshake } from 'lucide-react';
import styles from './TrustBadges.module.css';

const badges = [
    {
        icon: Scissors,
        title: "Artisan Craftsmanship",
        description: "From seasonal collections to timeless signature garments, there's a style for every occasion."
    },
    {
        icon: MapPin,
        title: "Curated in Canada 🇨🇦",
        description: "Sourced indigenously worldwide—collaborating with heritage fabric weavers across Africa, India, and Asia—and crafted with global partners to be finalized and curated in Ontario, Canada."
    },
    {
        icon: Sparkles,
        title: "Premium Quality",
        description: "A trusted community of fashion lovers who appreciate the finest materials and sustainable practices."
    },
    {
        icon: HeartHandshake,
        title: "Excellent Support",
        description: "Our team is always here to help, from styling recommendations to dedicated order support."
    }
];

export default function TrustBadges() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {badges.map((badge, index) => (
                    <div key={index} className={styles.badge}>
                        <div className={styles.iconWrapper}>
                            <badge.icon size={48} strokeWidth={1.5} />
                        </div>
                        <h3 className={styles.title}>{badge.title}</h3>
                        <p className={styles.description}>{badge.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
