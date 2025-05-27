// app/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
// Ensure this path is correct and these types are exported from your products data file
import { Product, ProductImage, productsData as allProductsFromSource } from '../data/products';

// Define the shape of an item in the cart, extending Product
export interface CartContextItem extends Product {
  cartItemId: string; // Unique ID for this specific cart entry
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
    product: Product, // Pass the full Product object from the Product Detail Page
    quantity: number,
    selectedSize: string | null,
    selectedColorHex: string | null,
    selectedImageUrl: string // Explicitly pass the selected image URL
  ) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void; // Added for completeness
  cartItemCount: number; // Total quantity of all items
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartContextItem[]>([]);

  // Load cart from localStorage on initial mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('fascoShoppingCart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      // Optionally clear corrupted cart data
      // localStorage.removeItem('fascoShoppingCart');
    }
  }, []);

  // Save cart to localStorage whenever it changes
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
      productToAdd: Product, // The product object being added
      quantity: number,
      selectedSize: string | null,
      selectedColorHex: string | null,
      selectedImageUrl: string // Must be provided
    ) => {
      const cartItemId = generateCartItemId(productToAdd.id, selectedSize, selectedColorHex);

      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.cartItemId === cartItemId);

        if (existingItemIndex > -1) {
          // Item already exists, update quantity
          const updatedItems = prevItems.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          return updatedItems;
        } else {
          // Add new item. We use productToAdd directly.
          // No need to re-fetch from allProductsFromSource if productToAdd is already complete.
          const newCartItem: CartContextItem = {
            ...productToAdd, // Spread all properties from the product object
            cartItemId,
            quantity,
            selectedSize,
            selectedColorHex,
            selectedImageUrl, // Use the image URL passed from PDP
          };
          return [...prevItems, newCartItem];
        }
      });
      openCart(); // Open cart when item is added
    },
    [openCart]
  );

  const updateQuantity = useCallback(
    (cartItemId: string, newQuantity: number) => {
      setCartItems(prevItems =>
        prevItems
          .map(item =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: Math.max(0, newQuantity) } // Ensure quantity doesn't go below 0
              : item
          )
          .filter(item => item.quantity > 0) // Remove item if quantity becomes 0
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