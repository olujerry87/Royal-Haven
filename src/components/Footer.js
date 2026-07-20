"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail } from "lucide-react";
import styles from "./Footer.module.css";
import { SITE_MEDIA } from "@/config/media";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            {/* Three-layer dynamic sliding waves — 3-period SVG tiles with independent speeds */}
            <div className={styles.waveWrapper}>
                {/* Ghost layer — most transparent, tallest crests, slow */}
                <svg
                    className={styles.waveSvgDeep}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 4320 180"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path
                        fill="rgba(11,11,11,0.22)"
                        d="M0,90 C360,50 1080,130 1440,90 C1800,50 2520,130 2880,90 C3240,50 3960,130 4320,90 L4320,180 L0,180 Z"
                    />
                </svg>
                {/* Mid layer — semi-transparent, medium height, offset phase */}
                <svg
                    className={styles.waveSvgBack}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 4320 180"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path
                        fill="rgba(11,11,11,0.52)"
                        d="M0,100 C360,140 1080,60 1440,100 C1800,140 2520,60 2880,100 C3240,140 3960,60 4320,100 L4320,180 L0,180 Z"
                    />
                </svg>
                {/* Front layer — solid footer color, lowest crests, fastest */}
                <svg
                    className={styles.waveSvgFront}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 4320 180"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path
                        fill="#0b0b0b"
                        d="M0,110 C180,70 900,150 1440,110 C1620,70 2340,150 2880,110 C3060,70 3780,150 4320,110 L4320,180 L0,180 Z"
                    />
                </svg>
            </div>
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
                            Fashion &amp; Artistry redefined.
                        </p>
                        {/* Miniature Proportional Canada flag matching user attachment */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 480"
                            width="54"
                            height="40"
                            role="img"
                            aria-label="Canadian flag"
                            style={{ marginTop: '0.8rem', display: 'block', opacity: 0.85, border: '1px solid rgba(255, 255, 255, 0.25)' }}
                        >
                            {/* White flag background */}
                            <rect width="640" height="480" fill="var(--off-white)" />
                            {/* Left black stripe */}
                            <rect x="0" y="0" width="160" height="480" fill="#0b0b0b" />
                            {/* Right black stripe */}
                            <rect x="480" y="0" width="160" height="480" fill="#0b0b0b" />
                            {/* Official 11-point maple leaf in black */}
                            <path
                                fill="#0b0b0b"
                                d="M201 232l-13.3 4.4 61.4 54c4.7 13.7-1.6 17.8-5.6 25l66.6-8.4-1.6 67 13.9-.3-3.1-66.6 66.7 8c-4.1-8.7-7.8-13.3-4-27.2l61.3-51-10.7-4c-8.8-6.8 3.8-32.6 5.6-48.9 0 0-35.7 12.3-38 5.8l-9.2-17.5-32.6 35.8c-3.5.9-5-.5-5.9-3.5l15-74.8-23.8 13.4q-3.2 1.3-5.2-2.2l-23-46-23.6 47.8q-2.8 2.5-5 .7L264 130.8l13.7 74.1c-1.1 3-3.7 3.8-6.7 2.2l-31.2-35.3c-4 6.5-6.8 17.1-12.2 19.5s-23.5-4.5-35.6-7c4.2 14.8 17 39.6 9 47.7"
                            />
                        </svg>
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
