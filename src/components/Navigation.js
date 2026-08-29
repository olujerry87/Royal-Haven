"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ShoppingBag, Calendar } from "lucide-react";
import styles from "./Navigation.module.css";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import { SITE_MEDIA } from "@/config/media";

export default function Navigation({ wuraCategories = [] }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileEwaOpen, setMobileEwaOpen] = useState(false);
    const { cartCount } = useCart();
    const { t } = useLanguage();
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
        <nav className={`${styles.nav} glass-panel ${isScrolled ? styles.scrolled : ""}`}>
            <div className={styles.container}>
                {/* Logo */}
                <div className={styles.logo}>
                    <Link href="/" aria-label="Royal Haven Home">
                        <Image
                            src={SITE_MEDIA.logos.header}
                            alt="Royal Haven Logo"
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
                            {t("nav.wura", "Wura (Clothing)")} <ChevronDown size={14} />
                        </Link>
                        <div className={styles.megaMenu}>
                            <div className={styles.megaContent}>
                                <div className={styles.column}>
                                    <h3>{t("nav.collections", "Collections")}</h3>
                                    {wuraCategories.length > 0 ? (
                                        wuraCategories.map(cat => (
                                            <Link key={cat.id} href={`/shop?category=${encodeURIComponent(cat.name)}`}>{cat.name}</Link>
                                        ))
                                    ) : (
                                        <>
                                            <Link href="/shop">{t("nav.allProducts", "All Products")}</Link>
                                            <Link href="/shop">{t("nav.unisexHeritage", "Unisex Heritage")}</Link>
                                            <Link href="/shop">{t("nav.femaleContemporary", "Female Contemporary")}</Link>
                                        </>
                                    )}
                                </div>
                                <div className={styles.column}>
                                    <h3>{t("nav.featured", "Featured")}</h3>
                                    <Link href="/shop">{t("nav.newArrivals", "New Arrivals")}</Link>
                                    <Link href="/shop">{t("nav.bestSellers", "Best Sellers")}</Link>
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
                            {t("nav.ewa", "Ewa (Artistry)")} <ChevronDown size={14} />
                        </Link>
                        <div className={styles.megaMenu}>
                            <div className={styles.megaContent}>
                                <div className={styles.column}>
                                    <h3>{t("nav.services", "Services")}</h3>
                                    <Link href="/services/details#makeup">{t("nav.makeup", "Makeup")}</Link>
                                    <Link href="/services/details#hair">{t("nav.hair", "Hair")}</Link>
                                    <Link href="/services/details#gele">{t("nav.gele", "Gele")}</Link>
                                </div>
                                <div className={styles.column}>
                                    <h3>{t("nav.studio", "Studio")}</h3>
                                    <Link href="/services/book">{t("nav.bookAppointment", "Book Appointment")}</Link>
                                    <Link href="/lookbook">{t("nav.lookbook", "Lookbook")}</Link>
                                </div>
                                <div className={styles.promoImage}>
                                    <div className={styles.placeholder}>Glam</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="/heritage" className={styles.link}>
                        {t("nav.heritage", "Heritage")}
                    </Link>

                    <Link href="/heritage#styling" className={styles.link} style={{ color: 'var(--gold)', fontWeight: 600 }}>
                        {t("nav.styling", "Styling Intelligence ✨")}
                    </Link>
                </div>

                {/* Icons & Actions */}
                <div className={styles.actions}>
                    {/* Mobile Quick Language Toggle */}
                    <div className={styles.mobileLangSlot}>
                        <LanguageToggle variant="mobile-header" />
                    </div>

                    <Link href="/services/book" className={`${styles.iconBtn} ${styles.mobileHiddenIcon}`} aria-label={t("nav.bookAppointment", "Book Appointment")}>
                        <Calendar size={20} />
                    </Link>
                    <Link href="/cart" className={styles.iconBtn} aria-label={`View Cart, ${cartCount} items`} style={{ position: 'relative' }}>
                        <ShoppingBag size={20} aria-hidden="true" />
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
                        aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className={`${styles.mobileMenu} glass-panel`}>
                    {/* Top Drawer Language Switcher */}
                    <LanguageToggle variant="drawer" />

                    <div className={styles.mobileLinks}>
                        <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>
                            {t("nav.shopWura", "Shop Wura")}
                        </Link>

                        {/* Book Ewa expandable sub-section */}
                        <button
                            onClick={() => setMobileEwaOpen(!mobileEwaOpen)}
                            style={{
                                background: 'none', border: 'none', color: 'var(--off-white)',
                                fontFamily: 'var(--font-heritage)', fontSize: '1.8rem', fontWeight: 400,
                                cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            {t("nav.bookEwa", "Book Ewa")} <ChevronDown size={18} style={{ transform: mobileEwaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                        </button>
                        {mobileEwaOpen && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.2rem', borderLeft: '1px solid rgba(212,175,55,0.4)' }}>
                                <Link href="/lookbook" onClick={() => { setIsMobileMenuOpen(false); setMobileEwaOpen(false); }} style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>✦ {t("nav.lookbook", "Lookbook")}</Link>
                                <Link href="/services/book" onClick={() => { setIsMobileMenuOpen(false); setMobileEwaOpen(false); }} style={{ fontSize: '1.2rem' }}>{t("nav.bookAppointment", "Book Appointment")}</Link>
                                <Link href="/services/details#makeup" onClick={() => { setIsMobileMenuOpen(false); setMobileEwaOpen(false); }} style={{ fontSize: '1.2rem' }}>{t("nav.makeup", "Makeup")}</Link>
                                <Link href="/services/details#hair" onClick={() => { setIsMobileMenuOpen(false); setMobileEwaOpen(false); }} style={{ fontSize: '1.2rem' }}>{t("nav.hair", "Hair")}</Link>
                                <Link href="/services/details#gele" onClick={() => { setIsMobileMenuOpen(false); setMobileEwaOpen(false); }} style={{ fontSize: '1.2rem' }}>{t("nav.gele", "Gele")}</Link>
                            </div>
                        )}

                        <Link href="/heritage" onClick={() => setIsMobileMenuOpen(false)}>
                            {t("nav.ourHeritage", "Our Heritage")}
                        </Link>
                        <Link href="/heritage#styling" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--gold)' }}>
                            {t("nav.stylistAi", "Stylist AI ✨")}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
