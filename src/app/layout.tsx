// app/layout.tsx (or src/app/layout.tsx)
'use client';

import React from 'react';
import { Geist, Geist_Mono } from 'next/font/google'; // <<< USE THIS IMPORT
import './globals.css';

import { CartProvider } from './context/cartContext';   
import { AuthProvider } from './context/AuthContext'; // <<< VERIFY THIS PATH (e.g., './src/context/AuthContext' or '../context/AuthContext')
import Navbar from './components/Navbar';             // Assuming this path is correct
import CartPanel from './components/CartPanel';      
const geistSans = Geist({ // <<< USE THIS INITIALIZATION
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Good practice for font loading
});
const geistMono = Geist_Mono({ // <<< USE THIS INITIALIZATION
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap', // Good practice for font loading
});

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">{/* Adjust pt-16 based on Navbar height */}
        {children}
      </main>
      <CartPanel />
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <MainLayoutContent>{children}</MainLayoutContent>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}