'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Heart, ArrowLeft, Star, Shield, Truck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { get, loading } = useApi();
  const { addItem: addToCart } = useCart();
  const { wishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist();
  
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const inWishlist = wishlist?.items?.some((item: any) => item.productId === product?.id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await get(`/api/products/${id}`);
        if (res?.data?.product) {
          setProduct(res.data.product);
        } else {
          router.push('/not-found');
        }
      } catch (error) {
        router.push('/not-found');
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id, get, router]);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    toast.success('Added to Cart', {
      description: `${quantity}x ${product.title} was added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from Wishlist', {
        description: `${product.title} was removed from your wishlist.`,
      });
    } else {
      addToWishlist(product.id);
      toast.success('Added to Wishlist', {
        description: `${product.title} was saved to your wishlist.`,
      });
    }
  };

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8 flex-col lg:flex-row">
          <Skeleton className="w-full lg:w-1/2 h-[500px] rounded-3xl" />
          <div className="w-full lg:w-1/2 space-y-6">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-12 w-3/4 rounded-lg" />
            <Skeleton className="h-8 w-1/4 rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="flex gap-4">
              <Skeleton className="h-14 w-32 rounded-xl" />
              <Skeleton className="h-14 flex-1 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/800';
  const outOfStock = product.inventory?.quantity === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/products" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Images */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
            <img 
              src={imageUrl} 
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {outOfStock && (
              <div className="absolute top-6 left-6 bg-red-500 text-white font-bold px-4 py-2 rounded-lg shadow-md tracking-wider">
                SOLD OUT
              </div>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-4">
            <span className="inline-block bg-blue-50 text-blue-600 font-semibold px-3 py-1 rounded-full text-sm uppercase tracking-wider">
              {product.category?.name || 'Category'}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-gray-500 text-sm font-medium">(128 Reviews)</span>
          </div>

          <div className="flex items-end gap-4 mb-8">
            <div className="text-4xl font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </div>
            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
              <>
                <div className="text-xl text-gray-400 line-through mb-1">
                  ${Number(product.compareAtPrice).toFixed(2)}
                </div>
                <div className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm font-bold mb-1">
                  Save ${(Number(product.compareAtPrice) - Number(product.price)).toFixed(2)}
                </div>
              </>
            )}
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {product.description || "No description provided for this premium item."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10 pb-10 border-b border-gray-100">
            <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-2xl">
              <Shield className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">2 Year Warranty</p>
                <p className="text-xs">Full coverage</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-2xl">
              <Truck className="w-6 h-6 text-emerald-500 mr-3" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Free Shipping</p>
                <p className="text-xs">On orders over $50</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-auto">
            {/* Quantity Selector */}
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden h-14 bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                disabled={outOfStock}
              >
                -
              </button>
              <div className="w-12 h-full flex items-center justify-center font-semibold text-gray-900 border-x-2 border-gray-200">
                {quantity}
              </div>
              <button 
                onClick={() => setQuantity(Math.min(product.inventory?.quantity || 1, quantity + 1))}
                className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                disabled={outOfStock}
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <div className="flex-1 flex gap-2">
              <Button 
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex-1 h-14 text-base font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] ${
                  outOfStock ? 'bg-gray-300' : 'bg-gray-900 hover:bg-gray-800 shadow-gray-500/25 text-white'
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {outOfStock ? 'Sold Out' : 'Add to Cart'}
              </Button>

              <Button 
                onClick={() => {
                  if (!outOfStock) {
                    addToCart(product.id, quantity);
                    router.push('/checkout');
                  }
                }}
                disabled={outOfStock}
                className={`flex-1 h-14 text-base font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] ${
                  outOfStock ? 'bg-gray-300 hidden' : 'bg-gray-800 hover:bg-gray-700 shadow-gray-900/25 text-white'
                }`}
              >
                Buy Now
              </Button>
            </div>

            {/* Wishlist */}
            <button 
              onClick={handleToggleWishlist}
              className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all active:scale-[0.98] ${
                inWishlist 
                  ? 'border-red-100 bg-red-50 text-red-500' 
                  : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600'
              }`}
            >
              <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
