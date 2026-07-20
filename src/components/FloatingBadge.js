"use client";

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import styles from './FloatingBadge.module.css';

export default function FloatingBadge() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className={styles.badgeWrapper}>
            <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>
                10% Off — First Order
            </Link>
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
