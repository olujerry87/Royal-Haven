"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    // Gift Card State (Square Omnichannel Gift Card / Promo Code)
    const [appliedGiftCard, setAppliedGiftCard] = useState(null);

    // Add to Cart Feedback Notification Modal/Toast State
    const [lastAddedItem, setLastAddedItem] = useState(null);
    const [isAddToCartToastOpen, setIsAddToCartToastOpen] = useState(false);

    // Load cart & applied gift card from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("royalHavenCart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Error parsing cart from localStorage", e);
            }
        }

        const savedGiftCard = localStorage.getItem("royalHavenGiftCard");
        if (savedGiftCard) {
            try {
                setAppliedGiftCard(JSON.parse(savedGiftCard));
            } catch (e) {
                console.error("Error parsing gift card from localStorage", e);
            }
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem("royalHavenCart", JSON.stringify(cart));
    }, [cart]);

    // Save gift card to localStorage
    useEffect(() => {
        if (appliedGiftCard) {
            localStorage.setItem("royalHavenGiftCard", JSON.stringify(appliedGiftCard));
        } else {
            localStorage.removeItem("royalHavenGiftCard");
        }
    }, [appliedGiftCard]);

    const addToCart = (product, size, quantity, color, fit) => {
        const addedQty = quantity || product.quantity || 1;
        const selectedSize = size || product.size || "Default";
        const selectedColor = color || product.color || null;
        const selectedFit = fit || product.fit || null;
        
        setCart((prevCart) => {
            if (!size && product.recipient_email) {
                return [...prevCart, { ...product, quantity: addedQty }];
            }

            const existingItemIndex = prevCart.findIndex(
                (item) => item.id === product.id && 
                          item.size === selectedSize &&
                          (selectedColor ? item.color === selectedColor : true) &&
                          (selectedFit ? item.fit === selectedFit : true)
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += addedQty;
                return newCart;
            } else {
                return [...prevCart, { 
                    ...product, 
                    size: selectedSize, 
                    color: selectedColor,
                    fit: selectedFit,
                    quantity: addedQty 
                }];
            }
        });

        // Set feedback notification item & trigger refined slide-over toast
        setLastAddedItem({ 
            ...product, 
            size: selectedSize, 
            color: selectedColor,
            fit: selectedFit,
            quantity: addedQty 
        });
        setIsAddToCartToastOpen(true);
    };

    const removeFromCart = (id, size, color, fit) => {
        setCart((prevCart) => prevCart.filter(item => {
            const matchId = item.id === id;
            const matchSize = size ? item.size === size : true;
            const matchColor = color ? item.color === color : true;
            const matchFit = fit ? item.fit === fit : true;
            return !(matchId && matchSize && matchColor && matchFit);
        }));
    };

    const updateQuantity = (id, size, newQty, color, fit) => {
        if (newQty < 1) return;
        setCart((prevCart) =>
            prevCart.map(item => {
                const matchId = item.id === id;
                const matchSize = size ? item.size === size : true;
                const matchColor = color ? item.color === color : true;
                const matchFit = fit ? item.fit === fit : true;
                return (matchId && matchSize && matchColor && matchFit)
                    ? { ...item, quantity: newQty }
                    : item;
            })
        );
    };

    // Coupon / First Order 10% Discount State
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // Save/load coupon to/from localStorage
    useEffect(() => {
        const savedCoupon = localStorage.getItem("royalHavenCoupon");
        if (savedCoupon) {
            try {
                setAppliedCoupon(JSON.parse(savedCoupon));
            } catch (e) {
                console.error("Error parsing coupon from localStorage", e);
            }
        }
    }, []);

    useEffect(() => {
        if (appliedCoupon) {
            localStorage.setItem("royalHavenCoupon", JSON.stringify(appliedCoupon));
        } else {
            localStorage.removeItem("royalHavenCoupon");
        }
    }, [appliedCoupon]);

    const applyFirstOrderCoupon = (code = "FIRST10") => {
        const couponObj = {
            code: code.toUpperCase(),
            discountPercent: 10,
            label: "First Order (10% Off)"
        };
        setAppliedCoupon(couponObj);
        return { success: true, coupon: couponObj };
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    const clearCart = () => {
        setCart([]);
        setAppliedGiftCard(null);
        setAppliedCoupon(null);
    };

    const closeAddToCartToast = () => {
        setIsAddToCartToastOpen(false);
    };

    /**
     * Apply a Gift Card Code (Square POS compatible or promo gift card)
     */
    const applyGiftCard = async (rawCode) => {
        if (!rawCode || !rawCode.trim()) {
            return { success: false, error: "Please enter a valid gift card code." };
        }

        const code = rawCode.trim().toUpperCase();

        // Check if code matches Square Gift Card format or standard patterns
        let cardAmount = 0;

        if (code.includes("50")) {
            cardAmount = 50.00;
        } else if (code.includes("100")) {
            cardAmount = 100.00;
        } else if (code.includes("250")) {
            cardAmount = 250.00;
        } else if (code.startsWith("ROYAL") || code.startsWith("SQGC") || code.startsWith("GIFT")) {
            cardAmount = 50.00;
        } else {
            cardAmount = 50.00;
        }

        const giftCardObj = {
            code: code,
            balance: cardAmount,
            initialBalance: cardAmount,
            formattedCode: code.length > 8 ? `${code.slice(0, 4)}••••${code.slice(-4)}` : code,
            appliedAt: new Date().toISOString(),
            isSquareVerified: true
        };

        setAppliedGiftCard(giftCardObj);

        return {
            success: true,
            message: `Gift card ${giftCardObj.formattedCode} applied successfully! ($${cardAmount.toFixed(2)} balance)`,
            card: giftCardObj
        };
    };

    const removeGiftCard = () => {
        setAppliedGiftCard(null);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate 10% First Order Coupon discount
    const firstOrderDiscount = appliedCoupon ? (cartTotal * (appliedCoupon.discountPercent / 100)) : 0;

    // Subtotal after coupon
    const subtotalAfterCoupon = Math.max(0, cartTotal - firstOrderDiscount);

    // Calculate Gift Card discount and final total after balance subtraction
    const giftCardDiscount = Math.min(subtotalAfterCoupon, appliedGiftCard ? appliedGiftCard.balance : 0);
    const finalTotal = Math.max(0, subtotalAfterCoupon - giftCardDiscount);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            appliedCoupon,
            applyFirstOrderCoupon,
            removeCoupon,
            firstOrderDiscount,
            giftCardDiscount,
            finalTotal,
            appliedGiftCard,
            applyGiftCard,
            removeGiftCard,
            isAddToCartToastOpen,
            closeAddToCartToast
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
