'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import apiClient from '@/lib/api';
import { Zap } from 'lucide-react';

export default function DealsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await apiClient.get('/api/products');
        const allProducts = response.data?.data?.products || [];
        // Filter for products that have a compareAtPrice greater than price
        const deals = allProducts.filter((p: any) => p.compareAtPrice && Number(p.compareAtPrice) > Number(p.price));
        setProducts(deals);
      } catch (err) {
        console.error('Failed to fetch deals:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeals();
  }, []);

  return (
    <div className="min-h-screen py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-6 border border-emerald-400/30">
            <Zap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Today's <span className="text-emerald-400">Deals</span></h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover incredible savings on premium curated items. These limited-time offers won't last long!
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#FDFBF7] rounded-3xl border border-gray-200 shadow-sm">
            <p className="text-xl font-bold text-gray-900">No deals available right now.</p>
            <p className="text-gray-500 mt-2">Check back later for exciting new discounts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
