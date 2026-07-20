"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail } from "lucide-react";
import styles from "./Footer.module.css";
import { SITE_MEDIA } from "@/config/media";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            {/* Three-layer perfectly seamless wave — 3-period SVG tile */}
            <div className={styles.waveWrapper}>

                {/* Layer 1: deep ghost, slowest, forward */}
                <svg className={styles.waveSvgDeep}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 4320 240"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    {/* 3 identical sine-like periods: each goes 0→1440, 1440→2880, 2880→4320 */}
                    <path d="
                        M0,120
                        C360,0 1080,240 1440,120
                        C1800,0 2520,240 2880,120
                        C3240,0 3960,240 4320,120
                        L4320,240 L0,240 Z
                    " />
                </svg>

                {/* Layer 2: mid, reverse waveSlideB (starts offset so reverse is seamless) */}
                <svg className={styles.waveSvgBack}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 4320 240"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path d="
                        M0,140
                        C270,20 900,220 1440,130
                        C1980,40 2610,220 2880,130
                        C3150,40 3870,220 4320,140
                        L4320,240 L0,240 Z
                    " />
                </svg>

                {/* Layer 3: front, solid #0b0b0b = exact footer color, fastest */}
                <svg className={styles.waveSvgFront}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 4320 240"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path d="
                        M0,160
                        C240,60 720,220 1440,165
                        C2160,110 2700,220 2880,165
                        C3060,110 3840,220 4320,160
                        L4320,240 L0,240 Z
                    " />
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
                            Fashion & Artistry redefined.
                        </p>
                        {/* Monochrome Canada flag */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 200 100"
                            width="90"
                            height="45"
                            aria-label="Made in Canada"
                            style={{ marginTop: '1rem', opacity: 0.45 }}
                        >
                            {/* Left bar */}
                            <rect x="0" y="0" width="50" height="100" fill="var(--off-white)" />
                            {/* Right bar */}
                            <rect x="150" y="0" width="50" height="100" fill="var(--off-white)" />
                            {/* Centre white panel */}
                            <rect x="50" y="0" width="100" height="100" fill="var(--off-white)" opacity="0.15" />
                            {/* Maple leaf */}
                            <g transform="translate(100,50)" fill="var(--off-white)">
                                <path d="
                                    M0,-28 L4,-12
                                    L16,-18 L11,-7
                                    L24,-2 L14,4
                                    L18,22 L8,16
                                    L4,32 L0,22
                                    L-4,32 L-8,16
                                    L-18,22 L-14,4
                                    L-24,-2 L-11,-7
                                    L-16,-18 L-4,-12 Z
                                " />
                                {/* Stem */}
                                <rect x="-3" y="22" width="6" height="14" />
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
