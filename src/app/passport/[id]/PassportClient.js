"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Info, Sparkles, Droplets, PenTool, CheckCircle, Globe } from "lucide-react";
import SocialShare from "@/components/passport/SocialShare";
import { createClient } from "@supabase/supabase-js";
import styles from "./PassportClient.module.css";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PassportClient({ garmentId }) {
    const [isRegistered, setIsRegistered] = useState(false);
    const [hideModal, setHideModal] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [registrationLoading, setRegistrationLoading] = useState(false);

    const [garmentData, setGarmentData] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);

    // Fetch garment data from Supabase using the Garment ID
    useEffect(() => {
        async function fetchGarment() {
            try {
                const { data, error } = await supabase
                    .from("garments")
                    .select("*")
                    .eq("id", garmentId)
                    .single();

                if (data && !error) {
                    setGarmentData(data);
                } else {
                    // Fallback block if table doesn't exist yet or garment not found
                    setGarmentData({
                        name: "Wura Asoke Trench (Demo Mode)",
                        collection: "Heritage AW24",
                        origin: "Woven in the heart of Abeokuta, Nigeria, this authentic Aso-Oke textile was crafted using centuries-old horizontal loom techniques.",
                        care: "Dry clean only. Do not machine wash or tumble dry.",
                        styling: "Pair this statement trench with monochrome base layers.",
                        founder_note: "I designed this piece to be a bridge between my two worlds.",
                        founder: "Wura & Ewa Official",
                        isFallback: true
                    });
                }
            } catch (err) {
                 console.error(err);
            } finally {
                setPageLoading(false);
            }
        }
        fetchGarment();
    }, [garmentId]);

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
            {pageLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--gold)' }}>
                    <Sparkles size={32} style={{ marginBottom: '1rem', animation: 'pulse 2s infinite' }} />
                    <p style={{ fontFamily: 'var(--font-body)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Decrypting NTAG 213 Provenance...</p>
                </div>
            ) : (
                <>
                    {/* Modal Overlay for Registration (First-Time Scan) */}
                    <AnimatePresence>
                        {!isRegistered && !hideModal && (
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
                                <button 
                                    type="button" 
                                    onClick={() => setHideModal(true)}
                                    style={{
                                        background: "transparent", border: "none", color: "var(--stone)", 
                                        fontFamily: "var(--font-body)", fontSize: "0.85rem", cursor: "pointer", marginTop: "0.5rem"
                                    }}
                                >
                                    Skip and view garment details
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
                        <p className={styles.textBlock}>{garmentData.founder_note}</p>
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
            </>
            )}
        </div>
    );
}
