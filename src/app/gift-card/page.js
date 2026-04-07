"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import ScrollProgress from "@/components/ScrollProgress";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.css";
import { SITE_MEDIA } from "@/config/media";
import { useCart } from "@/context/CartContext";
import { Gift, Mail, Send, CheckCircle2 } from "lucide-react";

const GIFT_CARDS = [
    { id: "gift-50", amount: 50, title: "Royal Gift Card: $50", desc: "A perfect token of appreciation for fine heritage.", wordpress_id: 110 },
    { id: "gift-100", amount: 100, title: "Royal Gift Card: $100", desc: "Elevate someone's wardrobe with signature elegance.", wordpress_id: 111 },
    { id: "gift-250", amount: 250, title: "Royal Gift Card: $250", desc: "The ultimate gesture of artistry and bespoke care.", wordpress_id: 112 }
];

export default function GiftCardPage() {
    const { addToCart } = useCart();
    const [selectedCard, setSelectedCard] = useState(null);
    const [recipient, setRecipient] = useState({ name: "", email: "", message: "" });
    const [success, setSuccess] = useState(false);

    const handleAddGiftCard = (e) => {
        e.preventDefault();
        if (!selectedCard) return;

        // Custom product format for the cart with metadata
        const giftProduct = {
            id: selectedCard.wordpress_id,
            name: selectedCard.title,
            price: selectedCard.amount,
            quantity: 1,
            size: "Fixed", // Use "Fixed" as size for gift cards
            recipient_email: recipient.email,
            recipient_name: recipient.name,
            message: recipient.message,
            images: [SITE_MEDIA.gift_card.hero || "/images/spotlight.jpg"]
        };

        addToCart(giftProduct);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <main>
            <ScrollProgress />
            <Hero 
                title="The Gift of Heritage" 
                subtitle="Share the Royal Haven experience with the ones who matter most."
                imagePath={SITE_MEDIA.gift_card.hero}
            />

            <div className={styles.container}>
                <motion.div 
                    className={styles.grid}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    {GIFT_CARDS.map((card, idx) => (
                        <motion.div
                            key={card.id}
                            className={`${styles.card} glass-panel ${selectedCard?.id === card.id ? styles.selectedCard : ''}`}
                            onClick={() => setSelectedCard(card)}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className={styles.brand} style={{ color: 'var(--obsidian)' }}>ROYAL HAVEN</div>
                            <div className={styles.subtitle} style={{ fontSize: '1.2rem', color: 'var(--charcoal)', textTransform: 'uppercase', letterSpacing: '1px' }}>Gift Card</div>
                            <div className={styles.amount} style={{ color: 'var(--gold)' }}>${card.amount}</div>
                            <div className={styles.description} style={{ color: 'var(--charcoal)' }}>{card.desc}</div>
                            
                            <button 
                                className="btn-secondary" 
                                style={selectedCard?.id === card.id ? {
                                    borderColor: 'var(--gold)',
                                    color: 'var(--gold)',
                                    backgroundColor: 'var(--obsidian)'
                                } : {}}
                            >
                                {selectedCard?.id === card.id ? "SELECTED" : "CHOOSE CARD"}
                            </button>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Recipient Form */}
                <AnimatePresence>
                    {selectedCard && (
                        <motion.div 
                            className={`${styles.form} glass-panel`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <h2 style={{ color: 'var(--gold)' }}>Card Details</h2>
                            <div className={styles.inputGroup}>
                                <label><Mail size={14} style={{ marginRight: '5px' }} /> Recipient Email</label>
                                <input 
                                    type="email" 
                                    className={styles.input}
                                    placeholder="Enter friend's email address"
                                    required
                                    value={recipient.email}
                                    onChange={(e) => setRecipient({...recipient, email: e.target.value})}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label><Gift size={14} style={{ marginRight: '5px' }} /> Recipient Name</label>
                                <input 
                                    type="text" 
                                    className={styles.input}
                                    placeholder="Enter friend's name"
                                    required
                                    value={recipient.name}
                                    onChange={(e) => setRecipient({...recipient, name: e.target.value})}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label><Send size={14} style={{ marginRight: '5px' }} /> Personal Message</label>
                                <textarea 
                                    className={styles.input}
                                    placeholder="Add a heartfelt message for them..."
                                    rows="4"
                                    value={recipient.message}
                                    onChange={(e) => setRecipient({...recipient, message: e.target.value})}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button type="button" onClick={handleAddGiftCard} className="btn-primary" style={{ width: '100%' }}>
                                    {success ? (
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                            <CheckCircle2 size={18} /> Added to Bag
                                        </span>
                                    ) : "Add Gift Card to Bag"}
                                </button>
                                
                                {success && (
                                    <button 
                                        type="button" 
                                        className="btn-secondary" 
                                        style={{ width: '100%', borderColor: 'var(--gold)', color: 'var(--gold)', backgroundColor: 'var(--obsidian)' }}
                                        onClick={() => window.location.href = '/checkout'}
                                    >
                                        Proceed to Checkout
                                    </button>
                                )}
                            </div>

                            <p style={{ marginTop: '1rem', fontSize: '0.8rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                                Security Note: This is an official digital gift card transaction. Codes are securely generated and verified upon successful payment.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
