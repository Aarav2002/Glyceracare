import React, { createContext, useContext, useState, useCallback } from 'react';

interface CartItem {
  id: number;
  name: string;
  description?: string;
  price: string;
  quantity: number;
  weight: string;
  min_quantity: number;
  deliveryDate?: string;
  deliveryCharges?: string;
  discount?: number;
  originalPrice?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, weight: string) => void;
  updateQuantity: (id: number, weight: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number; // Added this to calculate the number of items
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback(
    (item: CartItem) => {
      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (cartItem) => cartItem.id === item.id && cartItem.weight === item.weight
        );
        if (existingItem) {
          return currentItems.map((cartItem) =>
            cartItem.id === item.id && cartItem.weight === item.weight
              ? { ...cartItem, quantity: Math.max(cartItem.quantity + item.quantity, cartItem.min_quantity) }
              : cartItem
          );
        }
        return [...currentItems, { ...item }];
      });
    },
    []
  );

  const removeFromCart = useCallback((id: number, weight: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id || item.weight !== weight));
  }, []);

  const updateQuantity = useCallback((id: number, weight: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && item.weight === weight ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calculate the total item count dynamically
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
