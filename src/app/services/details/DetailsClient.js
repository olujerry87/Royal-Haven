"use client";

import Hero from "@/components/Hero";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../page.module.css";
import Image from "next/image";

const SERVICES = [
    {
        id: "hair",
        title: "Hair Artistry",
        image: "/images/ewa-idle.jpg",
        description: "From sleek updos to intricate braids, we offer premium hair styling that celebrates your crown.",
        pricing: [
            { category: "No Extension", items: [
                { name: "Corn rows", price: "from $40" },
                { name: "Braids / twist", price: "from $70" },
                { name: "Updo / Styling", price: "from $50" },
            ]},
            { category: "With Extensions (not provided)", items: [
                { name: "Corn rows", price: "from $100" },
                { name: "Braids / twist with extension", price: "from $120" },
            ]}
        ]
    },
    {
        id: "makeup",
        title: "Makeup & Glam",
        image: "/images/banner-1.jpg", 
        description: "Enhance your natural essence with our high-end, editorial approach to beauty. Flawless, radiant skin for your most important moments.",
        pricing: [
            { category: "", items: [
                { name: "Basic glam", price: "from $70" },
                { name: "Bridal / Celebrant glam", price: "from $120" },
                { name: "Editorial / half day shoot", price: "from $400" },
            ]}
        ]
    },
    {
        id: "gele",
        title: "Gele Tying",
        image: "/images/spotlight.jpg", 
        description: "The crown jewel of traditional African attire. Our Gele art is sculpted to perfection, framing your face beautifully.",
        pricing: [
            { category: "", items: [
                { name: "Basic", price: "from $30" },
                { name: "Detailed / more elaborate styles", price: "from $50" },
                { name: "Event (over 5 people)", price: "from $25 per person" },
            ]}
        ]
    }
];

export default function DetailsClient() {
    return (
        <main>
            <Hero
                title="Artistry Details"
                subtitle="The Ewa Experience"
                imagePath="/images/spotlight.jpg"
            />

            <div className={styles.container}>
                {/* Specific Service Sections */}
                <section style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                    {SERVICES.map((service, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <motion.div 
                                id={service.id}
                                key={service.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                style={{
                                    display: 'flex',
                                    flexDirection: isEven ? 'row' : 'row-reverse',
                                    gap: '4rem',
                                    alignItems: 'center',
                                    flexWrap: 'wrap'
                                }}
                            >
                                {/* Image Banner */}
                                <div style={{ flex: '1 1 400px', position: 'relative', height: '500px', borderRadius: '12px', overflow: 'hidden' }}>
                                    <Image 
                                        src={service.image} 
                                        alt={service.title} 
                                        fill 
                                        style={{ objectFit: 'cover' }} 
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(14,15,16,0.5), transparent)' }}></div>
                                </div>
                                
                                {/* Text & Pricing */}
                                <div style={{ flex: '1 1 400px' }}>
                                    <h2 style={{ fontFamily: 'var(--font-heritage)', fontSize: '2.5rem', color: 'var(--gold)', marginBottom: '1rem' }}>
                                        {service.title}
                                    </h2>
                                    <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                                        {service.description}
                                    </p>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        {service.pricing.map((group, i) => (
                                            <div key={i}>
                                                {group.category && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--charcoal)', marginBottom: '0.2rem', marginTop: i > 0 ? '1rem' : '0' }}>{group.category}</p>}
                                                <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--charcoal)' }}>
                                                    {group.items.map((item, j) => (
                                                        <li key={j}>
                                                            {item.name}- {item.price}
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/services/book" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
                                        Book {service.title}
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </section>

                <div style={{ marginTop: '5rem', padding: '2rem', background: 'var(--gold)', color: 'var(--obsidian)', borderRadius: '8px', textAlign: 'center', marginBottom: '4rem' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Additional Information</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>* Home service charge applies on all services depending on location.</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', marginTop: '0.2rem' }}>* Available to travel globally.</p>
                </div>
            </div>
        </main>
    );
}
