"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, CreditCard, Truck, Tag, Globe } from "lucide-react";
import styles from "./page.module.css";
import { useState, useMemo, useRef } from "react";
import { placeOrder, verifyFirstOrderEligibility } from "./actions";
import GiftCardInput from "@/components/GiftCardInput";
import SquarePaymentForm from "@/components/SquarePaymentForm";
import { isDisposableEmail } from "@/lib/disposableEmailDomains";
import { useLanguage } from "@/context/LanguageContext";

// ── Country list ─────────────────────────────────────────────────────────────
const COUNTRIES = [
    { code: "CA", label: "Canada 🇨🇦 (Domestic)" },
    { code: "US", label: "United States 🇺🇸" },
    { code: "GB", label: "United Kingdom 🇬🇧" },
    { code: "AU", label: "Australia 🇦🇺" },
    { code: "INTL", label: "International (Other)" }
];

// ── Canadian provinces for the dropdown ──────────────────────────────────────
const CA_PROVINCES = [
    { code: "", label: "Select Province" },
    { code: "AB", label: "Alberta" },
    { code: "BC", label: "British Columbia" },
    { code: "MB", label: "Manitoba" },
    { code: "NB", label: "New Brunswick" },
    { code: "NL", label: "Newfoundland and Labrador" },
    { code: "NS", label: "Nova Scotia" },
    { code: "NT", label: "Northwest Territories" },
    { code: "NU", label: "Nunavut" },
    { code: "ON", label: "Ontario" },
    { code: "PE", label: "Prince Edward Island" },
    { code: "QC", label: "Quebec" },
    { code: "SK", label: "Saskatchewan" },
    { code: "YT", label: "Yukon" },
];

