"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import styles from "./OwnershipActivation.module.css";
import SocialShare from "./SocialShare";

export default function OwnershipActivation({ garment }) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [errorMessage, setErrorMessage] = useState("");

    const handleClaim = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        setErrorMessage("");

        try {
            // Update Supabase
            const { error } = await supabase
                .from("garments")
                .update({ is_registered: true, owner_email: email })
                .eq("id", garment.id);

            if (error) throw error;

            setStatus("success");
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to register garment. Please try again.");
            setStatus("error");
        }
    };

    return (
        <div className={styles.activationCard}>
            <AnimatePresence mode="wait">
                {status !== "success" ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={styles.formContainer}
                    >
                        <div className={styles.header}>
                            <h1 className={styles.title}>Claim Your Royal Garment</h1>
                            <p className={styles.subtitle}>
                                Welcome to the genesis of absolute ownership. Registering the <strong className={styles.goldText}>{garment.garment_name}</strong> unlocks its digital passport, provenance, and early access to upcoming collections.
                            </p>
                        </div>

                        <form onSubmit={handleClaim} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email to activate"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    disabled={status === "loading"}
                                />
                            </div>

                            {status === "error" && (
                                <p className={styles.error}>{errorMessage}</p>
                            )}

                            <button
                                type="submit"
                                className={styles.claimButton}
                                disabled={status === "loading" || !email}
                            >
                                {status === "loading" ? (
                                    <Loader2 className={styles.spinner} size={20} />
                                ) : (
                                    <>
                                        Activate Ownership <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className={styles.benefits}>
                            <div className={styles.benefitItem}>
                                <ShieldCheck size={20} className={styles.benefitIcon} />
                                <span>Authenticity Guarantee</span>
                            </div>
                            <div className={styles.benefitItem}>
                                <ShieldCheck size={20} className={styles.benefitIcon} />
                                <span>Lifetime Warranty Registration</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={styles.successContainer}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                        >
                            <ShieldCheck size={60} className={styles.successIcon} />
                        </motion.div>
                        <h2 className={styles.title}>Ownership Verified</h2>
                        <p className={styles.subtitle}>
                            The <strong className={styles.goldText}>{garment.garment_name}</strong> is now eternally registered to your lineage.
                        </p>

                        <SocialShare garment={garment} context="activation" />

                        <div className={styles.actions}>
                            <button
                                onClick={() => window.location.reload()}
                                className={styles.secondaryButton}
                            >
                                View Digital Passport
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
