"use client";

import Hero from "@/components/Hero";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import Image from "next/image";

const SERVICES = [
    {
        id: "hair",
        title: "Hair Artistry",
        image: "/images/ewa-idle.jpg", // TBD: replace with actual hair portfolio if available
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
                { name: "Event (over 5 people)", price: "from $25 per person" }, // Assuming $25 each
            ]}
        ]
    }
];

export default function ServicesClient({ page, portfolio, testimonials }) {
    // Fallback data
    const data = {
        title: page?.acf?.hero_title || "Artistry Services",
        subtitle: page?.acf?.hero_subtitle || "Bridal, Editorial, and Bespoke Beauty",
        heroImage: page?.acf?.hero_image || "/images/spotlight.jpg",
        introTitle: page?.acf?.intro_title || "The Ewa Experience",
        introText: page?.acf?.intro_text || "We believe that beauty is an art form. Our approach is rooted in enhancing your natural essence while delivering a polished, high-editorial finish. Whether you are walking down the aisle or stepping onto a set, Ewa ensures you look—and feel—radiant.",
        portfolio: portfolio && portfolio.length > 0 ? portfolio.map(item => ({
            id: item.id,
            image: item.acf?.image || item.featured_media_url || "/images/spotlight.jpg",
            title: item.title?.rendered || "Portfolio Item"
        })) : [
            { id: 1, image: "/images/spotlight.jpg", title: "Bridal Glamour" },
            { id: 2, image: "/images/banner-1.jpg", title: "Editorial Campaign" },
            { id: 3, image: "/images/ewa-idle.jpg", title: "Traditional Elegance" },
            { id: 4, image: "/images/journal.jpg", title: "Studio Portraits" }
        ],
        testimonials: testimonials && testimonials.length > 0 ? testimonials.map(item => ({
            id: item.id,
            quote: item.content?.rendered?.replace(/<[^>]+>/g, '') || "Testimonial content",
            author: item.title?.rendered || "Client"
        })) : [
            { id: 1, quote: "Ewa made me feel like royalty on my wedding day. The attention to detail was unmatched.", author: "Adeola B." },
            { id: 2, quote: "Professional, calm, and incredibly talented. My entire bridal party looked stunning.", author: "Chioma O." },
            { id: 3, quote: "The best editorial make-up artist I've worked with. She understands light and skin texture perfectly.", author: "Studio 54 Photography" }
        ],
    };

    return (
        <main>
            <Hero
                title={data.title}
                subtitle={data.subtitle}
                imagePath={data.heroImage}
            />

            <div className={styles.container}>
                {/* Intro */}
                <div className={styles.intro}>
                    <motion.h2
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {data.introTitle}
                    </motion.h2>
                    <p className={styles.text} dangerouslySetInnerHTML={{ __html: data.introText }} />
                </div>

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
                                                {group.category && <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>{group.category}</h4>}
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                    {group.items.map((item, j) => (
                                                        <li key={j} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--off-white)' }}>{item.name}</span>
                                                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: '500', color: 'white' }}>{item.price}</span>
                                                        </li>
                                                    ))}
                                                </ul>
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

                <div style={{ marginTop: '5rem', padding: '2rem', background: 'var(--gold)', color: 'var(--obsidian)', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Additional Information</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>* Home service charge applies on all services depending on location.</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', marginTop: '0.2rem' }}>* Available to travel globally.</p>
                </div>
                
                {/* Portfolio Grid */}
                <section className={styles.portfolioSection} style={{ marginTop: '6rem' }}>
                    <div className={styles.sectionHeader}>
                        <h2>Selected Works</h2>
                    </div>
                    <div className={styles.grid}>
                        {data.portfolio.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className={styles.gridItem}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <img src={item.image} alt={item.title} className={styles.gridImage} />
                                <div className={styles.caption}>{item.title}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Love Notes (Testimonials) */}
            <section className={styles.loveNotesSection}>
                <h2 className={styles.title} style={{ color: 'var(--off-white)' }}>Love Notes</h2>
                <div className={styles.notesGrid}>
                    {data.testimonials.map((note) => (
                        <div key={note.id} className={styles.noteCard}>
                            <p className={styles.quote}>&quot;{note.quote}&quot;</p>
                            <p className={styles.author}>— {note.author}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
