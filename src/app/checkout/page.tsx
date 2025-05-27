'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/cartContext';
import { PLACEHOLDER_IMAGE_URL, ProductImage } from '../data/products';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsletterSection from '../components/Newsletter';
import CardTypeSelector from '../components/CardTypeSelector';

interface CardType {
  id: string;
  name: string;
  sprite: {
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const PAYMENT_SPRITE_URL = '/images/payment/visa.svg';

const cardTypesData: CardType[] = [
  { id: 'visa', name: 'Visa', sprite: { url: PAYMENT_SPRITE_URL, x: 20, y: -3.5, width: 58, height: 18 } },
  { id: 'mastercard', name: 'Mastercard', sprite: { url: PAYMENT_SPRITE_URL, x: -48, y: -3.5, width: 38, height: 18 } },
  { id: 'amex', name: 'American Express', sprite: { url: PAYMENT_SPRITE_URL, x: -100, y: -3.5, width: 43, height: 18 } },
  { id: 'gala', name: 'Gala Card', sprite: { url: PAYMENT_SPRITE_URL, x: -146, y: -3.5, width: 38, height: 18 } },
  { id: 'discover', name: 'Discover', sprite: { url: PAYMENT_SPRITE_URL, x: -185, y: -3.5, width: 53, height: 18 } },
  { id: 'diners', name: 'Diners Club', sprite: { url: PAYMENT_SPRITE_URL, x: -243, y: -3.5, width: 33, height: 18 } },
  { id: 'unionpay', name: 'UnionPay', sprite: { url: PAYMENT_SPRITE_URL, x: -278, y: -3.5, width: 48, height: 18 } },
];

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  containerClassName?: string;
}
const FormInput: React.FC<InputProps> = ({ label, id, containerClassName = "", ...props }) => (
  <div className={containerClassName}>
    <label htmlFor={id} className="block text-xs font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      {...props}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  containerClassName?: string;
  children: React.ReactNode;
}
const FormSelect: React.FC<SelectProps> = ({ label, id, containerClassName = "", children, ...props }) => (
  <div className={containerClassName}>
    <label htmlFor={id} className="block text-xs font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={id}
      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
      {...props}
    >
      {children}
    </select>
  </div>
);

const SpriteLogoDisplay: React.FC<{ spriteData: CardType['sprite']; altName: string; className?: string }> = ({ spriteData, altName, className = "" }) => (
  <div
    role="img"
    aria-label={altName}
    className={`shrink-0 bg-no-repeat ${className}`}
    style={{
      width: `${spriteData.width}px`,
      height: `${spriteData.height}px`,
      backgroundImage: `url(${spriteData.url})`,
      backgroundPosition: `${spriteData.x}px ${spriteData.y}px`,
    }}
  ></div>
);

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United States');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [saveDeliveryInfo, setSaveDeliveryInfo] = useState(false);

