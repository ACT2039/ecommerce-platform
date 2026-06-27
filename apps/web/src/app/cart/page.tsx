'use client';

import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, isLoading, error, updateItem, removeItem } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl max-w-md text-center">
          <p className="font-semibold">Oops! Something went wrong.</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  // Compute totals
  const subtotal = cart?.items?.reduce((acc: number, item: any) => acc + (Number(item.unitPrice || item.product?.price || 0) * item.quantity), 0) || 0;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

        {isEmpty ? (
          <div className="glass-card p-16 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-white/50 mb-6">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-300 mb-8 max-w-md">
              Looks like you haven't added anything to your cart yet. Explore our top categories to find something you'll love.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-white/10 hover:bg-white/20 rounded-xl shadow-xl transition-transform active:scale-95 text-white border border-white/20">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.items.map((item: any) => (
                <div key={item.id} className="glass-card p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start transition-all hover:border-white/30">
                  <div className="w-32 h-32 bg-black/20 rounded-2xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/150'} 
                      alt={item.product?.title}
                      className="w-full h-full object-cover p-2"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between h-full w-full">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link href={`/products/${item.product?.slug || item.product?.id}`} className="font-bold text-lg text-white hover:text-emerald-400 transition-colors line-clamp-2 pr-4">
                          {item.product?.title}
                        </Link>
                        <p className="font-black text-xl text-emerald-400">
                          ${Number(item.unitPrice || item.product?.price || 0).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-emerald-400 mt-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        {item.product?.inventory?.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border border-white/20 rounded-xl bg-black/20 overflow-hidden">
                        <button 
                          onClick={() => updateItem(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-white">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.product?.inventory?.quantity || 0)}
                          className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-white p-2 rounded-xl hover:bg-red-500 transition-colors flex items-center gap-2 text-sm font-bold shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="glass-card p-8 sticky top-24">
                <h2 className="text-2xl font-black text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 text-sm text-gray-300 border-b border-white/20 pb-6 mb-6">
                  <div className="flex justify-between font-medium">
                    <span>Subtotal ({cart.items.reduce((acc: number, i: any) => acc + i.quantity, 0)} items)</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Shipping estimate</span>
                    <span className="text-white">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Tax estimate (8%)</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-base font-bold text-white">Estimated Total</span>
                  <span className="text-3xl font-black text-emerald-400">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <Link href="/checkout">
                  <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-500 h-14 text-lg font-bold rounded-xl shadow-xl shadow-emerald-900/20 text-white transition-transform active:scale-95 border border-emerald-400/50">
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <span className="w-4 h-4">🔒</span>
                  Secure Checkout Guaranteed
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
