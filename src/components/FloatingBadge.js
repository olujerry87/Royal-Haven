"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { X, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import styles from './FloatingBadge.module.css';

export default function FloatingBadge() {
    const [isVisible, setIsVisible] = useState(true);
    const [activated, setActivated] = useState(false);
    const { applyFirstOrderCoupon, appliedCoupon } = useCart();
    const { t } = useLanguage();
    const pathname = usePathname();

    // Do not show floating badge on checkout or order confirmation pages
    if (!isVisible || pathname?.startsWith('/checkout')) return null;

    const isApplied = activated || !!appliedCoupon;

    const handleActivate = () => {
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
                        <span>{t('coupon.firstOrderApplied', '10% Off First Order Applied!')}</span>
                    </>
                ) : (
                    <span>{t('coupon.firstOrderBadge', '10% Off — First Order')}</span>
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
