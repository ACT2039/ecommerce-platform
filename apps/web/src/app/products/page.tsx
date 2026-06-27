'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const { get, loading } = useApi();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('latest');

  const searchQuery = searchParams.get('search');
  const categoryQuery = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      let url = '/api/products?limit=20';
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (categoryQuery) url += `&category=${encodeURIComponent(categoryQuery)}`;

      const res = await get(url);
      if (res?.data?.products) {
        setProducts(res.data.products);
      }
    };
    fetchProducts();
  }, [get, searchQuery, categoryQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            {searchQuery ? `Search Results for "${searchQuery}"` : categoryQuery ? `${categoryQuery.charAt(0).toUpperCase() + categoryQuery.slice(1)}` : 'All Products'}
          </h1>
          <p className="text-gray-300 mt-2 text-lg">
            {searchQuery ? 'Showing products matching your search.' : 'Browse our complete collection of premium items.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-white/20 rounded-xl px-4 py-2.5 bg-black/40 backdrop-blur-md text-white outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition-all cursor-pointer"
          >
            <option value="latest" className="bg-gray-900">Latest Arrivals</option>
            <option value="price-asc" className="bg-gray-900">Price: Low to High</option>
            <option value="price-desc" className="bg-gray-900">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-4">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-4 w-1/4 rounded" />
              <Skeleton className="h-6 w-3/4 rounded" />
            </div>
          ))
        ) : products.length > 0 ? (
          [...products].sort((a, b) => {
            if (sortOrder === 'price-asc') return Number(a.price) - Number(b.price);
            if (sortOrder === 'price-desc') return Number(b.price) - Number(a.price);
            return 0; // 'latest' - default order
          }).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Check back later for new arrivals.</p>
          </div>
        )}
      </div>
    </div>
  );
}
