"use client";

import Link from "next/link";
import { Sparkles, CheckCircle2, ShoppingBag, Calendar, Mail } from "lucide-react";
import styles from "./page.module.css";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

function SuccessContent() {
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const [orderId, setOrderId] = useState("");
    const [buyerName, setBuyerName] = useState("");

    useEffect(() => {
        const orderIdParam = searchParams.get("orderId");
        const nameParam = searchParams.get("name") || searchParams.get("firstName");

        if (orderIdParam) {
            setOrderId(`#${orderIdParam}`);
        } else {
            setOrderId(`#RH-${Math.floor(1000 + Math.random() * 9000)}`);
        }

        if (nameParam && nameParam.trim()) {
            setBuyerName(nameParam.trim());
        }
    }, [searchParams]);

    const greeting = buyerName 
        ? t("success.titlePersonalized", `Thank You, ${buyerName}! 👑✨`).replace("{name}", buyerName)
        : t("success.title", "Thank You! 👑✨");

    return (
        <div className={styles.card}>
            <div className={styles.iconWrapper}>
                <div className={styles.iconHalo}>
                    <CheckCircle2 size={48} color="var(--gold, #D4AF37)" />
                </div>
            </div>

            <span className={styles.badge}>Order Confirmed 🥂</span>
            <h1 className={styles.title}>{greeting}</h1>
            <p className={styles.subtitle}>
                {t("success.subtitle", "Your royal handcrafted order is officially confirmed.")}
            </p>

            <div className={styles.orderPill}>
                <span className={styles.orderLabel}>{t("success.orderReference", "Order Reference")}</span>
                <strong className={styles.orderNumber}>{orderId}</strong>
            </div>

            <div className={styles.details}>
                <div className={styles.detailRow}>
                    <Mail size={18} color="var(--gold, #D4AF37)" className={styles.detailIcon} />
                    <p>{t("success.receiptNotice", "A detailed receipt and order confirmation have been sent to your email.")}</p>
                </div>
                <div className={styles.detailRow}>
                    <Sparkles size={18} color="var(--gold, #D4AF37)" className={styles.detailIcon} />
                    <p>{t("success.careMessage", "Each piece is intentionally designed and handcrafted with royal care. We are preparing your order now.")}</p>
                </div>
            </div>

            <div className={styles.conciergeNote}>
                <p>
                    {t("success.supportNotice", "Questions about tailoring or delivery? Reach our concierge anytime at")}{" "}
                    <a href="mailto:royalhaven@bezaleelgroup.ca" className={styles.conciergeLink}>
                        royalhaven@bezaleelgroup.ca
                    </a>
                </p>
            </div>

            <div className={styles.ctaGroup}>
                <Link href="/shop" className={styles.primaryBtn}>
                    <ShoppingBag size={18} /> {t("success.continueShopping", "Continue Shopping")}
                </Link>
                <Link href="/services/book" className={styles.secondaryBtn}>
                    <Calendar size={18} /> Book Custom Fitting ↗
                </Link>
            </div>
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
