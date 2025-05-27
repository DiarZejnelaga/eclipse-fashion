import React from 'react';
import Link from 'next/link'; 

const Footer = () => {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="bg-white text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-6 md:gap-0">
         
          <div className="text-2xl font-serif tracking-wider text-black">
            FASCO
          </div>

          <nav>
            <ul className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm">
              <li>
                <Link href="/support" className="hover:text-black transition-colors duration-200">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/invoicing" className="hover:text-black transition-colors duration-200">
                  Invoicing
                </Link>
              </li>
              <li>
                <Link href="/contract" className="hover:text-black transition-colors duration-200">
                  Contract
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-black transition-colors duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-black transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-black transition-colors duration-200">
                  FAQs
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="text-center text-xs text-gray-500 pt-6 border-t border-gray-800">
          Copyright © {currentYear} FASCO. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;