'use client';

import React from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';

export default function WishlistPage() {
  const { wishlist, isLoading, error, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-white/20 pb-5 mb-8">
        <h3 className="text-2xl font-bold leading-6 text-white">Your Wishlist</h3>
      </div>

      {error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-4 mb-8">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-200">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : !wishlist || wishlist.items.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-white">No items in wishlist</h3>
          <p className="mt-1 text-sm text-gray-300">Explore products and add them to your wishlist to save them for later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {wishlist.items.map((item: any) => (
            <div key={item.id} className="group relative border border-white/10 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow glass-card">
              <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-black/20 lg:aspect-none lg:h-64">
                <img
                  src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/300'}
                  alt={item.product?.title}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full group-hover:opacity-75 transition-opacity"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-white font-medium">
                    <a href={`/products/${item.product?.slug}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {item.product?.title}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">{item.product?.inventory?.quantity > 0 ? 'In Stock' : 'Out of Stock'}</p>
                </div>
                <p className="text-sm font-medium text-emerald-400">${Number(item.product?.price).toFixed(2)}</p>
              </div>
              <div className="mt-6 flex flex-col gap-2 relative z-10">
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await addToCart(item.productId, 1);
                    } catch (err) {
                      console.error('Failed to add to cart:', err);
                    }
                  }}
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent triggering the link
                    removeItem(item.productId);
                  }}
                  className="w-full flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-gray-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
