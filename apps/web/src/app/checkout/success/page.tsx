'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card p-8 text-center transform transition-all hover:scale-[1.02]">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce-slow border border-emerald-500/30 shadow-inner">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
        </div>
        
        <h2 className="text-3xl font-black text-white mb-2">Order Successful!</h2>
        <p className="text-gray-300 mb-8">
          Thank you for your purchase. We have received your order and will begin processing it right away.
        </p>

        <div className="bg-black/20 p-4 rounded-xl border border-white/10 mb-8 shadow-sm">
          <p className="text-sm font-medium text-gray-400 mb-1">Order Reference</p>
          <p className="text-lg font-bold text-white font-mono tracking-widest">
            ORD-{Math.floor(100000 + Math.random() * 900000)}
          </p>
        </div>

        <Link href="/products">
          <Button className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/50 shadow-xl shadow-emerald-900/20 rounded-xl text-white transition-transform active:scale-95">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
