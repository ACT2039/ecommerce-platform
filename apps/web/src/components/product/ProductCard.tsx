'use client';

import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    toast.success('Added to Cart', {
      description: `${product.title} was added to your cart.`,
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product.id);
    toast.success('Added to Wishlist', {
      description: `${product.title} was saved to your wishlist.`,
    });
  };

  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/300';
  const outOfStock = product.inventory?.quantity === 0;

  return (
    <Link href={`/products/${product.slug || product.id}`} className="group relative flex flex-col glass-card overflow-hidden hover:-translate-y-1 transition-all duration-300">
      
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/10">
        <img 
          src={imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {outOfStock && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Quick Actions (Hover) */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={handleAddToWishlist}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-50 shadow-md transition-colors"
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <div className="mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-xs font-semibold text-blue-300 uppercase tracking-wider">
            {product.category?.name || 'Category'}
          </span>
        </div>
        <h3 className="text-white font-semibold text-sm sm:text-lg line-clamp-2 leading-tight mb-2 flex-1">
          {product.title}
        </h3>
        
        <div className="mt-auto flex items-end justify-between pt-2 sm:pt-4 gap-1 sm:gap-2">
          <div className="flex-1">
            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
              <p className="text-xs sm:text-sm text-gray-300 line-through mb-0.5 sm:mb-1">
                ${Number(product.compareAtPrice).toFixed(2)}
              </p>
            )}
            <p className="text-base sm:text-xl font-bold text-white">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!outOfStock) {
                addToCart(product.id, 1);
                window.location.href = '/checkout';
              }
            }}
            disabled={outOfStock}
            className={`hidden sm:flex px-3 h-10 rounded-xl text-sm font-bold items-center justify-center shadow-sm transition-transform active:scale-95
              ${outOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#E5E0D8] text-gray-800 hover:bg-[#D5CFC4]'}
            `}
          >
            Buy Now
          </button>

          <button 
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md transition-transform active:scale-95 flex-shrink-0
              ${outOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-gray-900/25'}
            `}
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
