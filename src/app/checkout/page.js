"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, CreditCard, Truck, Tag, CheckCircle2 } from "lucide-react";
import styles from "./page.module.css";
import { useState, useMemo, useRef } from "react";
import { placeOrder, verifyFirstOrderEligibility } from "./actions";
import GiftCardInput from "@/components/GiftCardInput";
import SquarePaymentForm from "@/components/SquarePaymentForm";

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

// ── Shipping tiers ──────────────────────────────────────────────────────────
const SHIPPING_OPTIONS = [
    { id: "free", label: "Standard Shipping (5-7 business days)", price: 0, note: "Free on orders over $150" },
    { id: "flat_10", label: "Express Shipping (2-3 business days)", price: 15, note: "" },
];

export default function Checkout() {
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

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postcode: "",
        phone: "",
        couponCode: ""
    });

    // ── Shipping selection state ─────────────────────────────────────────────
    const [selectedShipping, setSelectedShipping] = useState(null);

    // ── Payment acknowledgement ──────────────────────────────────────────────
    const [paymentAcknowledged, setPaymentAcknowledged] = useState(false);

    // Compute shipping cost
    const shippingCost = useMemo(() => {
        if (!selectedShipping) return 0;
        const opt = SHIPPING_OPTIONS.find(o => o.id === selectedShipping);
        if (opt && opt.id === "free" && cartTotal >= 150) return 0;
        if (opt && opt.id === "free" && cartTotal < 150) return 10;
        return opt ? opt.price : 0;
    }, [selectedShipping, cartTotal]);

    // Total including shipping
    const orderTotal = useMemo(() => {
        return Math.max(0, finalTotal + shippingCost);
    }, [finalTotal, shippingCost]);

    // ── Validation ───────────────────────────────────────────────────────────
    const requiredFields = ["email", "firstName", "lastName", "address1", "city", "state", "postcode", "phone"];
    const allFieldsFilled = requiredFields.every(f => formData[f]?.trim().length > 0);
    const isFormValid = allFieldsFilled && selectedShipping !== null && paymentAcknowledged;

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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Handle Email Blur: verify first-order 10% coupon eligibility with WooCommerce REST API
     */
    const handleEmailBlur = async () => {
        const email = formData.email.trim();
        if (!email || !email.includes("@")) return;

        setIsCheckingEmail(true);
        setEmailNotice(null);

        try {
            const res = await verifyFirstOrderEligibility(email);

            if (res.eligible) {
                applyFirstOrderCoupon(res.couponCode || "FIRST10");
                setEmailNotice({
                    type: "success",
                    message: "🎉 Verified First-Time Order! 10% discount applied to your subtotal."
                });
            } else {
                removeCoupon();
                setEmailNotice({
                    type: "info",
                    message: res.message || "10% First Order discount is reserved for new customers."
                });
            }
        } catch (err) {
            console.error("Email verification error:", err);
        } finally {
            setIsCheckingEmail(false);
        }
    };

    /**
     * Submit Form: Tokenize card via Square Web Payments SDK & place order
     */
    const handlePayment = async (e) => {
        e.preventDefault();
        setError(null);

        // ── Client-side validation guards ────────────────────────────────
        if (!allFieldsFilled) {
            setError("Please fill in all required fields before placing your order.");
            return;
        }
        if (!selectedShipping) {
            setError("Please select a shipping method.");
            return;
        }
        if (!paymentAcknowledged) {
            setError("Please acknowledge the payment method before proceeding.");
            return;
        }

        // Basic postal code format check for Canada
        const postalRegex = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;
        if (!postalRegex.test(formData.postcode.trim())) {
            setError("Please enter a valid Canadian postal code (e.g. K1Z 8H7).");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsProcessing(true);

        try {
            // ── 1. Tokenize Card via Square SDK if mounted ────────────────
            let paymentToken = null;
            if (squareRef.current && typeof squareRef.current.tokenize === "function") {
                try {
                    paymentToken = await squareRef.current.tokenize();
                    console.log("[Checkout] Square payment tokenized:", paymentToken);
                } catch (tokenErr) {
                    console.warn("[Checkout] Square tokenization note:", tokenErr.message);
                    // If card is mounted and tokenization throws a user error (e.g. invalid card number), block submit
                    if (!tokenErr.message.includes("not fully loaded") && !tokenErr.message.includes("unavailable")) {
                        throw tokenErr;
                    }
                }
            }

            const shippingOpt = SHIPPING_OPTIONS.find(o => o.id === selectedShipping);

            // Format customer data
            const customerData = {
                billing: {
                    first_name: formData.firstName.trim(),
                    last_name: formData.lastName.trim(),
                    address_1: formData.address1.trim(),
                    address_2: formData.address2.trim(),
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    postcode: formData.postcode.trim().toUpperCase(),
                    country: "CA",
                    email: formData.email.trim(),
                    phone: formData.phone.trim()
                },
                couponCode: appliedCoupon ? appliedCoupon.code : formData.couponCode,
                appliedGiftCard: appliedGiftCard,
                shipping: {
                    first_name: formData.firstName.trim(),
                    last_name: formData.lastName.trim(),
                    address_1: formData.address1.trim(),
                    address_2: formData.address2.trim(),
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    postcode: formData.postcode.trim().toUpperCase(),
                    country: "CA"
                },
                shippingLine: {
                    method_id: selectedShipping,
                    method_title: shippingOpt?.label || "Standard Shipping",
                    total: shippingCost.toFixed(2),
                },
            };

            // Call Server Action
            const result = await placeOrder(cart, customerData, paymentToken);

            if (result.success) {
                console.log("Order created successfully:", result.orderId);
                clearCart();
                router.push(`/checkout/success?orderId=${result.orderId}`);
            } else {
                throw new Error(result.error);
            }

        } catch (err) {
            console.error("Error creating order:", err);
            setError(err.message || "Failed to process order. Please try again.");
            setIsProcessing(false);
        }
    };

    // Helper to render shipping price label
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
                            <ArrowLeft size={16} /> Return to Cart
                        </Link>
                        <img src="/logos/header-logo.png" alt="Logo" className={styles.logo} />
                    </div>

                    <form onSubmit={handlePayment} className={styles.form} noValidate>
                        <h2 className={styles.sectionTitle}>Contact Information</h2>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            required
                            className={styles.input}
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleEmailBlur}
                        />
                        {isCheckingEmail && (
                            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-0.5rem', marginBottom: '0.75rem' }}>
                                Verifying first-order eligibility...
                            </p>
                        )}
                        {emailNotice && (
                            <div style={{
                                padding: '0.6rem 0.8rem',
                                borderRadius: '4px',
                                fontSize: '0.82rem',
                                marginBottom: '1rem',
                                background: emailNotice.type === 'success' ? '#f0fdf4' : '#f8fafc',
                                border: emailNotice.type === 'success' ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                                color: emailNotice.type === 'success' ? '#166534' : '#475569'
                            }}>
                                {emailNotice.message}
                            </div>
                        )}

                        <h2 className={styles.sectionTitle}>Shipping Address</h2>
                        <div className={styles.row2}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                required
                                className={styles.input}
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                required
                                className={styles.input}
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <input
                            type="text"
                            name="address1"
                            placeholder="Address"
                            required
                            className={styles.input}
                            value={formData.address1}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="address2"
                            placeholder="Apartment, suite, etc. (optional)"
                            className={styles.input}
                            value={formData.address2}
                            onChange={handleInputChange}
                        />
                        <div className={styles.row3}>
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                required
                                className={styles.input}
                                value={formData.city}
                                onChange={handleInputChange}
                            />
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
                            <input
                                type="text"
                                name="postcode"
                                placeholder="Postal Code"
                                required
                                className={styles.input}
                                value={formData.postcode}
                                onChange={handleInputChange}
                            />
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone"
                            required
                            className={styles.input}
                            value={formData.phone}
                            onChange={handleInputChange}
                        />

                        {/* ── Shipping Method Selection ─────────────────────────── */}
                        <h2 className={styles.sectionTitle}>
                            <Truck size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            Shipping Method
                        </h2>
                        <div className={styles.shippingOptions}>
                            {SHIPPING_OPTIONS.map(opt => {
                                let displayPrice = opt.price;
                                let isFree = false;
                                if (opt.id === "free" && cartTotal >= 150) {
                                    displayPrice = 0;
                                    isFree = true;
                                } else if (opt.id === "free" && cartTotal < 150) {
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
                                            {opt.note && isFree && (
                                                <span className={styles.shippingNote}>{opt.note}</span>
                                            )}
                                        </div>
                                        <span className={styles.shippingPrice}>
                                            {displayPrice === 0 ? "Free" : `$${displayPrice.toFixed(2)}`}
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

                        {/* ── Payment Method & Square Web Payments SDK ─────────── */}
                        <h2 className={styles.sectionTitle}>
                            <CreditCard size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            Payment Method
                        </h2>

                        {/* Official Square Web Payments SDK Component */}
                        <SquarePaymentForm ref={squareRef} />

                        <label className={styles.paymentAck}>
                            <input
                                type="checkbox"
                                checked={paymentAcknowledged}
                                onChange={(e) => setPaymentAcknowledged(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <span>I confirm I will complete payment via Square / Credit Card for this order.</span>
                        </label>
                        {!paymentAcknowledged && (
                            <div className={styles.warningBox}>
                                <AlertTriangle size={14} /> You must acknowledge the payment method before placing your order.
                            </div>
                        )}

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
                            {isProcessing ? "Creating Order..." : `Place Order - $${orderTotal.toFixed(2)} CAD`}
                        </button>
                        <p className={styles.secureNote}>
                            🔒 Tax included · Shipping calculated above
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
                                <span className={styles.price}>${item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.costs}>
                        <div className={styles.costRow}>
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        {appliedCoupon && firstOrderDiscount > 0 && (
                            <div className={styles.costRow} style={{ color: 'var(--gold, #D4AF37)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Tag size={13} /> {appliedCoupon.label || "First Order (10% Off)"}
                                </span>
                                <span>-${firstOrderDiscount.toFixed(2)}</span>
                            </div>
                        )}
                        {giftCardDiscount > 0 && (
                            <div className={styles.costRow} style={{ color: 'var(--gold, #D4AF37)' }}>
                                <span>Gift Card Balance</span>
                                <span>-${giftCardDiscount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className={styles.costRow}>
                            <span>Shipping</span>
                            <span>{renderShippingLabel()}</span>
                        </div>
                        <div className={`${styles.costRow} ${styles.total}`}>
                            <span>Total Due</span>
                            <span>${orderTotal.toFixed(2)} CAD</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
