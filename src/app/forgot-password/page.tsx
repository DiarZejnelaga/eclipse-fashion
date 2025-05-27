// app/forgot-password/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, FormEvent } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); // For error messages
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/request-password-reset', { // Our API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // The API always returns a generic success message to prevent email enumeration
        setMessage(data.message);
        setEmail(''); // Clear the email field on "success"
      } else {
        // This branch might not be hit often if the API always returns 200 for this endpoint
        // but good to have for other potential errors (e.g. 400 for invalid email format from server)
        setError(data.message || 'An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Failed to connect to the server. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Image Panel */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/images/SBG2.svg" // *** ENSURE THIS IMAGE EXISTS in public/images/ ***
          alt="Fashion models"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Right side - Form Panel */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          <Link href="/" className="text-4xl font-semibold text-gray-900 lowercase mb-8 block text-center md:text-left">
            eclipse
          </Link>

          <h1 className="text-sm font-medium tracking-wider text-gray-800 uppercase mb-3 text-center md:text-left">
            RECOVER PASSWORD
          </h1>
          <p className="text-xs text-gray-600 mb-8 text-center md:text-left">
            Please enter your email address and we will send you instructions for obtaining your password.
          </p>

          {message && (
            <div className="mb-4 p-3 rounded-md text-sm bg-blue-100 text-blue-700">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-md text-sm bg-red-100 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-1.5">
                EMAIL
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setMessage(''); setError(''); }}
                className="appearance-none block w-full py-2.5 border-b border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-gray-800 sm:text-sm disabled:opacity-70"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50"
              >
                {isSubmitting ? 'SENDING...' : 'RECEIVE EMAIL'}
              </button>
            </div>
          </form>
           <div className="mt-8 text-center md:text-left">
            <Link href="/login" className="text-xs font-medium text-gray-600 hover:text-gray-900">
              ← Back to Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}