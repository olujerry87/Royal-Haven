"use client";

import { useCart } from "@/context/CartContext";
import Hero from "@/components/Hero";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <main>
                <Hero title="Your Bag" subtitle="Is currently empty." />
                <div className={styles.emptyState}>
                    <p>Looks like you haven&apos;t discovered our treasures yet.</p>
                    <Link href="/shop" className="btn-primary">
                        Return to Shop
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main>
            <Hero title="Shopping Bag" subtitle="Review your selection" />

            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Cart Items List */}
                    <div className={styles.itemsList}>
                        <div className={styles.headerRow}>
                            <span>Product</span>
                            <span>Quantity</span>
                            <span>Total</span>
                        </div>

                        {cart.map((item) => (
                            <div key={`${item.id}-${item.size}`} className={styles.itemCard}>
                                <div className={styles.productInfo}>
                                    <div className={styles.imageWrapper}>
                                        <img src={item.images[0]} alt={item.name} className={styles.image} />
                                    </div>
                                    <div className={styles.details}>
                                        <h3>{item.name}</h3>
                                        <p className={styles.meta}>Size: {item.size}</p>
                                        <p className={styles.meta}>${item.price}</p>
                                        <button
                                            onClick={() => removeFromCart(item.id, item.size)}
                                            className={styles.removeBtn}
                                        >
                                            <Trash2 size={16} /> Remove
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.quantityCol}>
                                    <div className={styles.qtyControl}>
                                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>
                                            <Minus size={14} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.totalCol}>
                                    ${item.price * item.quantity}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary / Checkout */}
                    <div className={styles.summary}>
                        <h2 className={styles.summaryTitle}>Order Summary</h2>
                        <div className={styles.row}>
                            <span>Subtotal</span>
                            <span>${cartTotal}</span>
                        </div>
                        <div className={styles.row}>
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className={`${styles.row} ${styles.totalRow}`}>
                            <span>Total</span>
                            <span>${cartTotal}</span>
                        </div>

                        <Link href="/checkout">
                            <button className="btn-primary" style={{ width: '100%', marginTop: '2rem' }}>
                                Proceed to Checkout <ArrowRight size={16} style={{ display: 'inline', marginLeft: '5px' }} />
                            </button>
                        </Link>

                        <p className={styles.note}>
                            Tax included and shipping calculated at checkout.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
