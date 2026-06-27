'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartApi } from '../lib/cart.api';

interface CartContextType {
  cart: any | null;
  isLoading: boolean;
  error: string | null;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err: any) {
      if (err.response?.status !== 401) {
        setError(err.message || 'Failed to fetch cart');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (productId: string, quantity = 1) => {
    try {
      const data = await cartApi.addItem(productId, quantity);
      setCart(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    // Optimistic UI update could be added here
    try {
      const data = await cartApi.updateItem(itemId, quantity);
      setCart(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const removeItem = async (itemId: string) => {
    // Optimistic UI
    setCart((prev: any) => ({
      ...prev,
      items: prev.items.filter((i: any) => i.id !== itemId),
    }));
    try {
      const data = await cartApi.removeItem(itemId);
      setCart(data);
    } catch (err: any) {
      fetchCart(); // Revert on failure
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const data = await cartApi.clearCart();
      setCart(data);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, error, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
