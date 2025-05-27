// src/app/components/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, MouseEvent, useEffect } from 'react';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentHash, setCurrentHash] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  let openCart = () => console.warn("Cart context or openCart not available in Navbar.");
  let cartItemCount = 0;
  try {
    const cart = useCart();
    if (cart) {
      openCart = cart.openCart;
      cartItemCount = cart.cartItemCount;
    }
  } catch {}
  const { user, logout, loading: authLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : '?';

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== 'undefined') {
        setCurrentHash(window.location.hash);
      }
    };

    if (isClient) {
      setCurrentHash(window.location.hash);
      window.addEventListener('hashchange', handleHashChange);
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
      };
    }
  }, [pathname, isClient]);

  const handleHomepageScrollLinkClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    if (pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        const navbarHeight = document.querySelector('header')?.offsetHeight || 64;
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: sectionTop, behavior: 'smooth' });
      }
    } else {
      const targetUrl = `/?scrollTo=${sectionId}`;
      router.push(targetUrl);
    }
  };

  const searchInputClasses = `ml-2 text-sm border border-gray-300 rounded-full px-3 py-1 transition-all duration-300 ease-in-out focus:ring-1 focus:ring-gray-800 focus:border-gray-800 ${
    isClient && showSearch ? 'w-32 md:w-40 opacity-100 scale-100' : 'w-0 opacity-0 scale-95 pointer-events-none'
  }`;

  const getLinkClassName = (linkPath: string, linkHash?: string) => {
    let isActive = false;
    if (linkHash) {
      isActive = pathname === '/' && isClient && currentHash === linkHash;
    } else {
      isActive = pathname === linkPath;
    }
    return `text-sm hover:text-black ${isActive ? 'text-black font-semibold' : 'text-gray-700'}`;
  };

  return (
    <header className="bg-white py-4 fixed top-0 left-0 w-full z-50 shadow-sm">
      <div className="max-w-[960px] mx-auto flex items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-gray-800 lowercase">eclipse</Link>

        <div className="flex items-center space-x-6 md:space-x-10">
          <nav className="hidden md:block">
            <ul className="flex space-x-5 lg:space-x-6">
              <li key="Home">
                <Link
                  href="/#home-top-section"
                  className={getLinkClassName('/', '#home-top-section')}
                  onClick={(e) => handleHomepageScrollLinkClick(e, 'home-top-section')}
                >
                  Home
                </Link>
              </li>
              <li key="Deals">
                <Link
                  href="/#deals-of-month-section"
                  className={getLinkClassName('/', '#deals-of-month-section')}
                  onClick={(e) => handleHomepageScrollLinkClick(e, 'deals-of-month-section')}
                >
                  Deals
                </Link>
              </li>
              <li key="New Arrivals">
                <Link
                  href="/#new-arrivals-section"
                  className={getLinkClassName('/', '#new-arrivals-section')}
                  onClick={(e) => handleHomepageScrollLinkClick(e, 'new-arrivals-section')}
                >
                  New Arrivals
                </Link>
              </li>
              <li key="ShopLink">
                <Link
                  href="/shop"
                  className={getLinkClassName('/shop')}
                >
                  Shop
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="relative flex items-center">
              <button onClick={() => setShowSearch(!showSearch)} className="p-1" aria-label="Toggle search">
                <Image
                  src="/icons/search.svg"
                  alt="Search"
                  width={16}
                  height={16}
                  className="hover:scale-110 transition-transform"
                />
              </button>
              <input type="text" placeholder="Search..." className={searchInputClasses} />
            </div>

            <button onClick={openCart} aria-label="Open shopping cart" className="relative p-1">
              <Image
                src="/icons/cart.svg"
                alt="Cart"
                width={16}
                height={16}
                className="hover:scale-110 transition-transform"
              />
              {isClient && cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono leading-none">
                  {cartItemCount}
                </span>
              )}
            </button>

            {authLoading ? (
              <div className="p-1 flex items-center justify-center w-7 h-7">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent"></div>
              </div>
            ) : user ? (
              <div className="relative group">
                <button
                  aria-label="User account options"
                  className="w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-sm font-semibold text-white focus:outline-none ring-1 ring-offset-1 ring-offset-white ring-gray-500"
                >
                  {userInitial}
                </button>
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block ring-1 ring-black ring-opacity-5"
                >
                  <div className="px-4 py-3">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name || user.email}</p>
                  </div>
                  <div className="border-t border-gray-100"></div>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="p-1" aria-label="Login">
                <Image
                  src="/icons/login.svg"
                  alt="Login"
                  width={16}
                  height={16}
                  className="hover:scale-110 transition-transform"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}