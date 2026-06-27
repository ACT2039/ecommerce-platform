'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ShoppingCart, Search, User, Menu, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Do not render Navbar on admin routes (they have their own layout)
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const cartItemsCount = cart?.items.reduce((total: number, item: any) => total + item.quantity, 0) || 0;

  return (
    <header className="glass-nav text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter text-[#F4F1EA] font-serif italic">City<span className="text-emerald-500">Cart</span></span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <form 
            className="hidden lg:flex flex-1 max-w-2xl mx-8 relative"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get('search');
              if (query) {
                window.location.href = `/products?search=${encodeURIComponent(query.toString())}`;
              }
            }}
          >
            <input 
              name="search"
              type="text" 
              placeholder="Search for products, categories..."
              className="w-full pl-4 pr-10 py-2.5 rounded-l-xl text-white bg-white/10 placeholder-gray-300 focus:outline-none border border-white/20 focus:border-emerald-400 focus:bg-white/20 transition-all backdrop-blur-md"
            />
            <button type="submit" className="bg-emerald-500/20 hover:bg-emerald-500/40 border border-l-0 border-emerald-500/30 px-5 rounded-r-xl transition-colors flex items-center justify-center backdrop-blur-md group">
              <Search className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
            </button>
          </form>

          {/* Right Navigation */}
          <div className="flex items-center gap-6">
            {/* Account / Login */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Hello, {user.name?.split(' ')[0]}</p>
                  <Link href="/profile" className="text-sm font-bold hover:text-gray-300">Account & Lists</Link>
                </div>
                {user.role === 'ADMIN' && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="hidden lg:flex border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <button onClick={logout} className="text-xs text-gray-400 hover:text-white">Sign Out</button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center">
                <Link href="/login">
                  <div className="text-right hover:text-gray-300 cursor-pointer">
                    <p className="text-xs text-gray-400">Hello, sign in</p>
                    <p className="text-sm font-bold">Account & Lists</p>
                  </div>
                </Link>
              </div>
            )}

            <Link href="/wishlist" className="relative group p-2 -m-2">
              <div className="relative">
                <Heart className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                {(wishlist?.items?.length || 0) > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-[#F4F1EA] text-gray-900 px-1.5 py-0 min-w-[20px] text-center border-none font-bold text-[10px]">
                    {wishlist.items.length}
                  </Badge>
                )}
              </div>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="flex items-center gap-2 group">
              <div className="relative">
                <ShoppingCart className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-[#F4F1EA] text-gray-900 px-1.5 py-0 min-w-[20px] text-center border-none font-bold">
                    {cartItemsCount}
                  </Badge>
                )}
              </div>
              <span className="hidden lg:block font-bold mt-2">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sub-navbar (Categories) */}
      <div className="glass text-sm hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-10 gap-6 overflow-x-auto whitespace-nowrap text-white/80">
          <Link href="/products" className="font-medium hover:text-white border-2 border-transparent hover:border-gray-600 p-1 rounded-sm">All Products</Link>
          <Link href="/products?category=electronics" className="hover:text-white p-1">Electronics</Link>
          <Link href="/products?category=mens-fashion" className="hover:text-white p-1">Clothing</Link>
          <Link href="/products?category=home-living" className="hover:text-white p-1">Home & Kitchen</Link>
          <Link href="/deals" className="text-white font-medium p-1">Today's Deals</Link>
        </div>
      </div>
    </header>
  );
}
