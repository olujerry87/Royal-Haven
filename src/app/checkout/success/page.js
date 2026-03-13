"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import styles from "./page.module.css";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        // Get order ID from URL params (passed from checkout)
        const orderIdParam = searchParams.get("orderId");
        if (orderIdParam) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOrderId(`#${orderIdParam}`);
        } else {
            // Fallback if no order ID in URL
            setOrderId(`#RH-${Math.floor(1000 + Math.random() * 9000)}`);
        }
    }, [searchParams]);

    return (
        <div className={styles.card}>
            <div className={styles.iconWrapper}>
                <CheckCircle size={64} color="var(--gold)" />
            </div>
            <h1 className={styles.title}>Thank you!</h1>
            <p className={styles.subtitle}>Your order is confirmed.</p>

            <div className={styles.details}>
                <p>Order Reference: <strong>{orderId}</strong></p>
                <p>We&apos;ve sent a receipt to your email.</p>
                <p className={styles.note}>You can view this order in your WordPress admin: WooCommerce → Orders</p>
            </div>

            <Link href="/shop" className="btn-primary" style={{ display: 'inline-block', marginTop: '2rem' }}>
                Continue Shopping
            </Link>
        </div>
    );
}

export default function Success() {
    return (
        <main className={styles.container}>
            <Suspense fallback={<div>Loading order details...</div>}>
                <SuccessContent />
            </Suspense>
        </main>
    );
}
