"use client";

import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import styles from "./SquarePaymentForm.module.css";
import { CreditCard, AlertCircle } from "lucide-react";

/**
 * SquarePaymentForm — Official Square Web Payments SDK Component
 * 
 * Mounts secure credit card fields directly into #card-container using the Square Web Payments SDK.
 * Exposes a `tokenize()` method via ref to generate a single-use payment token.
 */
const SquarePaymentForm = forwardRef(function SquarePaymentForm({ onError }, ref) {
    const [cardInstance, setCardInstance] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [sdkError, setSdkError] = useState(null);

    // Read environment variables with sandbox fallback if not yet set
    const appId = (process.env.NEXT_PUBLIC_SQUARE_APP_ID || process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || "").trim() || "sandbox-sq0idb-SampleAppIdForSquareWebPayments";
    const locationId = (process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "").trim() || "L1234567890";
    const envMode = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || "sandbox";

    const scriptUrl = envMode === "production"
        ? "https://web.squarecdn.com/v1/square.js"
        : "https://sandbox.web.squarecdn.com/v1/square.js";

    useEffect(() => {
        let isMounted = true;

        async function initializeSquare() {
            try {
                // 1. Dynamically load Square SDK script
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
                        script.onerror = () => reject(new Error("Failed to load Square Web Payments SDK script."));
                        document.body.appendChild(script);
                    });
                }

                if (!window.Square) {
                    throw new Error("Square Web Payments SDK unavailable.");
                }

                // 2. Initialize Payments & Card element
                const payments = window.Square.payments(appId, locationId);
                const card = await payments.card({
                    style: {
                        ".input-container": {
                            borderColor: "#E5E5E5",
                            borderRadius: "6px",
                            backgroundColor: "#FFFFFF",
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
                    setSdkError(null);
                }
            } catch (err) {
                console.error("[SquarePaymentForm] Initialization error:", err);
                if (isMounted) {
                    setSdkError(err.message || "Failed to load payment fields.");
                    if (onError) onError(err.message);
                }
            }
        }

        initializeSquare();

        return () => {
            isMounted = false;
            if (cardInstance) {
                try { cardInstance.destroy(); } catch (e) { /* ignore cleanup */ }
            }
        };
    }, [appId, locationId, scriptUrl]);

    // Expose `tokenize()` method to parent form via ref
    useImperativeHandle(ref, () => ({
        async tokenize() {
            if (!cardInstance) {
                throw new Error("Square credit card form is not loaded. Please wait for card fields to render.");
            }

            const result = await cardInstance.tokenize();

            if (result.status === "OK" && result.token) {
                return result.token; // Valid single-use payment token (nonce)
            } else {
                let errorMessage = "Credit card authorization failed. Please check your card details.";
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

    return (
        <div className={styles.squareWrapper}>
            <div className={styles.squareHeader}>
                <CreditCard size={18} color="var(--gold, #D4AF37)" />
                <span className={styles.squareTitle}>Credit Card Payment (Square)</span>
                <span className={styles.sslBadge}>🔒 256-bit SSL</span>
            </div>

            {sdkError && (
                <div className={styles.errorBanner}>
                    <AlertCircle size={16} />
                    <span>{sdkError}</span>
                </div>
            )}

            {/* Official Square Card Container — ALWAYS rendered in DOM */}
            <div id="card-container" className={styles.cardContainer}>
                {!isLoaded && !sdkError && (
                    <div className={styles.loadingSpinner}>
                        Loading secure credit card fields...
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
