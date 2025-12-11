import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, color = 'Natural Beige', fragrance = 'Lavender') => {
        setCartItems((prevItems) => {
            // Use a unique identifier combining product id, color, and fragrance
            const productId = product.id || product._id || product.name;
            const existingItem = prevItems.find((item) => 
                (item.id || item._id || item.name) === productId && 
                item.color === color && 
                item.fragrance === fragrance
            );
            
            if (existingItem) {
                return prevItems.map((item) =>
                    (item.id || item._id || item.name) === productId && 
                    item.color === color && 
                    item.fragrance === fragrance
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { 
                ...product, 
                id: productId,
                quantity: 1,
                color,
                fragrance 
            }];
        });
    };

    const removeFromCart = (productId, color, fragrance) => {
        setCartItems((prevItems) => prevItems.filter((item) => {
            const itemId = item.id || item._id || item.name;
            return !(itemId === productId && item.color === color && item.fragrance === fragrance);
        }));
    };

    const updateQuantity = (productId, quantity, color, fragrance) => {
        if (quantity < 1) {
            removeFromCart(productId, color, fragrance);
            return;
        }
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                const itemId = item.id || item._id || item.name;
                return itemId === productId && item.color === color && item.fragrance === fragrance
                    ? { ...item, quantity }
                    : item;
            })
        );
    };

    const updateColorFragrance = (productId, oldColor, oldFragrance, newColor, newFragrance) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                const itemId = item.id || item._id || item.name;
                return itemId === productId && item.color === oldColor && item.fragrance === oldFragrance
                    ? { ...item, color: newColor, fragrance: newFragrance }
                    : item;
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            // Handle both numbers (new) and strings (old legacy data)
            const rawPrice = item.price;
            const price = typeof rawPrice === 'number'
                ? rawPrice
                : parseFloat(String(rawPrice).replace(/[^0-9.]/g, "")) || 0;
            return total + price * item.quantity;
        }, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            updateColorFragrance,
            clearCart, 
            getCartTotal, 
            getCartCount 
        }}>
            {children}
        </CartContext.Provider>
    );
};
