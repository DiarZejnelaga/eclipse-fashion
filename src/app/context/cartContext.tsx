// app/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { Product } from '../data/products';

export interface CartContextItem extends Product {
  cartItemId: string;
  quantity: number;
  selectedSize: string | null;
  selectedColorHex: string | null;
  selectedImageUrl: string;
}

interface CartContextType {
  isCartOpen: boolean;
  cartItems: CartContextItem[];
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    product: Product,
    quantity: number,
    selectedSize: string | null,
    selectedColorHex: string | null,
    selectedImageUrl: string
  ) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  cartItemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartContextItem[]>([]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('fascoShoppingCart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('fascoShoppingCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cartItems]);


  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const generateCartItemId = (productId: number, size: string | null, colorHex: string | null): string => {
    return `${productId}-${size || 'nosize'}-${colorHex || 'nocolor'}`;
  };

  const addToCart = useCallback(
    (
      productToAdd: Product,
      quantity: number,
      selectedSize: string | null,
      selectedColorHex: string | null,
      selectedImageUrl: string
    ) => {
      const cartItemId = generateCartItemId(productToAdd.id, selectedSize, selectedColorHex);

      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.cartItemId === cartItemId);

        if (existingItemIndex > -1) {
          const updatedItems = prevItems.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          return updatedItems;
        } else {
          const newCartItem: CartContextItem = {
            ...productToAdd,
            cartItemId,
            quantity,
            selectedSize,
            selectedColorHex,
            selectedImageUrl,
          };
          return [...prevItems, newCartItem];
        }
      });
      openCart();
    },
    [openCart]
  );

  const updateQuantity = useCallback(
    (cartItemId: string, newQuantity: number) => {
      setCartItems(prevItems =>
        prevItems
          .map(item =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: Math.max(0, newQuantity) }
              : item
          )
          .filter(item => item.quantity > 0)
      );
    },
    []
  );

  const removeItem = useCallback(
    (cartItemId: string) => {
      setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
    },
    []
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        cartItems,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartItemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};