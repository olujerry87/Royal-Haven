"use client";

import { motion } from "framer-motion";
import styles from "../LegalStyles.module.css";
import Link from "next/link";
import { ArrowLeft, Accessibility, Eye, HelpCircle, Laptop, Phone, Speaker } from "lucide-react";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
};

export default function AccessibilityStatement() {
    return (
        <main className={styles.container}>
            <div className={styles.contentWrapper}>
                {/* Back button */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '2rem' }}
                >
                    <Link href="/" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                        <ArrowLeft size={16} /> Back to Haven
                    </Link>
                </motion.div>

                {/* Header Section */}
                <header className={styles.header}>
                    <motion.p 
                        className={styles.subtitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Inclusive Design
                    </motion.p>
                    <motion.h1 
                        className={styles.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Accessibility Statement
                    </motion.h1>
                </header>

                {/* Section 1: Commitment */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Accessibility size={32} color="var(--gold, #D4AF37)" />
                        <h2>Our Commitment</h2>
                    </div>
                    <p>
                        Royal Haven is dedicated to ensuring digital accessibility for people with disabilities. 
                        We are continually improving the user experience for everyone and applying the 
                        relevant accessibility standards to ensure an inclusive environment.
                    </p>
                    <p>
                        Our goal is to follow the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> 
                        standards to provide a seamless styling and shopping experience for all our guests.
                    </p>
                </motion.section>

                {/* Section 2: Assistive Technology */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Laptop size={32} color="var(--gold, #D4AF37)" />
                        <h2>Assistive Technology Support</h2>
                    </div>
                    <p>Royal Haven is designed to be compatible with the following assistive technologies:</p>
                    <ul>
                        <li><strong>Screen Readers:</strong> Optimized for VoiceOver (Mac/iOS), NVDA (Windows), and TalkBack (Android).</li>
                        <li><strong>Keyboard Navigation:</strong> Full site functionality accessible via the Tab, Enter, and Arrow keys.</li>
                        <li><strong>Text Scaling:</strong> Support for browser-level font resizing up to 200% without loss of content.</li>
                        <li><strong>Contrast:</strong> High-contrast color palettes for improved readability.</li>
                    </ul>
                </motion.section>

                {/* Section 3: Technical Specifications */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Eye size={32} color="var(--gold, #D4AF37)" />
                        <h2>Technical Specifications</h2>
                    </div>
                    <p>Accessibility at Royal Haven relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:</p>
                    <ul>
                        <li>HTML5 Semantic Tags</li>
                        <li>WAI-ARIA (Web Accessibility Initiative - Accessible Rich Internet Applications)</li>
                        <li>CSS3 for visual structure and responsive design</li>
                        <li>JavaScript for interactive elements and state management</li>
                    </ul>
                </motion.section>

                {/* Section 4: Feedback & Contact */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <HelpCircle size={32} color="var(--gold, #D4AF37)" />
                        <h2>Feedback & Assistance</h2>
                    </div>
                    <p>
                        We welcome your feedback on the accessibility of Royal Haven. Please let us know if 
                        you encounter any accessibility barriers so that we may rectify them immediately:
                    </p>
                    <ul>
                        <li><Phone size={16} style={{ marginRight: '0.5rem' }} /> <strong>Phone:</strong> +1 (613) 286-0661</li>
                        <li><Speaker size={16} style={{ marginRight: '0.5rem' }} /> <strong>Email:</strong> royalhaven.ng@gmail.com</li>
                    </ul>
                    <p>We try to respond to feedback within 2 business days.</p>
                </motion.section>

                {/* Footer Credits */}
                <footer className={styles.lastUpdated}>
                    <p>Last Updated: April 06, 2026</p>
                    <p style={{ marginTop: '0.5rem' }}>&copy; Royal Haven. A Bezaleel Group Subsidiary.</p>
                </footer>
            </div>
        </main>
    );
}
