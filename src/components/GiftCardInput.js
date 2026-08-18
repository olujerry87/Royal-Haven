"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Gift, CheckCircle2, XCircle } from "lucide-react";
import styles from "./GiftCardInput.module.css";

export default function GiftCardInput() {
    const { appliedGiftCard, applyGiftCard, removeGiftCard } = useCart();
    const [code, setCode] = useState("");
    const [status, setStatus] = useState({ type: null, msg: "" });
    const [loading, setLoading] = useState(false);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;

        setLoading(true);
        setStatus({ type: null, msg: "" });

        const res = await applyGiftCard(code);
        setLoading(false);

        if (res.success) {
            setStatus({ type: "success", msg: res.message });
            setCode("");
        } else {
            setStatus({ type: "error", msg: res.error });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <Gift size={16} /> Gift Card & Promo Balance
            </div>

            {appliedGiftCard ? (
                <div className={styles.appliedCard}>
                    <div className={styles.appliedInfo}>
                        <CheckCircle2 size={18} color="var(--gold, #D4AF37)" />
                        <div>
                            <div className={styles.codeText}>{appliedGiftCard.formattedCode}</div>
                            <div className={styles.discountBadge}>
                                -${appliedGiftCard.balance.toFixed(2)} CAD
                            </div>
                        </div>
                    </div>
                    <button onClick={removeGiftCard} className={styles.removeBtn}>
                        Remove
                    </button>
                </div>
            ) : (
                <form onSubmit={handleApply} className={styles.formRow}>
                    <input
                        type="text"
                        placeholder="Square Gift Card Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.applyBtn} disabled={loading}>
                        {loading ? "Verifying..." : "Apply"}
                    </button>
                </form>
            )}

            {status.msg && (
                <div className={`${styles.message} ${status.type === "success" ? styles.successMsg : styles.errorMsg}`}>
                    {status.msg}
                </div>
            )}

            <p className={styles.note}>
                Square Gift Cards purchased online can be redeemed at checkout or scanned in-person at physical pop-up store terminals.
            </p>
        </div>
    );
}
