"use client";

import { MessageCircle, Instagram, Share2, Download } from "lucide-react";
import styles from "./SocialShare.module.css";
import { useRef, useState } from "react";
// Since html2canvas might not be installed, we fall back to a visual representation
// that they can screenshot, or just standard links

export default function SocialShare({ garment, context = "activation" }) {
    const cardRef = useRef(null);
    const [showCard, setShowCard] = useState(false);

    // Share logic for WhatsApp
    const handleWhatsAppShare = () => {
        const url = window.location.href;
        let text = "";

        if (context === "activation") {
            text = `Just activated my unique ${garment.garment_name} from Royal Haven! Check out my style here: ${url}`;
        } else {
            text = `Exploring styling for my ${garment.garment_name} from Royal Haven. Take a look: ${url}`;
        }

        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/?text=${encodedText}`, "_blank");
    };

    return (
        <div className={styles.shareContainer}>
            <h3 className={styles.heading}>Invite the Kingdom</h3>
            
            <div className={styles.buttons}>
                <button 
                    onClick={handleWhatsAppShare}
                    className={`${styles.shareButton} ${styles.whatsapp}`}
                >
                    <MessageCircle size={18} />
                    <span>Share on WhatsApp</span>
                </button>

                <button 
                    onClick={() => setShowCard(!showCard)}
                    className={`${styles.shareButton} ${styles.instagram}`}
                >
                    <Instagram size={18} />
                    <span>Create IG Card</span>
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
