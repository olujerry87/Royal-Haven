"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import styles from "./FAQ.module.css";

const faqData = [
    {
        question: "How do I book an appointment with Ewa?",
        answer: "You can book directly through our Services page. Select your desired service and choose a time that works for you via our booking calendar."
    },
    {
        question: "Do you offer international shipping for Wura lines?",
        answer: "Yes, we ship globally. Shipping times vary by location, but typically range from 5-10 business days for international orders."
    },
    {
        question: "Can I request custom measurements?",
        answer: "Absolutely. Many of our Heritage pieces can be tailored. Please contact us directly for bespoke inquiries."
    },
    {
        question: "What is your return policy?",
        answer: "We offer returns within 14 days of receipt for unworn items with tags attached. Custom pieces are final sale."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleIndex = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className={styles.section}>
            <div className={styles.container}>
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Frequently Asked Questions
                </motion.h2>

                <div className={styles.grid}>
                    {faqData.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <button
                                className={styles.question}
                                onClick={() => toggleIndex(index)}
                            >
                                <span>{item.question}</span>
                                {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={styles.answerWrapper}
                                    >
                                        <p className={styles.answer}>{item.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
