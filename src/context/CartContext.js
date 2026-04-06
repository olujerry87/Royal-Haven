"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("royalHavenCart");
        if (savedCart) {
            // eslint-disable-next-line
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem("royalHavenCart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, size, quantity) => {
        setCart((prevCart) => {
            // If the product object already contains everything (like a Gift Card)
            if (!size && product.recipient_email) {
                return [...prevCart, { ...product }];
            }

            // Standard product logic
            const existingItemIndex = prevCart.findIndex(
                (item) => item.id === product.id && item.size === size
            );

            if (existingItemIndex > -1) {
                // Update quantity if exists
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += (quantity || product.quantity || 1);
                return newCart;
            } else {
                // Add new item
                return [...prevCart, { ...product, size: size || product.size, quantity: quantity || product.quantity || 1 }];
            }
        });
        setIsCartOpen(true); 
    };

    const removeFromCart = (id, size) => {
        setCart((prevCart) => prevCart.filter(item => !(item.id === id && item.size === size)));
    };

    const updateQuantity = (id, size, newQty) => {
        if (newQty < 1) return;
        setCart((prevCart) =>
            prevCart.map(item =>
                (item.id === id && item.size === size)
                    ? { ...item, quantity: newQty }
                    : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
