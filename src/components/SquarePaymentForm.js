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

    // Read production/sandbox environment variables from Vercel
    const appId = (process.env.NEXT_PUBLIC_SQUARE_APP_ID || process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || "").trim();
    const locationId = (process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "").trim();
    const envMode = (process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || "production").trim().toLowerCase();

    // Use production script if environment is production or if production APP_ID is present
    const isProduction = envMode === "production" || (appId && !appId.startsWith("sandbox-"));
    const scriptUrl = isProduction
        ? "https://web.squarecdn.com/v1/square.js"
        : "https://sandbox.web.squarecdn.com/v1/square.js";

    useEffect(() => {
        let isMounted = true;

        if (!appId || !locationId) {
            console.warn("[SquarePaymentForm] Missing Square Vercel Environment Variables: NEXT_PUBLIC_SQUARE_APP_ID / NEXT_PUBLIC_SQUARE_LOCATION_ID");
        }

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

                const targetAppId = appId || "sandbox-sq0idb-SampleAppIdForSquareWebPayments";
                const targetLocationId = locationId || "L1234567890";

                // 2. Initialize Payments & Card element with strict valid CSS properties
                // REMOVED 'backgroundColor' and formatted 'fontFamily' as single generic family 'sans-serif'
                // to fix Square Web Payments SDK style validation errors.
                const payments = window.Square.payments(targetAppId, targetLocationId);
                const card = await payments.card({
                    style: {
                        ".input-container": {
                            borderColor: "#E5E5E5",
                            borderRadius: "6px",
                        },
                        ".input-container.is-focus": {
                            borderColor: "#D4AF37",
                        },
                        "input": {
                            fontFamily: "sans-serif",
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
                    setSdkError(err.message || "Failed to load Square payment fields.");
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
                throw new Error("Square credit card form is not loaded. Please verify payment fields.");
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
                <span className={styles.squareTitle}>Credit Card Payment ({isProduction ? "Live Production" : "Square"})</span>
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
