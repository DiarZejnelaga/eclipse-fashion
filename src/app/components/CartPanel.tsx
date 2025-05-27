// app/components/CartPanel.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Standard next/link
import { useRouter } from 'next/navigation';
import { ProductImage, PLACEHOLDER_IMAGE_URL } from '../data/products';
import { CartContextItem, useCart } from '../context/cartContext';

export default function CartPanel() {
  const router = useRouter();
  const {
    isCartOpen,
    closeCart,
    cartItems,
    updateQuantity,
    removeItem,
    subtotal,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 125;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const hasFreeShipping = subtotal >= freeShippingThreshold;

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300 ease-in-out ${
        isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={closeCart}
    >
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Shopping Cart</h2>
            <button
              onClick={closeCart}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close shopping cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {cartItems.length > 0 && (
            <div className={`p-3 sm:p-4 text-center text-xs sm:text-sm border-b border-gray-200 ${hasFreeShipping ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}`}>
              {hasFreeShipping ? (
                "🎉 You've got Free Shipping!"
              ) : (
                <>
                  Buy <span className="font-bold">${amountForFreeShipping.toFixed(2)}</span> More And Get <span className="font-bold">Free Shipping</span>
                </>
              )}
            </div>
          )}

          <div className="flex-grow overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <p className="text-gray-500 text-center">Your cart is empty.</p>
                <button
                    onClick={closeCart}
                    className="mt-6 bg-gray-800 text-white py-2 px-6 rounded text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                    Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item: CartContextItem) => (
                <div key={item.cartItemId} className="flex items-start space-x-3 sm:space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="w-16 h-20 sm:w-20 sm:h-24 relative rounded overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={item.selectedImageUrl || PLACEHOLDER_IMAGE_URL}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE_URL; }}
                    />
                  </div>
                  <div className="flex-grow">
                    {/* MODIFIED PRODUCT NAME LINK: No <a> child */}
                    <Link
                      href={`/product/${item.id}`}
                      onClick={closeCart}
                      className="text-sm font-medium text-gray-800 leading-tight hover:underline"
                    >
                      {item.name}
                    </Link>
                    {item.selectedColorHex && <p className="text-xs text-gray-500 mt-0.5">Color: {item.images.find((img: ProductImage) => img.colorHex === item.selectedColorHex)?.altText?.split(' ').pop() || item.selectedColorHex}</p>}
                    {item.selectedSize && <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>}
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      ${(item.priceValue * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1.5 shrink-0">
                    <div className="flex items-center border border-gray-200 rounded h-8 w-20 sm:w-24">
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="px-2 text-gray-500 hover:bg-gray-100 h-full focus:outline-none text-sm">-</button>
                      <input type="text" readOnly value={item.quantity} className="w-full text-center text-xs sm:text-sm h-full border-l border-r focus:outline-none appearance-none" />
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="px-2 text-gray-500 hover:bg-gray-100 h-full focus:outline-none text-sm">+</button>
                    </div>
                    <button onClick={() => removeItem(item.cartItemId)} className="text-xs text-red-500 hover:underline">Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-gray-200 bg-white">
              <div className="flex items-center mb-4">
                <input type="checkbox" id="wrapProductCartPanel" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <label htmlFor="wrapProductCartPanel" className="ml-2 block text-sm text-gray-700">
                  For <span className="font-semibold">$10.00</span> Please Wrap The Product
                </label>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-base sm:text-lg font-semibold text-gray-900">Subtotal</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">${subtotal.toFixed(2)}</p>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 px-6 rounded font-semibold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                Checkout
              </button>
              {/* MODIFIED VIEW CART LINK: No <a> child */}
              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full text-center mt-3 text-sm text-indigo-600 hover:underline"
              >
                View Cart
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}