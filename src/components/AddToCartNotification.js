"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { CheckCircle2, ArrowRight, X } from "lucide-react";
import styles from "./AddToCartNotification.module.css";

export default function AddToCartNotification() {
    const { lastAddedItem, isAddToCartToastOpen, closeAddToCartToast } = useCart();

    // Auto-dismiss after 8 seconds
    useEffect(() => {
        if (isAddToCartToastOpen) {
            const timer = setTimeout(() => {
                closeAddToCartToast();
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [isAddToCartToastOpen, closeAddToCartToast]);

    if (!isAddToCartToastOpen || !lastAddedItem) return null;

    const imgSrc = lastAddedItem.images && lastAddedItem.images.length > 0 
        ? lastAddedItem.images[0] 
        : "/images/spotlight.jpg";

    return (
        <div className={styles.overlay}>
            <div className={styles.toastCard}>
                <button onClick={closeAddToCartToast} className={styles.closeBtn} aria-label="Close notification">
                    <X size={16} />
                </button>

                <div className={styles.header}>
                    <CheckCircle2 size={16} color="var(--gold, #D4AF37)" />
                    <span>Added to Shopping Bag</span>
                </div>

                <div className={styles.productRow}>
                    <div className={styles.imgWrapper}>
                        <img src={imgSrc} alt={lastAddedItem.name || "Product"} className={styles.image} />
                    </div>
                    <div className={styles.info}>
                        <h4 className={styles.title}>{lastAddedItem.name}</h4>
                        {lastAddedItem.size && <p className={styles.meta}>Size: {lastAddedItem.size}</p>}
                        <p className={styles.price}>${lastAddedItem.price} USD</p>
                    </div>
                </div>

                <div className={styles.actionRow}>
                    <Link 
                        href="/cart" 
                        onClick={closeAddToCartToast} 
                        className={styles.checkoutBtn}
                    >
                        Checkout <ArrowRight size={14} />
                    </Link>
                    <button 
                        onClick={closeAddToCartToast} 
                        className={styles.continueBtn}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
