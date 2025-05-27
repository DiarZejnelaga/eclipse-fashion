'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SubscriptionResponse {
  message?: string;
  error?: string;
}

const NewsletterSection = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned unexpected response format');
      }

      const data: SubscriptionResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setMessage(data.message || 'Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white relative overflow-hidden py-20 md:py-24 lg:py-70 w-[1200px] h-[850px]">
      {/* Background Images */}
      <div className="absolute bottom-0 left-0 lg:left-[2%] xl:left-[5%] 2xl:left-[10%] z-0 hidden md:block pointer-events-none">
        <Image
          src="/guy.svg"
          alt="Male fashion model"
          width={380}
          height={200}
          className="object-contain"
          priority
        />
      </div>

      <div className="absolute bottom-0 right-0 lg:right-[2%] xl:right-[5%] 2xl:right-[10%] z-0 hidden md:block pointer-events-none">
        <Image
          src="/girl.svg"
          alt="Female fashion model"
          width={380}
          height={200}
          className="object-contain"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Stay Fashion-Forward
        </h2>

        <p className="text-gray-600 mb-8 text-base leading-relaxed max-w-md mx-auto">
          Get exclusive access to trend reports, style guides, and special offers.
        </p>

        <form
          className="w-full max-w-md mx-auto space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your best email"
              aria-label="Email address"
              className="w-full px-5 py-3.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-base transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
              disabled={isLoading}
            />

            <button
              type="submit"
              className="w-full bg-gray-900 text-white text-base font-semibold px-6 py-3.5 rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  Subscribing...
                </span>
              ) : (
                'Join Now'
              )}
            </button>
          </div>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                message.includes('Thank')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;