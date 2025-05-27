// app/cart/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/cartContext';
import { PLACEHOLDER_IMAGE_URL, ProductImage } from '../data/products'; // Adjust path

// Import shared components
import Navbar from '../components/Navbar'; // Adjust path
import Footer from '../components/Footer';   // Adjust path
import NewsletterSection from '../components/Newsletter'; // Adjust path
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    updateQuantity,
    removeItem,
    subtotal,
  } = useCart();

  const [giftWrap, setGiftWrap] = useState(false);
  const giftWrapCost = 10.00;

  const finalTotal = giftWrap && cartItems.length > 0 ? subtotal + giftWrapCost : subtotal;

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24 md:pt-28">
        <div className="mb-6 md:mb-8">
          <nav className="text-xs text-gray-500 mb-2" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/" className="hover:underline hover:text-black">Home</Link>
                <svg className="fill-current w-3 h-3 mx-1.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569 9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
              </li>
              <li className="flex items-center">
                <span className="text-gray-700">Your Shopping Cart</span>
              </li>
            </ol>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white shadow rounded-lg">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your Cart is Currently Empty</h2>
            <p className="text-gray-500 mb-6">Looks like you havent added anything to your cart yet.</p>
            <Link href="/shop" className="bg-gray-800 text-white py-2.5 px-6 rounded text-sm font-medium hover:bg-gray-700 transition-colors">
              Return To Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
              <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center pb-3 border-b mb-4 text-xs text-gray-500 uppercase font-medium">
                <span>Product</span>
                <span className="text-right">Price</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
                <span></span> {/* For remove button spacing */}
              </div>

              {/* Cart Item Rows */}
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center py-4 border-b last:border-b-0">
                  {/* Product Info */}
                  <div className="flex items-center space-x-3 md:col-span-1">
                    <Link href={`/product/${item.id}`} className="shrink-0">
                      <div className="w-16 h-20 sm:w-20 sm:h-24 relative rounded overflow-hidden bg-gray-100">
                        <Image
                          src={item.selectedImageUrl || PLACEHOLDER_IMAGE_URL}
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE_URL; }}
                        />
                      </div>
                    </Link>
                    <div>
                      <Link href={`/product/${item.id}`} className="text-sm font-medium text-gray-800 hover:underline leading-tight block">
                        {item.name}
                      </Link>
                      {item.selectedColorHex && <p className="text-xs text-gray-500 mt-0.5">Color: {item.images.find((img: ProductImage) => img.colorHex === item.selectedColorHex)?.altText?.split(' ').pop() || item.selectedColorHex}</p>}
                      {item.selectedSize && <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>}
                    </div>
                  </div>

                  {/* Price (Desktop) */}
                  <div className="hidden md:block text-sm text-gray-700 text-right">${item.priceValue.toFixed(2)}</div>

                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded h-9 w-24 justify-self-center md:justify-self-auto">
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="px-2.5 text-gray-500 hover:bg-gray-100 h-full focus:outline-none">-</button>
                    <input type="text" readOnly value={item.quantity} className="w-full text-center text-sm h-full border-l border-r focus:outline-none appearance-none" />
                    <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="px-2.5 text-gray-500 hover:bg-gray-100 h-full focus:outline-none">+</button>
                  </div>

                  {/* Total (Desktop) & Remove Button */}
                  <div className="text-sm font-semibold text-gray-900 text-right">${(item.priceValue * item.quantity).toFixed(2)}</div>
                  <div className="text-right">
                    <button onClick={() => removeItem(item.cartItemId)} className="text-xs text-red-500 hover:underline md:ml-4">Remove</button>
                  </div>

                  {/* Price & Total (Mobile) */}
                  <div className="md:hidden col-span-3 flex justify-between text-sm mt-2 pt-2 border-t">
                     <span className="text-gray-500">Price: ${item.priceValue.toFixed(2)}</span>
                     <span className="font-semibold text-gray-800">Total: ${(item.priceValue * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Right Side / Bottom on mobile */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Order Summary</h2>
                <div className="flex items-center mb-4 py-3 border-b">
                  <input
                    type="checkbox"
                    id="wrapProductPage"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                  />
                  <label htmlFor="wrapProductPage" className="ml-2 block text-sm text-gray-700">
                    For <span className="font-semibold">${giftWrapCost.toFixed(2)}</span> Please Wrap The Product
                  </label>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {giftWrap && cartItems.length > 0 && (
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Gift Wrap</span>
                            <span>${giftWrapCost.toFixed(2)}</span>
                        </div>
                    )}
                    {/* You can add Shipping and Tax lines here later if needed */}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-lg font-semibold text-gray-900">Total</p>
                  <p className="text-lg font-semibold text-gray-900">${finalTotal.toFixed(2)}</p>
                </div>

                <button
                  onClick={handleProceedToCheckout} // Fix 2: Changed to call the defined function
                  className="mt-6 w-full bg-black text-white py-3 px-6 rounded font-semibold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  Checkout
                </button>
                <Link href="/shop" className="block w-full text-center mt-3 text-sm text-indigo-600 hover:underline">
                  Continue Shopping {/* Changed text for clarity, original was "View Cart" which is less fitting here */}
                </Link>
              </div>
               <Link href="/shop" className="hidden lg:block w-full text-center mt-4 text-sm text-indigo-600 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>
      <NewsletterSection />
      <Footer />
    </>
  );
}