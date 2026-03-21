"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ShoppingBag, Calendar } from "lucide-react";
import styles from "./Navigation.module.css";
import { useCart } from "@/context/CartContext";

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const pathname = usePathname();

    // Scroll detection for transparent-to-solid effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ""}`}>
            <div className={styles.container}>
                {/* Logo */}
                <div className={styles.logo}>
                    <Link href="/">
                        <Image
                            src="/logos/header-logo.png"
                            alt="Wura & Ewa"
                            width={210}
                            height={40}
                            className={styles.headerLogoImg}
                            priority
                        />
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className={styles.desktopMenu}>
                    <div className={styles.menuItem}>
                        <Link href="/shop" className={styles.link}>
                            Wura (Clothing) <ChevronDown size={14} />
                        </Link>
                        <div className={styles.megaMenu}>
                            <div className={styles.megaContent}>
                                <div className={styles.column}>
                                    <h3>Collections</h3>
                                    <Link href="/shop/unisex">Unisex Heritage</Link>
                                    <Link href="/shop/female">Female Contemporary</Link>
                                    <Link href="/shop/accessories">Accessories</Link>
                                </div>
                                <div className={styles.column}>
                                    <h3>Featured</h3>
                                    <Link href="/shop/new">New Arrivals</Link>
                                    <Link href="/shop/best-sellers">Best Sellers</Link>
                                </div>
                                {/* Image Placeholder */}
                                <div className={styles.promoImage}>
                                    <div className={styles.placeholder}>New Collection</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.menuItem}>
                        <Link href="/services" className={styles.link}>
                            Ewa (Artistry) <ChevronDown size={14} />
                        </Link>
                        <div className={styles.megaMenu}>
                            <div className={styles.megaContent}>
                                <div className={styles.column}>
                                    <h3>Services</h3>
                                    <Link href="/services/makeup">Makeup</Link>
                                    <Link href="/services/hair">Hair</Link>
                                    <Link href="/services/gele">Gele</Link>
                                </div>
                                <div className={styles.column}>
                                    <h3>Studio</h3>
                                    <Link href="/services/book">Book Appointment</Link>
                                    <Link href="/services/portfolio">Portfolio</Link>
                                </div>
                                <div className={styles.promoImage}>
                                    <div className={styles.placeholder}>Glam</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="/heritage" className={styles.link}>
                        Heritage
                    </Link>

                    <Link href="/heritage#styling" className={styles.link} style={{ color: 'var(--gold)', fontWeight: 600 }}>
                        Styling Intelligence ✨
                    </Link>
                </div>

                {/* Icons */}
                <div className={styles.actions}>
                    <Link href="/services/book" className={styles.iconBtn} aria-label="Book Appointment">
                        <Calendar size={20} />
                    </Link>
                    <Link href="/cart" className={styles.iconBtn} aria-label="Cart" style={{ position: 'relative' }}>
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: 'var(--gold)',
                                color: 'var(--obsidian)',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <div className={styles.mobileLinks}>
                        <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop Wura</Link>
                        <Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>Book Ewa</Link>
                        <Link href="/heritage" onClick={() => setIsMobileMenuOpen(false)}>Our Heritage</Link>
                        <Link href="/heritage#styling" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--gold)' }}>Stylist AI</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
