'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, FormEvent } from 'react';

const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`w-5 h-5 ${className}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeSlashIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`w-5 h-5 ${className}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>
);

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // TODO: Replace the below with actual API call to backend with token & newPassword
    // For example:
    // const res = await fetch('/api/auth/change-password', {
    //   method: 'POST',
    //   body: JSON.stringify({ token, newPassword }),
    // });
    // Handle success or failure accordingly

    console.log('New password submitted:', newPassword);

    setMessage('Your password has been successfully changed.');
    setShowAlert(true);
    setNewPassword('');

    // Hide alert after 3 seconds
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Image Panel */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/images/SBG3.svg" // Replace with your image path
          alt="Two women posing"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Right side - Form Panel */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="text-4xl font-semibold text-gray-900 lowercase mb-8 block text-center md:text-left"
          >
            eclipse
          </Link>

          <h1 className="text-sm font-medium tracking-wider text-gray-800 uppercase mb-8 text-center md:text-left">
            CHANGE PASSWORD
          </h1>

          {showAlert && (
            <div
              role="alert"
              className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow z-50"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-xs font-medium tracking-wide text-gray-600 uppercase mb-1.5"
              >
                NEW PASSWORD
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setMessage('');
                    setShowAlert(false);
                  }}
                  className="appearance-none block w-full py-2.5 border-b border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-gray-800 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-1 flex items-center text-sm leading-5"
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                >
                  {passwordVisible ? (
                    <EyeSlashIcon className="text-gray-500 hover:text-gray-700" />
                  ) : (
                    <EyeIcon className="text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
              >
                CHANGE PASSWORD
              </button>
            </div>
          </form>

          {message && !showAlert && (
            <div className="mt-8 text-center md:text-left">
              <Link
                href="/login"
                className="text-xs font-medium text-gray-600 hover:text-gray-900"
              >
                Proceed to Log in →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
