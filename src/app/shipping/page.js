"use client";

import { motion } from "framer-motion";
import styles from "../LegalStyles.module.css";
import Link from "next/link";
import { ArrowLeft, Truck, PackageCheck, RotateCcw, HelpCircle, Globe2, CreditCard } from "lucide-react";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
};

export default function ShippingAndReturns() {
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
                        Logistics & Care
                    </motion.p>
                    <motion.h1 
                        className={styles.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Shipping & Returns
                    </motion.h1>
                </header>

                {/* Section 1: Shipping Delivery */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Truck size={32} color="var(--gold, #D4AF37)" />
                        <h2>Shipping Methods & Delivery</h2>
                    </div>
                    <p>We deliver Royal Haven's heritage-inspired luxury pieces worldwide from our base in Ottawa, Canada.</p>
                    <ul>
                        <li><strong>Standard Domestic (Canada):</strong> 3-7 business days.</li>
                        <li><strong>Standard Intl (USA):</strong> 7-14 business days.</li>
                        <li><strong>International Shipping:</strong> 10-21 business days, depending on location and customs.</li>
                    </ul>
                    <p>
                        <em>Please note:</em> Processing time for ready-to-wear is 1-3 business days. 
                        Bespoke garments require additional time as specified during the consultation.
                    </p>
                </motion.section>

                {/* Section 2: Order Tracking */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <PackageCheck size={32} color="var(--gold, #D4AF37)" />
                        <h2>Order Tracking</h2>
                    </div>
                    <p>
                        Once your order is dispatched, you will receive a confirmation email with a unique tracking number 
                        and a link to track your package's journey to your doorstep.
                    </p>
                    <p>If you haven't received your tracking number within 5 business days, please contact us.</p>
                </motion.section>

                {/* Section 3: Returns & Exchanges */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <RotateCcw size={32} color="var(--gold, #D4AF37)" />
                        <h2>Returns & Exchanges</h2>
                    </div>
                    <p>
                        We want you to love your Royal Haven pieces. If you are not entirely satisfied, 
                        you have **14 days** from the date of delivery to request a return or exchange.
                    </p>
                    <ul>
                        <li>Items must be in original condition, unworn, unwashed, and with all tags attached.</li>
                        <li>Custom or bespoke items are non-refundable due to their personalized nature.</li>
                        <li>Return shipping costs are the responsibility of the customer unless the item was damaged upon arrival.</li>
                    </ul>
                </motion.section>

                {/* Section 4: Refund Policy */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <CreditCard size={32} color="var(--gold, #D4AF37)" />
                        <h2>Refund Policy</h2>
                    </div>
                    <p>
                        Refunds will be processed back to the original method of payment within **7-10 business days** 
                        of our receipt and inspection of your returned item.
                    </p>
                </motion.section>

                {/* Section 5: International Customs */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Globe2 size={32} color="var(--gold, #D4AF37)" />
                        <h2>International Customs & Duties</h2>
                    </div>
                    <p>
                        For international orders, please be aware that local customs duties and taxes may apply 
                        and are not included in the purchase price. These are the responsibility of the recipient.
                    </p>
                </motion.section>

                {/* Section 6: Support */}
                <motion.section className={styles.section} {...fadeIn}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <HelpCircle size={32} color="var(--gold, #D4AF37)" />
                        <h2>Support Desk</h2>
                    </div>
                    <p>Have questions about your order or our delivery policies?</p>
                    <p><strong>Email:</strong> royalhaven.ng@gmail.com</p>
                    <p><strong>Primary Line:</strong> +1 (613) 286-0661</p>
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
