"use client";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import Hero from "@/components/Hero";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import styles from "./page.module.css";
import { SITE_MEDIA } from "@/config/media";
import GiftCardInput from "@/components/GiftCardInput";

export default function CartPage() {
    const { t } = useLanguage();
    const { cart, removeFromCart, updateQuantity, cartTotal, giftCardDiscount, finalTotal } = useCart();

    if (cart.length === 0) {
        return (
            <main>
                <Hero 
                    title={t("cart.title", "Your Shopping Bag")} 
                    subtitle={t("cart.empty", "Your bag is currently empty.")} 
                    imagePath={SITE_MEDIA.cart.hero}
                />
                <div className={styles.emptyState}>
                    <p>{t("cart.empty", "Your bag is currently empty.")}</p>
                    <Link href="/shop" className="btn-primary">
                        {t("cart.continueShopping", "Continue Shopping")}
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main>
            <Hero 
                title={t("cart.title", "Shopping Bag")} 
                subtitle={t("cart.bagSummary", "Review your selection")} 
                imagePath={SITE_MEDIA.cart.hero}
            />

            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Cart Items List */}
                    <div className={styles.itemsList}>
                        <div className={styles.headerRow}>
                            <span>{t("cart.product", "Product")}</span>
                            <span>{t("cart.quantity", "Quantity")}</span>
                            <span>{t("cart.total", "Total")}</span>
                        </div>

                        {cart.map((item) => (
                            <div key={`${item.id}-${item.size}`} className={styles.itemCard}>
                                <div className={styles.productInfo}>
                                    <div className={styles.imageWrapper}>
                                        <img src={item.images?.[0] || '/images/placeholder.jpg'} alt={item.name} className={styles.image} />
                                    </div>
                                    <div className={styles.details}>
                                        <h3>{item.name}</h3>
                                        <p className={styles.meta}>{t("pdp.size", "Size")}: {item.size}</p>
                                        <p className={styles.meta}>${Number(item.price).toFixed(2)} CAD</p>
                                        <button
                                            onClick={() => removeFromCart(item.id, item.size)}
                                            className={styles.removeBtn}
                                        >
                                            <Trash2 size={16} /> {t("cart.remove", "Remove")}
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
                                    ${(item.price * item.quantity).toFixed(2)} CAD
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary / Checkout */}
                    <div className={styles.summary}>
                        <h2 className={styles.summaryTitle}>{t("checkout.orderSummary", "Order Summary")}</h2>
                        <div className={styles.row}>
                            <span>{t("cart.subtotal", "Subtotal")}</span>
                            <span>${cartTotal.toFixed(2)} CAD</span>
                        </div>
                        {giftCardDiscount > 0 && (
                            <div className={styles.row} style={{ color: 'var(--gold, #D4AF37)' }}>
                                <span>{t("checkout.discount", "Gift Card Discount")}</span>
                                <span>-${giftCardDiscount.toFixed(2)} CAD</span>
                            </div>
                        )}
                        <div className={styles.row}>
                            <span>{t("checkout.shipping", "Shipping")}</span>
                            <span>{t("cart.shippingNote", "Calculated at checkout")}</span>
                        </div>
                        <div className={`${styles.row} ${styles.totalRow}`}>
                            <span>{t("cart.total", "Total")}</span>
                            <span>${finalTotal.toFixed(2)} CAD</span>
                        </div>

                        {/* Custom Gift Card Input Component */}
                        <GiftCardInput />

                        <Link href="/checkout">
                            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                {t("cart.proceedToCheckout", "Proceed to Checkout")} <ArrowRight size={16} style={{ display: 'inline', marginLeft: '5px' }} />
                            </button>
                        </Link>

                        <p className={styles.note}>
                            {t("cart.shippingNote", "Free Canada-wide shipping on orders over $150. Taxes & exact delivery calculated at checkout.")}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

