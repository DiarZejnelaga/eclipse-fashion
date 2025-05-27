// app/signup/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

// --- EyeIcon and EyeSlashIcon components ---
const EyeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);
// --- End Icons ---


export default function SignupPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surnames: '',
    email: '',
    password: '',
    receiveNews: false,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setMessage('');
    setError('');
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setMessage('');
    setError('');

    const fullName = `${formData.name} ${formData.surnames}`.trim();

    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsSubmitting(false);
        return;
    }

    try {
      const result = await register(formData.email, formData.password, fullName);

      if (result.success) {
        setMessage(result.message + ' Redirecting to login...');
        setFormData({ name: '', surnames: '', email: '', password: '', receiveNews: false });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error("Signup page error:", err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = formData.name && formData.surnames && formData.email && formData.password;

  if (authLoading) {
    return <div className="flex min-h-screen bg-white items-center justify-center"><p>Loading...</p></div>;
  }
  if (!authLoading && user) {
      return <div className="flex min-h-screen bg-white items-center justify-center"><p>You are already logged in. Redirecting...</p></div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/images/SBG1.svg"
          alt="Model in hoodie"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          <Link href="/" className="text-4xl font-semibold text-gray-900 lowercase mb-8 block text-center md:text-left">
            eclipse
          </Link>

          <h1 className="text-sm font-medium tracking-wider text-gray-800 uppercase mb-8 text-center md:text-left">
            CREATE ACCOUNT
          </h1>

          {message && (
            <div className="mb-4 p-3 rounded-md text-sm bg-green-100 text-green-700">
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
              <label htmlFor="name" className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-1.5">
                NAME
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="given-name"
                required
                disabled={isSubmitting}
                value={formData.name}
                onChange={handleChange}
                className="appearance-none block w-full py-2.5 border-b border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-gray-800 sm:text-sm disabled:opacity-70"
              />
            </div>

            <div>
              <label htmlFor="surnames" className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-1.5">
                SURNAME/S
              </label>
              <input
                id="surnames"
                name="surnames"
                type="text"
                autoComplete="family-name"
                required
                disabled={isSubmitting}
                value={formData.surnames}
                onChange={handleChange}
                className="appearance-none block w-full py-2.5 border-b border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-gray-800 sm:text-sm disabled:opacity-70"
              />
            </div>

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
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full py-2.5 border-b border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-gray-800 sm:text-sm disabled:opacity-70"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-1.5">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full py-2.5 border-b border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-gray-800 sm:text-sm disabled:opacity-70"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-1 flex items-center text-sm leading-5"
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                >
                  {passwordVisible ? (
                    <EyeSlashIcon className="text-gray-500 hover:text-gray-700" />
                  ) : (
                    <EyeIcon className="text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="receiveNews"
                    name="receiveNews"
                    type="checkbox"
                    checked={formData.receiveNews}
                    onChange={handleChange}
                    className="focus:ring-gray-600 h-4 w-4 text-gray-700 border-gray-400 rounded"
                  />
                </div>
                <div className="ml-2.5 text-xs">
                  <label htmlFor="receiveNews" className="font-normal text-gray-600">
                    I want to receive news and customised commercial communications from of Massimo Dutti via email and other means
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-3 text-xs text-gray-500">
                By clicking "ACCEPT AND CONTINUE", I confirm that I have read and
                accept the <Link href="/terms-and-conditions" className="font-medium text-gray-700 hover:text-gray-900">Terms and Conditions of use and purchase</Link>, and I
                understand the information on the use of my personal data provided in the <Link href="/privacy-policy" className="font-medium text-gray-700 hover:text-gray-900">Privacy Policy</Link>.
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                            ${(canSubmit && !isSubmitting) ? 'bg-black hover:bg-gray-800 focus:ring-gray-700' : 'bg-gray-400 cursor-not-allowed'}
                            focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {isSubmitting ? 'CREATING ACCOUNT...' : 'ACCEPT AND CONTINUE'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}