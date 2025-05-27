// app/order-confirmation/page.tsx
import Link from 'next/link';
import Navbar from '../components/Navbar'; // Adjust path
import Footer from '../components/Footer';   // Adjust path

export default function OrderConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold text-green-600 mb-4">Thank You!</h1>
        <p className="text-lg text-gray-700 mb-2">Your order has been placed successfully.</p>
        <p className="text-gray-600 mb-8">You will receive an email confirmation shortly.</p>
        <Link href="/shop" className="bg-gray-800 text-white py-3 px-6 rounded text-sm font-medium hover:bg-gray-700">
          Continue Shopping
        </Link>
      </main>
      <Footer />
    </>
  );
}