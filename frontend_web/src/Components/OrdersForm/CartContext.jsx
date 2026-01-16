import React, { createContext, useState, useContext } from "react";

// Create a Context
const CartContext = createContext();

// Custom hook for easier usage
export const useCart = () => useContext(CartContext);

// CartProvider component that wraps your app
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Add item to cart
    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.product_id === item.product_id);
            if (existingItem) {
                // Increase quantity if already in cart
                return prevItems.map((i) =>
                    i.product_id === item.product_id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            } else {
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (product_id) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.product_id !== product_id)
        );
    };

    // Clear cart
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
