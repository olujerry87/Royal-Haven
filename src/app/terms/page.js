"use client";

import { motion } from "framer-motion";
import styles from "../LegalStyles.module.css";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Ban, Gavel, Award, UserPlus, Info } from "lucide-react";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
};

export default function TermsOfService() {
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
                        User Agreement
                    </motion.p>
                    <motion.h1 
                        className={styles.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Terms of Service
                    </motion.h1>
                </header>

                {/* Section 1: Introduction */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Info size={32} color="var(--gold, #D4AF37)" />
                        <h2>Overview</h2>
                    </div>
                    <p>
                        These Terms of Service govern your use of the Royal Haven webapp 
                        and its associated services. By accessing or using Royal Haven, 
                        you agree to be bound by these terms. If you do not agree 
                        to all of these terms, do not access or use Royal Haven.
                    </p>
                </motion.section>

                {/* Section 2: Acceptable Use */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Ban size={32} color="var(--gold, #D4AF37)" />
                        <h2>Acceptable Use</h2>
                    </div>
                    <p>As a user of Royal Haven, you explicitly agree not to:</p>
                    <ul>
                        <li>Engage in any form of <strong>Data Scraping</strong>, crawling, or automated data extraction.</li>
                        <li>Harass, abuse, or threaten other users, stylists, or staff members.</li>
                        <li>Attempt to <strong>Reverse Engineer</strong>, decompile, or disassemble our source code or proprietary UI/UX designs.</li>
                        <li>Use the service for any illegal or unauthorized purpose within your jurisdiction.</li>
                    </ul>
                </motion.section>

                {/* Section 3: Limitation of Liability */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <ShieldAlert size={32} color="var(--gold, #D4AF37)" />
                        <h2>Limitation of Liability</h2>
                    </div>
                    <p>
                        Royal Haven and the Bezaleel Group shall not be liable for any indirect, 
                        incidental, special, consequential, or punitive damages, including but not 
                        limited to:
                    </p>
                    <ul>
                        <li>Service downtime or temporary technical bugs.</li>
                        <li>Errors in styling AI recommendations or AI-generated outfit suggestions.</li>
                        <li>User-generated content or guest uploads within the Lookbook.</li>
                        <li>Loss of profits, data, use, or goodwill resulting from your use of the service.</li>
                    </ul>
                </motion.section>

                {/* Section 4: Intellectual Property */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Award size={32} color="var(--gold, #D4AF37)" />
                        <h2>Intellectual Property (IP)</h2>
                    </div>
                    <p>
                        All software code, graphic designs, logos, UI/UX components, and branding 
                        associated with Royal Haven are the exclusive intellectual property 
                        of <strong>Royal Haven and the Bezaleel Group</strong>.
                    </p>
                    <p>
                        Your use of the service grants you no right or license to reproduce 
                        or use any branding or proprietary elements without express written permission.
                    </p>
                </motion.section>

                {/* Section 5: Termination */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Gavel size={32} color="var(--gold, #D4AF37)" />
                        <h2>Termination</h2>
                    </div>
                    <p>
                        We reserve the right, at our sole discretion, to terminate or suspend your 
                        account and access to Royal Haven at any time, without prior notice, 
                        for conduct that we believe violates these Terms or is harmful to our platform.
                    </p>
                </motion.section>

                {/* Section 6: Jurisdiction */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <UserPlus size={32} color="var(--gold, #D4AF37)" />
                        <h2>Eligibility & Jurisdiction</h2>
                    </div>
                    <p>
                        By using the service, you represent that you are at least <strong>18 years of age</strong> 
                        under Canadian law. This agreement is governed by the laws of <strong>Canada</strong>.
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