  const paymentMethod = 'creditCard';
  const [selectedCardTypeId, setSelectedCardTypeId] = useState<string | null>(
    cardTypesData.length > 0 ? cardTypesData[0].id : null
  );
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);

  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);

  const shippingCost = cartItems.length > 0 ? 40.00 : 0;
  const totalBeforeDiscount = subtotal + shippingCost;
  const discountAmount = (totalBeforeDiscount * discountApplied) / 100;
  const finalTotal = totalBeforeDiscount - discountAmount;

  useEffect(() => {
    if (cartItems.length === 0 && typeof window !== 'undefined') {
    }
  }, [cartItems, router]);

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === 'FASCO10') {
      setDiscountApplied(10);
      alert('Discount code applied!');
    } else if (discountCode.toUpperCase() === 'SAVE20') {
        setDiscountApplied(20);
        alert('Discount code applied!');
    }
    else {
      setDiscountApplied(0);
      alert('Invalid discount code.');
    }
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address || !city || !postalCode || !cardNumber || !expiryDate || !securityCode || !cardHolderName || !selectedCardTypeId) {
      alert('Please fill in all required fields, including selecting a card type.');
      return;
    }
    const selectedCardName = cardTypesData.find(c => c.id === selectedCardTypeId)?.name || 'Selected Card';
    console.log('Form Data:', {
      email, country, firstName, lastName, address, city, postalCode, saveDeliveryInfo,
      paymentMethod, selectedCardTypeId, cardNumber, expiryDate, securityCode, cardHolderName, savePaymentInfo,
      discountCode, discountApplied, subtotal, shippingCost, finalTotal
    });
    alert(`Payment successful for $${finalTotal.toFixed(2)} with ${selectedCardName}! Thank you for your order.`);
    clearCart();
    router.push('/order-confirmation');
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24 md:pt-28">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">FASCO Demo Checkout</h1>
        </div>

        <form onSubmit={handlePayNow}>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 md:gap-12">
            <div className="space-y-10">
              <section>
                <div className="flex justify-between items-baseline mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">Contact</h2>
                  <p className="text-xs text-gray-500">
                    Have an account? <Link href="/login" className="text-indigo-600 hover:underline">Log in</Link>
                  </p>
                </div>
                <FormInput type="email" label="Email Address" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                 <p className="text-xs text-gray-500 mt-2">
                    Or <Link href="/register" className="text-indigo-600 hover:underline">Create Account</Link> to save your details.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery</h2>
                <div className="space-y-4">
                  <FormSelect label="Country / Region" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </FormSelect>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput type="text" label="First Name" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    <FormInput type="text" label="Last Name" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                  <FormInput type="text" label="Address" id="address" placeholder="123 Main St" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput type="text" label="City" id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                    <FormInput type="text" label="Postal Code" id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                  </div>
                  <div className="flex items-center">
                    <input id="saveDeliveryInfo" name="saveDeliveryInfo" type="checkbox" checked={saveDeliveryInfo} onChange={(e) => setSaveDeliveryInfo(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <label htmlFor="saveDeliveryInfo" className="ml-2 block text-sm text-gray-700">Save this information for next time</label>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment</h2>
                <p className="text-xs text-gray-500 mb-3">All transactions are secure and encrypted.</p>
                
                <div className="mb-4">
                  <CardTypeSelector
                    cardTypes={cardTypesData}
                    selectedCardTypeId={selectedCardTypeId}
                    onCardTypeSelect={setSelectedCardTypeId}
                    label="Credit Card"
                  />
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <FormInput type="text" label="Card Number" id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required placeholder="0000 0000 0000 0000" />
                    {selectedCardTypeId && 
                     (() => {
                        const card = cardTypesData.find(c => c.id === selectedCardTypeId);
                        return card ? (
                          <span className="absolute right-3 top-[calc(50%+0.25rem)] -translate-y-1/2 transform text-gray-400 flex items-center space-x-1.5">
                            <SpriteLogoDisplay 
                                spriteData={card.sprite} 
                                altName={card.name}
                            />
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"></path></svg>
                          </span>
                        ) : null;
                     })()
                    }
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput type="text" label="Expiration Date (MM/YY)" id="expiryDate" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required placeholder="MM / YY" />
                    <FormInput type="text" label="Security Code" id="securityCode" value={securityCode} onChange={(e) => setSecurityCode(e.target.value)} required placeholder="CVC" />
                  </div>
                  <FormInput type="text" label="Card Holder Name" id="cardHolderName" value={cardHolderName} onChange={(e) => setCardHolderName(e.target.value)} required placeholder="Full name as on card" />
                  <div className="flex items-center">
                    <input id="savePaymentInfo" name="savePaymentInfo" type="checkbox" checked={savePaymentInfo} onChange={(e) => setSavePaymentInfo(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <label htmlFor="savePaymentInfo" className="ml-2 block text-sm text-gray-700">Save this payment information for next time</label>
                  </div>
                </div>
              </section>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-6 rounded-md font-semibold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Pay Now
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">Copyright © 2022 FASCO. All Rights Reserved.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-lg h-fit sticky top-28">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Order Summary</h2>
              {cartItems.length === 0 ? (
                <p className="text-sm text-gray-500">Your cart is empty.</p>
              ) : (
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                  {cartItems.map(item => (
                    <div key={item.cartItemId} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-14 bg-gray-200 rounded overflow-hidden shrink-0">
                           <Image src={item.selectedImageUrl || PLACEHOLDER_IMAGE_URL} alt={item.name} layout="fill" objectFit="cover"/>
                           <span className="absolute -top-1 -right-1 bg-gray-700 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">{item.quantity}</span>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700">{item.name}</p>
                            <p className="text-xs text-gray-500">
                                {item.selectedColorHex && `Color: ${item.images.find((img: ProductImage) => img.colorHex === item.selectedColorHex)?.altText?.split(' ').pop() || item.selectedColorHex}`}
                                {item.selectedColorHex && item.selectedSize && ", "}
                                {item.selectedSize && `Size: ${item.selectedSize}`}
                            </p>
                        </div>
                      </div>
                      <span className="text-gray-700">${(item.priceValue * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="py-4 border-t border-b">
                <div className="flex items-center">
                  <FormInput
                    type="text"
                    id="discountCode"
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    containerClassName="flex-grow mr-2"
                    label=""
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Apply
                  </button>
                </div>
              </div>
              <div className="space-y-1 py-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountApplied > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({discountApplied}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t mt-2">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
      <NewsletterSection />
      <Footer />
    </>
  );
}