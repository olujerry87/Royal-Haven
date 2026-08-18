"use client";

import { useState } from 'react';
import Link from 'next/link';
import { X, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './FloatingBadge.module.css';

export default function FloatingBadge() {
    const [isVisible, setIsVisible] = useState(true);
    const [activated, setActivated] = useState(false);
    const { applyFirstOrderCoupon, appliedCoupon } = useCart();

    if (!isVisible) return null;

    const isApplied = activated || !!appliedCoupon;

    const handleActivate = (e) => {
        applyFirstOrderCoupon("FIRST10");
        setActivated(true);
    };

    return (
        <div className={`${styles.badgeWrapper} ${isApplied ? styles.activatedBadge : ''}`}>
            <button 
                onClick={handleActivate}
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'inherit', 
                    cursor: 'pointer', 
                    font: 'inherit', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem',
                    padding: 0
                }}
            >
                {isApplied ? (
                    <>
                        <CheckCircle2 size={14} color="var(--gold, #D4AF37)" />
                        <span>10% Off First Order Applied!</span>
                    </>
                ) : (
                    <span>10% Off — First Order</span>
                )}
            </button>
            <button 
                className={styles.closeBtn} 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsVisible(false);
                }}
                aria-label="Close badge"
            >
                <X size={14} />
            </button>
        </div>
    );
}
