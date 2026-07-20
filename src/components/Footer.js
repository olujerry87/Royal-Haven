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
                    viewBox="0 0 4320 160"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path
                        fill="rgba(11,11,11,0.22)"
                        d="M0,80 C360,-10 1080,170 1440,80 C1800,-10 2520,170 2880,80 C3240,-10 3960,170 4320,80 L4320,160 L0,160 Z"
                    />
                </svg>
                {/* Mid layer — semi-transparent, medium height, reverse direction */}
                <svg
                    className={styles.waveSvgBack}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 4320 160"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path
                        fill="rgba(11,11,11,0.52)"
                        d="M0,100 C300,20 900,155 1440,100 C1980,45 2580,155 2880,100 C3180,45 3780,155 4320,100 L4320,160 L0,160 Z"
                    />
                </svg>
                {/* Front layer — solid footer color, lowest crests, fastest */}
                <svg
                    className={styles.waveSvgFront}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 4320 160"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path
                        fill="#0b0b0b"
                        d="M0,118 C240,55 840,150 1440,118 C2040,86 2640,150 2880,118 C3120,86 3720,150 4320,118 L4320,160 L0,160 Z"
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
                        {/* Proportional Monochrome Canada flag */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 200 100"
                            width="90"
                            height="45"
                            role="img"
                            aria-label="Canadian flag"
                            style={{ marginTop: '1.2rem', display: 'block', opacity: 0.55 }}
                        >
                            {/* Left stripe */}
                            <rect x="0" y="0" width="50" height="100" fill="var(--off-white)" opacity="0.6" />
                            {/* Right stripe */}
                            <rect x="150" y="0" width="50" height="100" fill="var(--off-white)" opacity="0.6" />
                            {/* Center white panel */}
                            <rect x="50" y="0" width="100" height="100" fill="var(--off-white)" opacity="0.15" />
                            {/* Official 11-point maple leaf */}
                            <g transform="translate(100, 48)" fill="var(--off-white)" opacity="0.85">
                                <path d="
                                    M 0,-40
                                    L 1.5,-27 L 5,-28 L 4,-23 L 8,-24 L 18,-30
                                    L 16,-18 L 32,-15 L 22,-5 L 28,6 L 14,2
                                    L 13,18 L 8,14 L 0,16
                                    L -8,14 L -13,18 L -14,2 L -28,6 L -22,-5
                                    L -32,-15 L -16,-18 L -18,-30 L -8,-24 L -4,-23
                                    L -5,-28 L -1.5,-27
                                    Z
                                " />
                                <path d="M -1.5,16 L -1.5,38 L 1.5,38 L 1.5,16 Z" />
                            </g>
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
