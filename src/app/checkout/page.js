"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import styles from "./page.module.css";
import { useState } from "react";
import { placeOrder } from "./actions";

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);

        try {
            // Format customer data
            const customerData = {
                billing: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    address_1: formData.address1,
                    address_2: formData.address2,
                    city: formData.city,
                    state: formData.state,
                    postcode: formData.postcode,
                    country: "US",
                    country: "US",
                    email: formData.email,
                    phone: formData.phone
                },
                couponCode: formData.couponCode,
                shipping: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    address_1: formData.address1,
                    address_2: formData.address2,
                    city: formData.city,
                    state: formData.state,
                    postcode: formData.postcode,
                    country: "US"
                }
            };

            // Call Server Action
            const result = await placeOrder(cart, customerData);

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

                    <form onSubmit={handlePayment} className={styles.form}>
                        <h2 className={styles.sectionTitle}>Contact</h2>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            className={styles.input}
                            value={formData.email}
                            onChange={handleInputChange}
                        />

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
                            <input
                                type="text"
                                name="state"
                                placeholder="State/Province"
                                required
                                className={styles.input}
                                value={formData.state}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="postcode"
                                placeholder="Zip Code"
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

                        <h2 className={styles.sectionTitle}>Promo Code</h2>
                        <input
                            type="text"
                            name="couponCode"
                            placeholder="Gift Card or Promo Code (Optional)"
                            className={styles.input}
                            value={formData.couponCode}
                            onChange={handleInputChange}
                        />

                        <h2 className={styles.sectionTitle}>Payment</h2>
                        <div className={styles.paymentBox}>
                            <p>Order will be created in WordPress. Payment processing can be configured in WooCommerce settings.</p>
                        </div>

                        {error && (
                            <div className={styles.errorBox}>
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={styles.payBtn}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Creating Order..." : `Place Order - $${cartTotal}`}
                        </button>
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
                        <div className={styles.row}>
                            <span>Subtotal</span>
                            <span>${cartTotal}</span>
                        </div>
                        <div className={styles.row}>
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className={`${styles.row} ${styles.total}`}>
                            <span>Total</span>
                            <span>${cartTotal}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
