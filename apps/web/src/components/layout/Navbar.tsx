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

        {/* Search Bar (Mobile) */}
        <form 
          className="flex lg:hidden w-full pb-3 pt-1 relative"
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
            className="w-full pl-4 pr-10 py-2.5 rounded-l-xl text-white bg-white/10 placeholder-gray-300 focus:outline-none border border-white/20 focus:border-emerald-400 focus:bg-white/20 transition-all backdrop-blur-md text-sm"
          />
          <button type="submit" className="bg-emerald-500/20 hover:bg-emerald-500/40 border border-l-0 border-emerald-500/30 px-5 rounded-r-xl transition-colors flex items-center justify-center backdrop-blur-md group">
            <Search className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
          </button>
        </form>
      </div>

      {/* Sub-navbar (Categories) */}
      <div className="glass text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-12 gap-6 overflow-x-auto whitespace-nowrap text-white/80 scrollbar-hide">
          <Link href="/products" className="font-medium hover:text-white border-b-2 border-transparent hover:border-gray-400 py-1 transition-colors">All Products</Link>
          <Link href="/products?category=electronics" className="hover:text-white py-1">Electronics</Link>
          <Link href="/products?category=mens-fashion" className="hover:text-white py-1">Clothing</Link>
          <Link href="/products?category=home-living" className="hover:text-white py-1">Home & Kitchen</Link>
          <Link href="/deals" className="text-emerald-400 font-bold py-1">Today's Deals</Link>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity" 
          onClick={() => setIsMenuOpen(false)} 
        />
      )}

      {/* Mobile Menu Drawer (Sidebar) */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[80vw] max-w-sm bg-gray-900 border-r border-white/10 shadow-2xl p-6 flex flex-col gap-6 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Close button and Logo inside sidebar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <span className="text-2xl font-black tracking-tighter text-[#F4F1EA] font-serif italic">City<span className="text-emerald-500">Cart</span></span>
          </Link>
          <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Section */}
        <div className="flex flex-col gap-4 py-2 border-b border-white/10">
          <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold">My Account</h3>
          {user ? (
            <>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="bg-emerald-500/20 p-2 rounded-full">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="font-bold text-white leading-tight">{user.name}</p>
                </div>
              </div>
              <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white py-1.5 flex items-center gap-2">Account & Lists</Link>
              <Link href="/profile?tab=orders" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white py-1.5 flex items-center gap-2">My Orders</Link>
              <Link href="/profile?tab=addresses" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white py-1.5 flex items-center gap-2">My Addresses</Link>
              {user.role === 'ADMIN' && (
                <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-emerald-400 hover:text-emerald-300 py-1.5 font-bold flex items-center gap-2">Admin Dashboard</Link>
              )}
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-gray-400 hover:text-white py-1.5 mt-2">Sign Out</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-white bg-emerald-600 hover:bg-emerald-500 text-center py-2.5 rounded-lg font-bold transition-colors">
              Sign In / Register
            </Link>
          )}
        </div>

        {/* Categories Section */}
        <div className="flex flex-col gap-3 py-2">
          <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Categories</h3>
          <Link href="/products" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white py-1.5">All Products</Link>
          <Link href="/products?category=electronics" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white py-1.5">Electronics</Link>
          <Link href="/products?category=mens-fashion" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white py-1.5">Clothing</Link>
          <Link href="/products?category=home-living" onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:text-white py-1.5">Home & Kitchen</Link>
          <Link href="/deals" onClick={() => setIsMenuOpen(false)} className="text-emerald-400 hover:text-emerald-300 py-1.5 font-bold mt-2">Today's Deals</Link>
        </div>
      </div>
    </header>
  );
}
