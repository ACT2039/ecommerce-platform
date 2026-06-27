'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { wishlistApi } from '../lib/wishlist.api';

interface WishlistContextType {
  wishlist: any | null;
  isLoading: boolean;
  error: string | null;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const data = await wishlistApi.getWishlist();
      setWishlist(data);
    } catch (err: any) {
      if (err.response?.status !== 401) {
        setError(err.message || 'Failed to fetch wishlist');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addItem = async (productId: string) => {
    try {
      const data = await wishlistApi.addItem(productId);
      setWishlist(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  const removeItem = async (productId: string) => {
    setWishlist((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.filter((i: any) => i.productId !== productId),
      };
    });
    try {
      const data = await wishlistApi.removeItem(productId);
      setWishlist(data);
    } catch (err: any) {
      fetchWishlist();
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isLoading, error, addItem, removeItem }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
