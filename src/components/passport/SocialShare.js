"use client";

import { MessageCircle, Instagram, Share2, Download } from "lucide-react";
import styles from "./SocialShare.module.css";
import { useRef, useState } from "react";
// Since html2canvas might not be installed, we fall back to a visual representation
// that they can screenshot, or just standard links

export default function SocialShare({ garment, context = "activation" }) {
    const cardRef = useRef(null);
    const [showCard, setShowCard] = useState(false);

    // Native Web Share API (Best for Instagram/OS Share Sheets)
    const handleNativeShare = async () => {
        const url = window.location.href;
        const text = `Just secured my ${garment.garment_name} from Royal Haven! Check out my style:`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Royal Haven Fit Check',
                    text: text,
                    url: url
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        } else {
            // Fallback to WhatsApp if Web Share API is not supported (e.g. some desktop browsers)
            const encodedText = encodeURIComponent(text + " " + url);
            window.open(`https://wa.me/?text=${encodedText}`, "_blank");
        }
    };

    return (
        <div className={styles.shareContainer}>
            <h3 className={styles.heading}>Fit Check</h3>
            
            <div className={styles.buttons}>
                <button 
                    onClick={handleNativeShare}
                    className={`${styles.shareButton} ${styles.instagram}`}
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    <Share2 size={18} />
                    <span>Share Look (IG, WhatsApp, etc)</span>
                </button>
            </div>

            {showCard && (
                <div className={styles.igCardWrapper}>
                    <p className={styles.helperText}>Screenshot to share on Instagram Stories</p>
                    
                    {/* The Visual Card for Instagram */}
                    <div className={styles.igCard} ref={cardRef}>
                        <div className={styles.cardHeader}>
                            <h4 className={styles.brand}>ROYAL HAVEN</h4>
                            <div className={styles.verifiedBadge}>
                                <Share2 size={12} />
                                <span>Verified Owner</span>
                            </div>
                        </div>
                        
                        <div className={styles.cardBody}>
                            <h5>{garment.garment_name}</h5>
                            {garment.collection && <p className={styles.collection}>{garment.collection} Collection</p>}
                        </div>

                        <div className={styles.cardFooter}>
                            <div className={styles.qrMock}></div>
                            <p className={styles.id}>ID: {garment.id.substring(0, 8).toUpperCase()}</p>
                        </div>
                        
                        <div className={styles.cardGlow}></div>
                    </div>
                </div>
            )}
        </div>
    );
}
