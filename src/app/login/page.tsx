
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, FormEvent } from 'react';
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

const FacebookIcon = ({ className }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd"></path></svg>
);

const GoogleIcon = ({ className }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></svg>
);


export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e: FormEvent) => { 
    e.preventDefault();
    setIsLoading(true);
    setLoginMessage(''); 
    console.log('Attempting API Login with:', { email, password });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginMessage(`Login successful! Welcome, ${data.user?.name || data.user?.email}. (Session not yet implemented)`);
        alert(`Login successful! Welcome, ${data.user?.name || data.user?.email}. (Session not yet implemented)`);
      } else {
        setLoginMessage(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login API call error:', error);
      setLoginMessage('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    setLoginMessage(`Attempting login with ${provider}. This feature is not fully implemented yet.`);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/images/SBG.svg"   alt="Fashion models posing"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          <Link href="/" className="text-4xl font-semibold text-gray-900 lowercase mb-12 block text-center md:text-left">
            eclipse
          </Link>

          {loginMessage && (
            <div className={`mb-4 p-3 rounded-md text-sm ${loginMessage.includes('successful!') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {loginMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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
                value={email}
                onChange={(e) => { setEmail(e.target.value); setLoginMessage(''); }}
                className="appearance-none block w-full py-2.5 border-b border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-gray-800 sm:text-sm"
                disabled={isLoading}
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginMessage(''); }}
                  className="appearance-none block w-full py-2.5 border-b border-gray-400 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-gray-800 sm:text-sm"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-1 flex items-center text-sm leading-5"
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {passwordVisible ? (
                    <EyeSlashIcon className="text-gray-500 hover:text-gray-700" />
                  ) : (
                    <EyeIcon className="text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right pt-1">
              <Link href="/forgot-password"
                className={`text-xs font-medium text-gray-600 hover:text-gray-900 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                Forgotten your password?
              </Link>
            </div>

            <div className="pt-5 space-y-3.5">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'LOGGING IN...' : 'LOG IN'}
              </button>
              <Link
                href="/signup" 
                className={`w-full flex justify-center py-3 px-4 border border-gray-800 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
              >
                SIGN UP
              </Link>
            </div>
          </form>
          
          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500 font-medium">
                  You can also access with
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              By logging/signing in with my social login, I agree to connect my
              account in accordance with the <Link href="/privacy-policy" className="font-medium text-gray-700 hover:text-gray-900">Privacy Policy</Link>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3.5">
              <button
                onClick={() => handleSocialLogin('Facebook')}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <FacebookIcon className="mr-2.5 -ml-1 h-5 w-5"/>
                LOG IN WITH FACEBOOK
              </button>

              <button
                onClick={() => handleSocialLogin('Google')}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-400 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 disabled:opacity-50"
              >
                <GoogleIcon className="mr-2.5 -ml-1 h-5 w-5"/>
                LOG IN WITH GOOGLE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}