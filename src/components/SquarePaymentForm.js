"use client";

import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import styles from "./SquarePaymentForm.module.css";
import { ShieldCheck, CreditCard, AlertCircle } from "lucide-react";

/**
 * SquarePaymentForm — Official Square Web Payments SDK Component
 * 
 * Mounts secure card fields inside #card-container using Square Web Payments SDK.
 * Exposes a `tokenize()` method via ref to generate a single-use payment token.
 */
const SquarePaymentForm = forwardRef(function SquarePaymentForm({ onTokenSuccess, onError }, ref) {
    const [cardInstance, setCardInstance] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [sdkError, setSdkError] = useState(null);

    const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID || "";
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "";
    const envMode = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || "sandbox"; // 'sandbox' or 'production'

    const scriptUrl = envMode === "production"
        ? "https://web.squarecdn.com/v1/square.js"
        : "https://sandbox.web.squarecdn.com/v1/square.js";

    useEffect(() => {
        let isMounted = true;

        if (!appId || !locationId) {
            setSdkError("Square Application ID or Location ID environment variables are not configured yet.");
            return;
        }

        async function initializeSquare() {
            try {
                // 1. Dynamically load Square script if not present
                if (!window.Square) {
                    await new Promise((resolve, reject) => {
                        const existingScript = document.getElementById("square-sdk-script");
                        if (existingScript) {
                            existingScript.addEventListener("load", resolve);
                            existingScript.addEventListener("error", reject);
                            return;
                        }
                        const script = document.createElement("script");
                        script.id = "square-sdk-script";
                        script.src = scriptUrl;
                        script.onload = resolve;
                        script.onerror = () => reject(new Error("Failed to load Square Web Payments SDK."));
                        document.body.appendChild(script);
                    });
                }

                if (!window.Square) {
                    throw new Error("Square Web Payments SDK unavailable.");
                }

                // 2. Initialize Payments
                const payments = window.Square.payments(appId, locationId);
                const card = await payments.card({
                    style: {
                        ".input-container": {
                            borderColor: "#E5E5E5",
                            borderRadius: "4px",
                        },
                        ".input-container.is-focus": {
                            borderColor: "#D4AF37",
                        },
                        "input": {
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: "14px",
                            color: "#0B0B0B",
                        },
                        "input::placeholder": {
                            color: "#999999",
                        }
                    }
                });

                if (isMounted) {
                    await card.attach("#card-container");
                    setCardInstance(card);
                    setIsLoaded(true);
                }
            } catch (err) {
                console.error("[SquarePaymentForm] Initialization error:", err);
                if (isMounted) {
                    setSdkError(err.message || "Failed to load Square payment container.");
                    if (onError) onError(err.message);
                }
            }
        }

        initializeSquare();

        return () => {
            isMounted = false;
            if (cardInstance) {
                try { cardInstance.destroy(); } catch (e) { /* ignore cleanup error */ }
            }
        };
    }, [appId, locationId, scriptUrl]);

    // Expose tokenize method to parent component via ref
    useImperativeHandle(ref, () => ({
        async tokenize() {
            if (!cardInstance) {
                throw new Error("Square payment form is not fully loaded. Please wait a moment and try again.");
            }

            const result = await cardInstance.tokenize();

            if (result.status === "OK") {
                return result.token; // Single-use payment token (nonce)
            } else {
                let errorMessage = "Credit card validation failed.";
                if (result.errors && result.errors.length > 0) {
                    errorMessage = result.errors.map(e => e.message).join(" ");
                }
                throw new Error(errorMessage);
            }
        },
        isReady() {
            return isLoaded && !!cardInstance;
        }
    }));

    if (sdkError) {
        return (
            <div className={styles.noticeContainer}>
                <div className={styles.noticeHeader}>
                    <AlertCircle size={18} className={styles.noticeIcon} />
                    <span>Square Payment Configuration Notice</span>
                </div>
                <p className={styles.noticeText}>
                    {sdkError.includes("environment variables")
                        ? "Square API Key Notice: NEXT_PUBLIC_SQUARE_APP_ID & NEXT_PUBLIC_SQUARE_LOCATION_ID are missing in Vercel. Once added, card fields will render dynamically."
                        : sdkError}
                </p>
                <div className={styles.fallbackBox}>
                    <ShieldCheck size={16} color="var(--gold, #D4AF37)" />
                    <span>Secure 256-bit SSL encrypted order gateway</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.squareWrapper}>
            <div className={styles.squareHeader}>
                <CreditCard size={18} color="var(--gold, #D4AF37)" />
                <span className={styles.squareTitle}>Credit Card Payment</span>
                <span className={styles.sslBadge}>🔒 256-bit SSL</span>
            </div>

            {/* Official Square Card Container */}
            <div id="card-container" className={styles.cardContainer}>
                {!isLoaded && (
                    <div className={styles.loadingSpinner}>
                        Loading secure payment fields...
                    </div>
                )}
            </div>

            <p className={styles.securityFooter}>
                Card details are tokenized securely by Square and never stored on our servers.
            </p>
        </div>
    );
});

export default SquarePaymentForm;
