'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Lock, CreditCard } from 'lucide-react';
import apiClient from '@/lib/api';
import { checkoutSchema, type CheckoutFormData } from '@/schemas/order';
import { ZodError } from 'zod';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { cart, isLoading: isCartLoading, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingAddress: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
    },
    paymentMethod: 'CREDIT_CARD',
    billingAddress: undefined, 
  });

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Dynamic calculations
  const subtotal = cart?.items?.reduce((acc: number, item: any) => acc + (Number(item.unitPrice || item.product?.price || 0) * item.quantity), 0) || 0;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      checkoutSchema.parse(formData);

      await apiClient.post('/api/orders', {
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        billingAddress: formData.billingAddress,
      });

      await clearCart();
      router.push('/checkout/success');
    } catch (err: any) {
      if (err instanceof ZodError) {
        setError('Please fill in all required fields correctly.');
      } else {
        setError(err.response?.data?.message || err.message || 'Payment failed');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isAuthLoading || isCartLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#F4F1EA]">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push('/products')} className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-white">Secure Checkout</h1>
          <Lock className="w-6 h-6 text-emerald-400" />
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-xl">
            <p className="text-red-300 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* Shipping Address */}
              <div className="glass-card p-8 transition-all hover:border-white/30">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm border border-emerald-400/30">1</span>
                  Shipping Address
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.shippingAddress.fullName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, fullName: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/20 text-white"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      value={formData.shippingAddress.addressLine1}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, addressLine1: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/20 text-white"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={formData.shippingAddress.addressLine2 || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, addressLine2: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.shippingAddress.city}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, city: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/20 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">State / Province</label>
                    <input
                      type="text"
                      value={formData.shippingAddress.state}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, state: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/20 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">ZIP / Postal Code</label>
                    <input
                      type="text"
                      value={formData.shippingAddress.postalCode}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, postalCode: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/20 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.shippingAddress.country}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, country: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/20 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="glass-card p-8 transition-all hover:border-white/30">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm border border-emerald-400/30">2</span>
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'CREDIT_CARD' ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/20 hover:border-white/40 bg-black/20'}`}>
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="CREDIT_CARD" 
                        checked={formData.paymentMethod === 'CREDIT_CARD'} 
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: 'CREDIT_CARD' }))}
                        className="w-4 h-4 text-emerald-400 focus:ring-emerald-400"
                      />
                      <CreditCard className={`w-6 h-6 ${formData.paymentMethod === 'CREDIT_CARD' ? 'text-emerald-400' : 'text-gray-400'}`} />
                      <div>
                        <p className={`font-bold ${formData.paymentMethod === 'CREDIT_CARD' ? 'text-white' : 'text-gray-300'}`}>Credit / Debit Card</p>
                        <p className="text-sm text-gray-400">Secure encrypted payment via Stripe (Mock)</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/20 hover:border-white/40 bg-black/20'}`}>
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="CASH_ON_DELIVERY" 
                        checked={formData.paymentMethod === 'CASH_ON_DELIVERY'} 
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: 'CASH_ON_DELIVERY' as any }))}
                        className="w-4 h-4 text-emerald-400 focus:ring-emerald-400"
                      />
                      <div className={`w-6 h-6 flex items-center justify-center font-bold ${formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'text-emerald-400' : 'text-gray-400'}`}>$</div>
                      <div>
                        <p className={`font-bold ${formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'text-white' : 'text-gray-300'}`}>Cash on Delivery (COD)</p>
                        <p className="text-sm text-gray-400">Pay with cash upon delivery.</p>
                      </div>
                    </div>
                  </label>

                  {/* Mock Card Details input if CREDIT_CARD is selected */}
                  {formData.paymentMethod === 'CREDIT_CARD' && (
                    <div className="mt-4 p-4 border border-white/20 rounded-xl bg-black/20 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full px-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/40 text-white" required />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-300 mb-1">Expiry (MM/YY)</label>
                          <input type="text" placeholder="12/25" maxLength={5} className="w-full px-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/40 text-white" required />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-300 mb-1">CVC</label>
                          <input type="text" placeholder="123" maxLength={4} className="w-full px-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/40 text-white" required />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </form>
          </div>

          {/* Order Summary & Submit */}
          <div className="lg:col-span-5">
            <div className="glass-card p-8 sticky top-24">
              <h2 className="text-2xl font-black text-white mb-6">Review Order</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cart.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-black/20 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/150'} 
                        alt={item.product?.title}
                        className="w-full h-full object-cover p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white line-clamp-1">{item.product?.title}</p>
                      <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-emerald-400">
                      ${(Number(item.unitPrice || item.product?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-sm text-gray-300 border-t border-white/20 pt-6 mb-6">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Shipping</span>
                  <span className="text-white">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Estimated Tax</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8 border-t border-white/20 pt-6">
                <span className="text-lg font-bold text-white">Order Total</span>
                <span className="text-3xl font-black text-emerald-400">
                  ${total.toFixed(2)}
                </span>
              </div>

              <Button 
                type="submit" 
                form="checkout-form"
                disabled={isProcessing} 
                className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-900/20 rounded-xl text-white transition-transform active:scale-95 border border-emerald-400/50"
              >
                {isProcessing ? 'Processing Order...' : `Pay $${total.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