export default function Checkout() {
    const { t } = useLanguage();
    const { 
        cart, 
        cartTotal, 
        appliedCoupon, 
        applyFirstOrderCoupon, 
        removeCoupon, 
        firstOrderDiscount, 
        giftCardDiscount, 
        finalTotal, 
        appliedGiftCard, 
        clearCart 
    } = useCart();

    
    const router = useRouter();
    const squareRef = useRef(null);

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    // ── Email Verification State ─────────────────────────────────────────────
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [emailNotice, setEmailNotice] = useState(null);
    const [isDisposableError, setIsDisposableError] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        city: "",
        state: "ON",
        postcode: "",
        country: "CA",
        phone: "",
        couponCode: ""
    });

    // Shipping selection state
    const [selectedShipping, setSelectedShipping] = useState(null);

    // Dynamic Shipping options based on Country
    const isDomesticCanada = formData.country === "CA";

    const SHIPPING_OPTIONS = useMemo(() => {
        if (isDomesticCanada) {
            return [
                { id: "free", label: "Standard Shipping (5-7 business days)", price: 0, note: "Free on Canadian orders over $150" },
                { id: "flat_15", label: "Express Shipping (2-3 business days)", price: 15, note: "" },
            ];
        } else {
            return [
                { id: "intl_std", label: "Standard International Carrier Freight (7-10 business days)", price: 25, note: "Weight-scaled international flat rate" },
                { id: "intl_exp", label: "Express International Freight (3-5 business days)", price: 45, note: "" },
            ];
        }
    }, [isDomesticCanada]);

    // Compute shipping cost strictly enforcing Canada-only free shipping
    const shippingCost = useMemo(() => {
        if (!selectedShipping) return 0;
        const opt = SHIPPING_OPTIONS.find(o => o.id === selectedShipping);
        
        // Free shipping is strictly RESTRICTED TO CANADA ONLY for orders $150+
        if (opt && opt.id === "free" && isDomesticCanada && cartTotal >= 150) {
            return 0;
        }
        if (opt && opt.id === "free" && isDomesticCanada && cartTotal < 150) {
            return 10;
        }
        if (opt && !isDomesticCanada) {
            return opt.price; // US, UK, AU, International always incurs freight cost even if subtotal > $150
        }
        return opt ? opt.price : 0;
    }, [selectedShipping, cartTotal, isDomesticCanada, SHIPPING_OPTIONS]);

    // Total including shipping
    const orderTotal = useMemo(() => {
        return Math.max(0, finalTotal + shippingCost);
    }, [finalTotal, shippingCost]);

    // Validation completeness
    const requiredFields = ["email", "firstName", "lastName", "address1", "city", "postcode", "phone"];
    const allFieldsFilled = requiredFields.every(f => formData[f]?.trim().length > 0);
    const isFormValid = allFieldsFilled && selectedShipping !== null && !isDisposableError;

    // Redirect if cart is empty
    if (cart.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <p>Your cart is empty.</p>
                <Link href="/shop" className="btn-primary">Return to Shop</Link>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setIsDisposableError(false);
        }
        if (name === "country") {
            setSelectedShipping(null); // Reset shipping option selection when country changes
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Handle Email Verification & Disposable Email Domain Interception
     */
    const handleEmailBlur = async () => {
        const email = formData.email.trim();
        if (!email || !email.includes("@")) return;

        // ── Requirement 5: Disposable/Temporary Email Domain Interception ────
        if (isDisposableEmail(email)) {
            setIsDisposableError(true);
            removeCoupon(); // Strip 10% coupon modifier from global cart calculations
            setEmailNotice({
                type: "error",
                message: "Please enter a valid, permanent email address to finalize your checkout sequence."
            });
            return;
        }

        setIsDisposableError(false);
        setIsCheckingEmail(true);
        setEmailNotice(null);

        try {
            const res = await verifyFirstOrderEligibility(email);

            if (res.eligible) {
                applyFirstOrderCoupon(res.couponCode || "FIRST10");
                setEmailNotice({
                    type: "success",
                    message: "🎉 Verified First-Time Buyer! 10% discount applied to your order."
                });
            } else {
                removeCoupon();
                setEmailNotice({
                    type: "info",
                    message: res.message || "10% First Order discount is reserved for first-time buyers."
                });
            }
        } catch (err) {
            console.error("Email verification error:", err);
        } finally {
            setIsCheckingEmail(false);
        }
    };

    /**
     * Submit Form: Intercept submission & strictly tokenize card via Square Web Payments SDK
     */
    const handlePayment = async (e) => {
        e.preventDefault();
        setError(null);

        // ── 1. Client-Side Field & Email Guards ─────────────────────────────
        if (isDisposableEmail(formData.email.trim())) {
            setIsDisposableError(true);
            setError("Please enter a valid, permanent email address to finalize your checkout sequence.");
            return;
        }

        if (!allFieldsFilled) {
            setError("Please fill in all required shipping and contact fields.");
            return;
        }
        if (!selectedShipping) {
            setError("Please select a shipping method before placing your order.");
            return;
        }

        // Postal code check for Canada
        if (formData.country === "CA") {
            const postalRegex = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;
            if (!postalRegex.test(formData.postcode.trim())) {
                setError("Please enter a valid Canadian postal code (e.g. K1Z 8H7).");
                return;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsProcessing(true);

        try {
            // ── 2. STRICT SQUARE PAYMENT TOKENIZATION INTERCEPTOR ─────────────
            if (!squareRef.current || typeof squareRef.current.tokenize !== "function") {
                throw new Error("Square payment fields are loading. Please wait a moment and try again.");
            }

            let paymentToken = null;
            try {
                paymentToken = await squareRef.current.tokenize();
            } catch (tokenErr) {
                console.error("[Checkout] Tokenization failed:", tokenErr);
                throw new Error(`Credit Card Validation Failed: ${tokenErr.message}`);
            }

            if (!paymentToken) {
                throw new Error("Could not generate payment authorization token. Please verify credit card number, expiry, and CVV.");
            }

            console.log("[Checkout] Square Token Authorized:", paymentToken);

            // ── 3. Submit Order to Backend ────────────────────────────────────
            const shippingOpt = SHIPPING_OPTIONS.find(o => o.id === selectedShipping);

            const customerData = {
                billing: {
                    first_name: formData.firstName.trim(),
                    last_name: formData.lastName.trim(),
                    address_1: formData.address1.trim(),
                    address_2: formData.address2.trim(),
                    city: formData.city.trim(),
                    state: formData.state.trim() || "N/A",
                    postcode: formData.postcode.trim().toUpperCase(),
                    country: formData.country,
                    email: formData.email.trim(),
                    phone: formData.phone.trim()
                },
                // NOTE: Discount is applied client-side in CartContext (10% of subtotal).
                // The discounted finalTotal is what Square charges the customer.
                // We pass discountAmount so WooCommerce records it as a negative fee_line in admin.
                discountAmount: firstOrderDiscount > 0 ? firstOrderDiscount : 0,
                discountLabel: appliedCoupon ? `First Order Discount (${appliedCoupon.discountPercent}% Off)` : null,
                appliedGiftCard: appliedGiftCard,
                shipping: {
                    first_name: formData.firstName.trim(),
                    last_name: formData.lastName.trim(),
                    address_1: formData.address1.trim(),
                    address_2: formData.address2.trim(),
                    city: formData.city.trim(),
                    state: formData.state.trim() || "N/A",
                    postcode: formData.postcode.trim().toUpperCase(),
                    country: formData.country
                },
                shippingLine: {
                    method_id: selectedShipping,
                    method_title: shippingOpt?.label || "Standard Shipping",
                    total: shippingCost.toFixed(2),
                },
            };

            const result = await placeOrder(cart, customerData, paymentToken);

            if (result.success) {
                console.log("Order created & authorized successfully:", result.orderId);
                clearCart();
                router.push(`/checkout/success?orderId=${result.orderId}`);
            } else {
                throw new Error(result.error);
            }

        } catch (err) {
            console.error("Error creating order:", err);
            setError(err.message || "Failed to process order. Please check credit card details.");
            setIsProcessing(false);
        }
    };

    const renderShippingLabel = () => {
        if (!selectedShipping) return "Select method";
        if (shippingCost === 0) return "Free";
        return `$${shippingCost.toFixed(2)}`;
    };

    return (
        <main className={styles.container}>
            <div className={styles.grid}>
                {/* Left: Form */}
                <div className={styles.formSection}>
                    <div className={styles.header}>
                        <Link href="/cart" className={styles.backLink}>
                            <ArrowLeft size={16} /> {t("common.back", "Return to Cart")}
                        </Link>
                        <img src="/logos/header-logo.png" alt="Logo" className={styles.logo} />
                    </div>

                    <form onSubmit={handlePayment} className={styles.form} noValidate>
                        <h2 className={styles.sectionTitle}>{t("checkout.contactInfo", "Contact Information")}</h2>
                        <input
                            type="email"
                            name="email"
                            placeholder={t("checkout.email", "Email Address")}
                            required
                            className={`${styles.input} ${isDisposableError ? styles.inputError : ''}`}
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleEmailBlur}
                        />
                        {isCheckingEmail && (
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-0.5rem', marginBottom: '0.75rem' }}>
                                {t("common.loading", "Verifying email address...")}
                            </p>
                        )}
                        {emailNotice && (
                            <div style={{
                                padding: '0.66rem 0.85rem',
                                borderRadius: '6px',
                                fontSize: '0.84rem',
                                marginBottom: '1rem',
                                background: emailNotice.type === 'success' ? '#f0fdf4' : emailNotice.type === 'error' ? '#fef2f2' : '#f8fafc',
                                border: emailNotice.type === 'success' ? '1px solid #bbf7d0' : emailNotice.type === 'error' ? '1px solid #feccae' : '1px solid #e2e8f0',
                                color: emailNotice.type === 'success' ? '#166534' : emailNotice.type === 'error' ? '#991b1b' : '#475569'
                            }}>
                                {emailNotice.message}
                            </div>
                        )}

                        <h2 className={styles.sectionTitle}>{t("checkout.shippingAddress", "Shipping Address")}</h2>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--charcoal)', display: 'block', marginBottom: '0.35rem' }}>
                                <Globe size={14} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} /> {t("checkout.country", "Country")}
                            </label>
                            <select
                                name="country"
                                required
                                className={styles.input}
                                value={formData.country}
                                onChange={handleInputChange}
                            >
                                {COUNTRIES.map(c => (
                                    <option key={c.code} value={c.code}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.row2}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder={t("checkout.firstName", "First Name")}
                                required
                                className={styles.input}
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder={t("checkout.lastName", "Last Name")}
                                required
                                className={styles.input}
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <input
                            type="text"
                            name="address1"
                            placeholder={t("checkout.address", "Street Address")}
                            required
                            className={styles.input}
                            value={formData.address1}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="address2"
                            placeholder={t("checkout.apartment", "Apartment, suite, unit (optional)")}
                            className={styles.input}
                            value={formData.address2}
                            onChange={handleInputChange}
                        />
                        <div className={styles.row3}>
                            <input
                                type="text"
                                name="city"
                                placeholder={t("checkout.city", "City")}
                                required
                                className={styles.input}
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                            {formData.country === "CA" ? (
                                <select
                                    name="state"
                                    required
                                    className={styles.input}
                                    value={formData.state}
                                    onChange={handleInputChange}
                                >
                                    {CA_PROVINCES.map(p => (
                                        <option key={p.code} value={p.code}>{p.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="state"
                                    placeholder={t("checkout.province", "Province / State")}
                                    required
                                    className={styles.input}
                                    value={formData.state}
                                    onChange={handleInputChange}
                                />
                            )}
                            <input
                                type="text"
                                name="postcode"
                                placeholder={t("checkout.postalCode", "Postal / ZIP Code")}
                                required
                                className={styles.input}
                                value={formData.postcode}
                                onChange={handleInputChange}
                            />
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            placeholder={t("checkout.phone", "Phone Number")}
                            required
                            className={styles.input}
                            value={formData.phone}
                            onChange={handleInputChange}
                        />

                        {/* ── Shipping Method Selection ─────────────────────────── */}
                        <h2 className={styles.sectionTitle}>
                            <Truck size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            {t("checkout.shippingMethod", "Shipping Method")} ({isDomesticCanada ? "Canada" : "International"})
                        </h2>
                        <div className={styles.shippingOptions}>
                            {SHIPPING_OPTIONS.map(opt => {
                                let displayPrice = opt.price;
                                let isFree = false;
                                if (opt.id === "free" && isDomesticCanada && cartTotal >= 150) {
                                    displayPrice = 0;
                                    isFree = true;
                                } else if (opt.id === "free" && isDomesticCanada && cartTotal < 150) {
                                    displayPrice = 10;
                                    isFree = false;
                                }

                                return (
                                    <label
                                        key={opt.id}
                                        className={`${styles.shippingOption} ${selectedShipping === opt.id ? styles.shippingSelected : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="shipping_method"
                                            value={opt.id}
                                            checked={selectedShipping === opt.id}
                                            onChange={() => setSelectedShipping(opt.id)}
                                            className={styles.radioInput}
                                        />
                                        <div className={styles.shippingInfo}>
                                            <span className={styles.shippingLabel}>{opt.label}</span>
                                            {opt.note && (
                                                <span className={styles.shippingNote}>{opt.note}</span>
                                            )}
                                        </div>
                                        <span className={styles.shippingPrice}>
                                            {displayPrice === 0 ? t("checkout.free", "Free") : `$${displayPrice.toFixed(2)} CAD`}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                        {!selectedShipping && (
                            <div className={styles.warningBox}>
                                <AlertTriangle size={14} /> Please select a shipping method.
                            </div>
                        )}

                        <GiftCardInput />

                        {/* ── Official Square Web Payments SDK ──────────────────── */}
                        <h2 className={styles.sectionTitle}>
                            <CreditCard size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            {t("checkout.payment", "Payment Method")}
                        </h2>

                        {/* Square Web Payments SDK iframe container */}
                        <SquarePaymentForm ref={squareRef} />

                        {error && (
                            <div className={styles.errorBox}>
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={styles.payBtn}
                            disabled={isProcessing || !isFormValid}
                        >
                            {isProcessing ? t("checkout.processing", "Processing Order...") : `${t("checkout.placeOrder", "Place Order")} - $${orderTotal.toFixed(2)} CAD`}
                        </button>
                        <p className={styles.secureNote}>
                            {t("checkout.secureCheckout", "🔒 256-Bit Encrypted Secure Checkout")}
                        </p>
                    </form>
                </div>

                {/* Right: Summary */}
                <div className={styles.summarySection}>
                    <div className={styles.items}>
                        {cart.map((item) => (
                            <div key={`${item.id}-${item.size || item.id}`} className={styles.item}>
                                <div className={styles.imageWrapper}>
                                    <img 
                                        src={item.images && item.images.length > 0 ? item.images[0] : "/images/spotlight.jpg"} 
                                        alt={item.name || "Product"} 
                                        className={styles.image} 
                                    />
                                    <span className={styles.badge}>{item.quantity}</span>
                                </div>
                                <div className={styles.info}>
                                    <span className={styles.name}>{item.name}</span>
                                    <span className={styles.variant}>{item.size || "Fixed"}</span>
                                </div>
                                <span className={styles.price}>${(item.price * item.quantity).toFixed(2)} CAD</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.costs}>
                        <div className={styles.costRow}>
                            <span>{t("cart.subtotal", "Subtotal")}</span>
                            <span>${cartTotal.toFixed(2)} CAD</span>
                        </div>
                        {appliedCoupon && firstOrderDiscount > 0 && (
                            <div className={styles.costRow} style={{ color: 'var(--gold, #D4AF37)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Tag size={13} /> {appliedCoupon.label || "First Order (10% Off)"}
                                </span>
                                <span>-${firstOrderDiscount.toFixed(2)} CAD</span>
                            </div>
                        )}
                        {giftCardDiscount > 0 && (
                            <div className={styles.costRow} style={{ color: 'var(--gold, #D4AF37)' }}>
                                <span>{t("checkout.discount", "Gift Card Balance")}</span>
                                <span>-${giftCardDiscount.toFixed(2)} CAD</span>
                            </div>
                        )}
                        <div className={styles.costRow}>
                            <span>{t("checkout.shipping", "Shipping")}</span>
                            <span>{renderShippingLabel()}</span>
                        </div>
                        <div className={`${styles.costRow} ${styles.total}`}>
                            <span>{t("cart.total", "Total Due")}</span>
                            <span>${orderTotal.toFixed(2)} CAD</span>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
