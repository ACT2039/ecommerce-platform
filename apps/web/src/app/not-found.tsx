import Link from 'next/link';
import { Info } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full glass-card p-10 text-center transform transition-all hover:scale-[1.02]">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-inner">
            <Info className="w-10 h-10 text-emerald-400" />
          </div>
        </div>
        
        <h2 className="text-3xl font-black text-white mb-4">Information Hub</h2>
        <p className="text-gray-300 mb-8 text-lg">
          We are currently updating this section with the latest content, instructions, and policies. Please check back later!
        </p>

        <Link 
          href="/products"
          className="inline-block w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-lg border border-emerald-400/50"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
