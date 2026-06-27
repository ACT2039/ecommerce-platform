'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  const { get, loading } = useApi();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await get('/categories');
      if (res?.data) {
        setCategories(res.data);
      }
    };
    fetchCategories();
  }, [get]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Shop by Category</h1>
        <p className="text-gray-500 text-lg">Explore our curated selections organized just for you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-3xl" />
          ))
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/products?category=${category.slug}`}
              className="group relative overflow-hidden rounded-3xl aspect-[4/3] flex flex-col justify-end p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 z-0 bg-gradient-to-br ${getGradient(category.name)} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <div className="relative z-10 flex flex-col items-start">
                <span className="bg-white px-4 py-2 rounded-full font-bold text-gray-900 shadow-sm mb-2 group-hover:scale-105 transition-transform">
                  {category.name}
                </span>
                {category.description && (
                  <p className="text-gray-600 mt-2 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm text-sm line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500">Check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getGradient(name: string) {
  const gradients = [
    'from-blue-500 to-indigo-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500',
    'from-rose-500 to-red-500',
    'from-cyan-500 to-blue-500',
  ];
  // Simple hash to consistently pick a gradient based on category name
  const index = name.length % gradients.length;
  return gradients[index];
}
