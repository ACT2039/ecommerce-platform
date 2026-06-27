'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="glass-nav text-gray-300 pt-12 pb-8 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-white font-bold mb-4">Get to Know Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/careers" className="hover:underline">Careers</Link></li>
              <li><Link href="/press" className="hover:underline">Press Releases</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Make Money with Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sell" className="hover:underline">Sell on Platform</Link></li>
              <li><Link href="/affiliate" className="hover:underline">Become an Affiliate</Link></li>
              <li><Link href="/advertise" className="hover:underline">Advertise Your Products</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Payment Products</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/rewards" className="hover:underline">Rewards Visa Signature Cards</Link></li>
              <li><Link href="/points" className="hover:underline">Shop with Points</Link></li>
              <li><Link href="/reload" className="hover:underline">Reload Your Balance</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Let Us Help You</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/account" className="hover:underline">Your Account</Link></li>
              <li><Link href="/orders" className="hover:underline">Your Orders</Link></li>
              <li><Link href="/shipping" className="hover:underline">Shipping Rates & Policies</Link></li>
              <li><Link href="/returns" className="hover:underline">Returns & Replacements</Link></li>
              <li><Link href="/help" className="hover:underline">Help</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-4 md:mb-0">
            <span className="text-2xl font-black tracking-tighter text-white font-serif italic">City<span className="text-emerald-500">Cart</span></span>
          </div>
          <div className="flex gap-6">
            <Link href="/conditions" className="hover:underline">Conditions of Use</Link>
            <Link href="/privacy" className="hover:underline">Privacy Notice</Link>
            <Link href="/ads" className="hover:underline">Interest-Based Ads</Link>
          </div>
          <p className="mt-4 md:mt-0">© 2026, CityCart Inc. or its affiliates</p>
        </div>
      </div>
    </footer>
  );
}
