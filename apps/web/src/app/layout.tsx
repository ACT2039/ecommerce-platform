import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'CityCart | Premium E-Commerce',
  description: 'Your premier destination for luxury lifestyle products.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen text-white font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Suspense fallback={<div className="h-16 w-full glass-nav" />}>
                <Navbar />
              </Suspense>
              <main className="flex-1 w-full">
                {children}
              </main>
              <Footer />
              <Toaster position="bottom-right" richColors />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
