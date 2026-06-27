import Link from 'next/link';
import { ArrowRight, ShoppingBag, Star, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen selection:bg-emerald-200">
      
      {/* 
        ========================================================================
        HERO SECTION - Glassmorphism, Micro-animations, Elegant Emerald Accents
        ========================================================================
      */}
      <div className="relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-emerald-100/40 blur-3xl opacity-60"></div>
          <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#E5E0D8]/60 blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm text-sm font-bold text-emerald-300 tracking-wide mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                New 2026 Collection
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1]">
                Elevate Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Everyday Style.
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-300 max-w-lg leading-relaxed">
                Discover a curated collection of premium fashion, electronics, and home goods designed to fit your unique lifestyle seamlessly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-emerald-900/20 transition-all active:scale-95 group border border-emerald-400/50">
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/deals" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-14 px-8 rounded-2xl text-lg font-bold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white transition-all active:scale-95 bg-transparent">
                    View Deals
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-8">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-12 h-12 rounded-full border-2 border-slate-800 shadow-sm" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-sm font-bold text-white mt-1">Trusted by 10k+ customers</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Image/Card */}
            <div className="lg:col-span-6 relative perspective-1000 mt-12 lg:mt-0">
              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-4 rounded-[2rem] shadow-2xl transform transition-transform duration-500 hover:rotate-y-[-5deg] hover:rotate-x-[5deg]">
                <img 
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200" 
                  alt="Fashion Collection" 
                  className="w-full h-[500px] object-cover rounded-3xl"
                />
                
                {/* Floating elements */}
                <div className="absolute hidden md:block -left-8 top-20 glass-card p-4 rounded-2xl animate-bounce-slow z-20">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-300 uppercase tracking-wide">Top Seller</p>
                      <p className="text-sm font-black text-white">Autumn Jacket</p>
                    </div>
                  </div>
                </div>

                <div className="absolute hidden md:block -right-8 bottom-20 glass-card p-4 rounded-2xl animate-pulse-slow z-20">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-xs font-bold text-gray-300 uppercase tracking-wide text-right">Discount</p>
                      <p className="text-lg font-black text-emerald-400">-30% OFF</p>
                    </div>
                    <div className="bg-white/10 p-2 rounded-full text-white">
                      <Zap className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        BENTO BOX CATEGORIES
        ========================================================================
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">Shop by Category</h2>
            <p className="text-gray-300 mt-2">Explore our highly curated selections</p>
          </div>
          <Link href="/products" className="hidden sm:flex items-center text-emerald-400 font-bold hover:text-emerald-300 transition-colors group">
            View All <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card */}
          <Link href="/products?category=electronics" className="block md:col-span-2 relative rounded-[2rem] overflow-hidden group shadow-md transition-shadow hover:shadow-xl border border-white/10 min-h-[300px] md:min-h-[500px]">
            <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 transition-colors z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1200" 
              alt="Electronics" 
              className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-gray-900/80 to-transparent">
              <h3 className="text-3xl font-black text-white">Electronics</h3>
              <p className="text-gray-200 mt-2 flex items-center">
                Upgrade your tech <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </p>
            </div>
          </Link>

          <div className="flex flex-col gap-6 min-h-[300px] md:min-h-[500px]">
            {/* Small Card 1 */}
            <Link href="/products?category=mens-fashion" className="block flex-1 relative rounded-[2rem] overflow-hidden group shadow-md transition-shadow hover:shadow-xl border border-white/10 min-h-[200px]">
              <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 transition-colors z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=800" 
                alt="Fashion" 
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-gradient-to-t from-gray-900/80 to-transparent">
                <h3 className="text-xl font-black text-white">Fashion</h3>
              </div>
            </Link>

            {/* Small Card 2 */}
            <Link href="/products?category=home-living" className="block flex-1 relative rounded-[2rem] overflow-hidden group shadow-md transition-shadow hover:shadow-xl glass-card p-6 flex flex-col justify-center min-h-[200px]">
              <div className="bg-emerald-500/20 w-12 h-12 rounded-full flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">Premium Quality</h3>
              <p className="text-gray-300 text-sm mt-2">Every product is verified for excellence.</p>
              <span className="text-emerald-400 font-bold text-sm mt-4 group-hover:translate-x-1 transition-transform inline-block">Learn more →</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
