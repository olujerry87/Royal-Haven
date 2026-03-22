"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Info, Sparkles, Droplets, PenTool, CheckCircle, Globe } from "lucide-react";
import SocialShare from "@/components/passport/SocialShare";
import styles from "./PassportClient.module.css";

export default function PassportClient({ garmentId }) {
    const [isRegistered, setIsRegistered] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [registrationLoading, setRegistrationLoading] = useState(false);

    // Mock Data representing the NFC Garment Profile
    const garmentData = {
        name: "Wura Asoke Trench",
        collection: "Heritage AW24",
        origin: "Woven in the heart of Abeokuta, Nigeria, this authentic Aso-Oke textile was crafted using centuries-old horizontal loom techniques by third-generation artisans before being structurally tailored in our London atelier.",
        care: "This is a living textile. Dry clean only. Do not machine wash or tumble dry. Store folded or on a padded hanger to preserve the structural integrity of the spun cotton.",
        styling: "Pair this statement trench with monochrome base layers (black turtleneck and tailored trousers) to let the metallic threading command the room. Ideal for art galleries or evening galas.",
        founderNote: "I designed this piece to be a bridge between my two worlds. Wearing this isn't just a fashion statement; it's wearing a piece of history. Carry it with pride.",
        founder: "Jerry Olugboye"
    };

    // Simulate checking the Hostinger database for ownership status on initial load
    // For now, we manually force the modal to appear to demonstrate the UX flow.
    useEffect(() => {
        // Normally: fetch(`/api/verify-ownership?id=${garmentId}`)
        // If unowned -> setIsRegistered(false)
        setIsRegistered(false);
    }, [garmentId]);

    const handleRegister = (e) => {
        e.preventDefault();
        setRegistrationLoading(true);
        // Simulate an API call to Hostinger User Database
        setTimeout(() => {
            setRegistrationLoading(false);
            setIsRegistered(true);
        }, 1500);
    };

    return (
        <div className={styles.container}>
            {/* Modal Overlay for Registration (First-Time Scan) */}
            <AnimatePresence>
                {!isRegistered && (
                    <motion.div 
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className={styles.modalContent}
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", bounce: 0.4 }}
                        >
                            <h2 className={styles.modalTitle}>Digital Genesis</h2>
                            <p className={styles.modalDescription}>
                                You have scanned an unverified NTAG 213 Royal Haven garment. Claim digital ownership now to permanently link this serial number to your identity.
                            </p>
                            
                            <ul className={styles.benefitsList}>
                                <li className={styles.benefitItem}>
                                    <ShieldCheck className={styles.benefitIcon} size={20} />
                                    <span>Lifetime Authenticity Warranty</span>
                                </li>
                                <li className={styles.benefitItem}>
                                    <Sparkles className={styles.benefitIcon} size={20} />
                                    <span>Limited Edition Ledger Verification</span>
                                </li>
                                <li className={styles.benefitItem}>
                                    <CheckCircle className={styles.benefitIcon} size={20} />
                                    <span>Early Access to the next Drop</span>
                                </li>
                            </ul>

                            <form className={styles.formGroup} onSubmit={handleRegister}>
                                <input 
                                    type="text" 
                                    placeholder="Your Name" 
                                    required 
                                    className={styles.input}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input 
                                    type="email" 
                                    placeholder="Your Email" 
                                    required 
                                    className={styles.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button type="submit" className={styles.btnPrimary} disabled={registrationLoading}>
                                    {registrationLoading ? "Cryptographically Securing..." : "Activate Digital Ownership"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Passport Content */}
            <div className={styles.contentWrapper}>
                <motion.div 
                    className={styles.header}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className={styles.nfcBadge}>
                        <ShieldCheck size={14} /> NTAG 213 SECURED
                    </div>
                    <h1 className={styles.title}>{garmentData.name}</h1>
                    <p className={styles.collection}>{garmentData.collection} // SEC #{garmentId}</p>
                </motion.div>

                <div className={styles.sections}>
                    <motion.div 
                        className={styles.sectionCard}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className={styles.sectionHeader}>
                            <Globe size={24} />
                            <h3 className={styles.sectionTitle}>Textile Provenance</h3>
                        </div>
                        <p className={styles.textBlock}>{garmentData.origin}</p>
                    </motion.div>

                    <motion.div 
                        className={styles.sectionCard}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className={styles.sectionHeader}>
                            <Droplets size={24} />
                            <h3 className={styles.sectionTitle}>Preservation & Care</h3>
                        </div>
                        <p className={styles.textBlock}>{garmentData.care}</p>
                    </motion.div>

                    <motion.div 
                        className={styles.sectionCard}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className={styles.sectionHeader}>
                            <Sparkles size={24} />
                            <h3 className={styles.sectionTitle}>Stylist Protocol</h3>
                        </div>
                        <p className={styles.textBlock}>{garmentData.styling}</p>
                    </motion.div>

                    <motion.div 
                        className={styles.sectionCard}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className={styles.sectionHeader}>
                            <PenTool size={24} />
                            <h3 className={styles.sectionTitle}>Founder's Intel</h3>
                        </div>
                        <p className={styles.textBlock}>{garmentData.founderNote}</p>
                        <p className={styles.signature}>— {garmentData.founder}</p>
                    </motion.div>
                </div>

                {/* Integration of the previous SocialShare component configured for Passport usage */}
                {isRegistered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{ marginTop: '2rem' }}
                    >
                        <SocialShare garment={{ garment_name: garmentData.name }} context="passport" />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
