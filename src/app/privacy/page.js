"use client";

import { motion } from "framer-motion";
import styles from "../LegalStyles.module.css";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Globe, Database, UserCheck, Share2 } from "lucide-react";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
};

export default function PrivacyPolicy() {
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
                        Legal Transparency
                    </motion.p>
                    <motion.h1 
                        className={styles.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Privacy Policy
                    </motion.h1>
                </header>

                {/* Section 1: Introduction */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <ShieldCheck size={32} color="var(--gold, #D4AF37)" />
                        <h2>Introduction</h2>
                    </div>
                    <p>
                        At Royal Haven, we respect your privacy and are committed to protecting your personal data. 
                        This Privacy Policy outlines how we collect, use, and disclose your information when you 
                        use our services across the Royal Haven webapp and associated platforms.
                    </p>
                </motion.section>

                {/* Section 2: Data Inventory */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Database size={32} color="var(--gold, #D4AF37)" />
                        <h2>Data Inventory: What We Collect</h2>
                    </div>
                    <p>We collect the following personal data points to provide and optimize our services:</p>
                    <ul>
                        <li><strong>Identity Data:</strong> Full name, username, and profile pictures.</li>
                        <li><strong>Contact Data:</strong> Email address and phone number for account creation and support.</li>
                        <li><strong>Technical Data:</strong> IP address, device IDs, browser type, and operating system.</li>
                        <li><strong>Usage Data:</strong> Information about how you interact with our website, including clicks, session duration, and crash logs.</li>
                        <li><strong>Location Data:</strong> General geolocation (city/country) derived from IP address for shipping and service availability.</li>
                        <li><strong>Financial Data:</strong> Payment details (processed securely via Stripe; we do not store full credit card numbers).</li>
                    </ul>
                </motion.section>

                {/* Section 3: Third-Party Disclosures */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Share2 size={32} color="var(--gold, #D4AF37)" />
                        <h2>Third-Party Disclosures</h2>
                    </div>
                    <p>To ensure high-performance and secure operations, we share specific data with trusted partners:</p>
                    <ul>
                        <li><strong>Firebase/Supabase:</strong> For secure authentication and database management.</li>
                        <li><strong>Stripe:</strong> For integrated, PCI-compliant payment processing.</li>
                        <li><strong>Google Analytics:</strong> To track app optimization and user behavior.</li>
                        <li><strong>Meta Pixel:</strong> For marketing and ad attribution.</li>
                        <li><strong>WooCommerce:</strong> For order fulfillment and customer management.</li>
                    </ul>
                </motion.section>

                {/* Section 4: Retention & Purpose */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Lock size={32} color="var(--gold, #D4AF37)" />
                        <h2>Retention & Purpose</h2>
                    </div>
                    <h3>Core Purpose</h3>
                    <p>
                        We collect data for primary reasons: account creation, order fulfillment, 
                        app optimization, and providing our unique AI-powered personal styling recommendations.
                    </p>
                    <h3>Data Retention</h3>
                    <p>
                        Your personal data is stored for the duration of your active account or as required 
                        by statutory law (e.g., tax records). Accounts inactive for over 36 months 
                        may be subject to data scrubbing and permanent deletion.
                    </p>
                </motion.section>

                {/* Section 5: User Rights */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <UserCheck size={32} color="var(--gold, #D4AF37)" />
                        <h2>User Rights (GDPR & CCPA)</h2>
                    </div>
                    <p>Under international privacy laws (GDPR in the EU and CCPA in California), you have specific rights over your data:</p>
                    <ul>
                        <li><strong>Right to Access:</strong> Request a full copy of all personal data we hold about you.</li>
                        <li><strong>Right to Erasure:</strong> Request that we delete your personal information permanently.</li>
                        <li><strong>Opt-Out:</strong> Royal Haven does not sell your personal data. However, you may opt-out of marketing communications at any time.</li>
                        <li><strong>Do Not Sell My Info:</strong> We provide a direct mechanism for California residents to ensure their data is never monetized.</li>
                    </ul>
                </motion.section>

                {/* Section 6: Jurisdiction */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Globe size={32} color="var(--gold, #D4AF37)" />
                        <h2>Jurisdiction & Age</h2>
                    </div>
                    <p>
                        This policy is governed by the laws of <strong>Canada</strong>. 
                        You must be at least <strong>18 years of age</strong> to use our services. 
                        By accessing Royal Haven, you represent that you meet this requirement.
                    </p>
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
