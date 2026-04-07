"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail } from "lucide-react";
import styles from "./Footer.module.css";
import { SITE_MEDIA } from "@/config/media";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.column}>
                        <div className={styles.brandWrapper}>
                            <Image
                                src={SITE_MEDIA.logos.footer}
                                alt="Wura & Ewa"
                                width={315}
                                height={60}
                                className={styles.logo}
                            />
                        </div>
                        <p className={styles.tagline}>
                            Where heritage meets modern luxury. <br />
                            Fashion & Artistry redefined.
                        </p>
                    </div>

                    {/* Explore Column */}
                    <div className={styles.column}>
                        <h4>Explore</h4>
                        <Link href="/shop" className={styles.link}>Shop Wura</Link>
                        <Link href="/services" className={styles.link}>Book Ewa</Link>
                        <Link href="/about" className={styles.link}>Our Heritage</Link>
                        <Link href="/gift-card" className={styles.link}>Gift Cards</Link>
                    </div>

                    {/* Support Column */}
                    <div className={styles.column}>
                        <h4>Support</h4>
                        <Link href="/services/book" className={styles.link}>Contact Us</Link>
                        <Link href="/shipping" className={styles.link}>Shipping & Returns</Link>
                        <Link href="/#faq" className={styles.link}>FAQ</Link>
                    </div>

                    {/* Legal Column */}
                    <div className={styles.column}>
                        <h4>Legal</h4>
                        <Link href="/accessibility" className={styles.link}>Accessibility</Link>
                        <Link href="/terms" className={styles.link}>Terms of Use</Link>
                        <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                    </div>

                    {/* Social/Newsletter Column */}
                    <div className={styles.column}>
                        <h4>Connect</h4>
                        <div className={styles.socials}>
                            <a href="#" aria-label="Follow us on Instagram"><Instagram size={20} /></a>
                            <a href="#" aria-label="Follow us on Facebook"><Facebook size={20} /></a>
                            <a href="mailto:royalhaven.ng@gmail.com" aria-label="Send us an Email"><Mail size={20} /></a>
                        </div>
                        <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                            <p>royalhaven.ng@gmail.com</p>
                            <p>+1 (613) 286-0661</p>
                        </div>
                        <div className={styles.newsletter}>
                            <p>Subscribe for exclusive updates.</p>
                            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                                <label htmlFor="newsletter-email" className="sr-only">Email Address</label>
                                <input 
                                    type="email" 
                                    id="newsletter-email"
                                    placeholder="Your email" 
                                    className={styles.input} 
                                />
                                <button type="submit" className={styles.btn} aria-label="Subscribe to newsletter">Join</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.scripture}>
                        "She is clothed with strength and dignity; she can laugh at the days to come." — Proverbs 31:25
                    </p>
                    <p className={styles.scripture}>
                        "Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable—if anything is excellent or praiseworthy—think about such things." — Philippians 4:8
                    </p>
                    <br />
                    <p style={{ color: 'var(--gold)', opacity: 0.85, fontSize: '0.85rem' }}>
                        &copy; {new Date().getFullYear()} MidasMark. All rights reserved. | a Bezaleel Group Subsidiary
                    </p>
                </div>
            </div>
        </footer>
    );
}
