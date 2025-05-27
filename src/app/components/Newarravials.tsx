// app/components/NewArrivalsSection.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductType {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageSrc: string;
  altText: string;
  rating: number;
  reviewsText: string; // e.g., "(4.1k)"
  statusText: string; // e.g., "Almost Sold Out"
  category: "Men's Fashion" | "Women's Fashion" | "Women Accessories" | "Men Accessories" | "Discount Deals";
}

interface StarIconProps {
  filled: boolean;
}

const StarIcon: React.FC<StarIconProps> = ({ filled }) => (
  <svg className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${filled ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

interface FinalStarRatingDisplayProps {
  rating: number;
  totalStars?: number;
}

const FinalStarRatingDisplay: React.FC<FinalStarRatingDisplayProps> = ({ rating, totalStars = 5 }) => {
  return (
    <div className="flex space-x-0.5">
      {[...Array(totalStars)].map((_, i) => (
        <StarIcon key={i} filled={i < Math.floor(rating)} />
      ))}
    </div>
  );
};

// This is your local product data for this section.
// Ensure each `id` here also exists with full details in `app/data/products.ts`
const allProductsData: ProductType[] = [
  { id: 20, name: 'Lorem Ipsum 3', brand: 'Al Karam', price: 41.95, imageSrc: '/product-3.svg', altText: 'Woman in yellow hoodie', rating: 5, reviewsText: '(4.1k)', statusText: 'Almost Sold Out', category: "Women's Fashion" },
  { id: 21, name: 'Lorem Ipsum 4', brand: 'Al Karam', price: 19.95, imageSrc: '/product-4.svg', altText: 'Woman in teal hoodie', rating: 5, reviewsText: '(4.1k)', statusText: 'Almost Sold Out', category: "Women's Fashion" },
  { id: 22, name: 'Lorem Ipsum 6', brand: 'Al Karam', price: 31.95, imageSrc: '/product-5.svg', altText: 'Woman in blue sweatshirt', rating: 5, reviewsText: '(4.1k)', statusText: 'Almost Sold Out', category: "Women's Fashion" },
  { id: 23, name: 'Lorem Ipsum 7', brand: 'Al Karam', price: 35.50, imageSrc: '/product-7.jpg', altText: 'Floral Blouse', rating: 4, reviewsText: '(2.5k)', statusText: 'New In', category: "Women's Fashion" },
  { id: 24, name: 'Lorem Ipsum 8', brand: 'Al Karam', price: 55.00, imageSrc: '/product-8.jpg', altText: 'High-Waisted Jeans', rating: 5, reviewsText: '(3.0k)', statusText: 'Best Seller', category: "Women's Fashion" },
  { id: 25, name: 'Lorem Ipsum 9', brand: 'Al Karam', price: 68.75, imageSrc: '/product-9.jpg', altText: 'Maxi Dress', rating: 4, reviewsText: '(1.8k)', statusText: 'Trending', category: "Women's Fashion" },
  { id: 26, name: 'Lorem Ipsum 1', brand: 'Al Karam', price: 27.95, imageSrc: '/product-1.svg', altText: 'Man in brown hoodie', rating: 5, reviewsText: '(4.1k)', statusText: 'Almost Sold Out', category: "Men's Fashion" },
  { id: 27, name: 'Lorem Ipsum 2', brand: 'Al Karam', price: 38.95, imageSrc: '/product-2.svg', altText: 'Man in red hoodie', rating: 5, reviewsText: '(4.1k)', statusText: 'Almost Sold Out', category: "Men's Fashion" },
  { id: 28, name: 'Lorem Ipsum 5', brand: 'Al Karam', price: 22.95, imageSrc: '/product-6.svg', altText: 'Man in varsity jacket', rating: 5, reviewsText: '(4.1k)', statusText: 'Almost Sold Out', category: "Men's Fashion" },
  { id: 29, name: 'Lorem Ipsum 10', brand: 'Al Karam', price: 29.99, imageSrc: '/product-10.jpg', altText: 'Graphic Tee', rating: 4, reviewsText: '(2.2k)', statusText: 'Popular', category: "Men's Fashion" },
  { id: 30, name: 'Lorem Ipsum 11', brand: 'Al Karam', price: 49.50, imageSrc: '/product-11.jpg', altText: 'Slim Chinos', rating: 5, reviewsText: '(1.9k)', statusText: 'New Stock', category: "Men's Fashion" },
  { id: 31, name: 'Lorem Ipsum 12', brand: 'Al Karam', price: 42.00, imageSrc: '/product-19.jpg', altText: 'Casual Shirt', rating: 4, reviewsText: '(1.5k)', statusText: 'Comfort Fit', category: "Men's Fashion" },
  { id: 32, name: 'Lorem Ipsum 13', brand: 'Al Karam', price: 75.00, imageSrc: '/product-16.jpg', altText: 'Pearl Necklace', rating: 5, reviewsText: '(1.1k)', statusText: 'Classic', category: "Women Accessories" },
  { id: 33, name: 'Lorem Ipsum 14', brand: 'Al Karam', price: 120.99, imageSrc: '/product-15.jpg', altText: 'Tote Bag', rating: 4, reviewsText: '(850)', statusText: 'Spacious', category: "Women Accessories" },
  { id: 34, name: 'Lorem Ipsum 15', brand: 'Al Karam', price: 88.00, imageSrc: '/product-18.jpg', altText: 'Sunglasses Women', rating: 5, reviewsText: '(920)', statusText: 'UV Protection', category: "Women Accessories" },
  { id: 35, name: 'Lorem Ipsum 16', brand: 'Al Karam', price: 32.50, imageSrc: '/product-17.jpg', altText: 'Silk Scarf', rating: 4, reviewsText: '(600)', statusText: 'Versatile', category: "Women Accessories" },
  { id: 41, name: 'Lorem Ipsum 17', brand: 'Al Karam', price: 150.00, imageSrc: '/product-12.jpg', altText: 'Chronograph Watch', rating: 5, reviewsText: '(950)', statusText: 'Sporty', category: "Men Accessories" },
  { id: 42, name: 'Lorem Ipsum 18', brand: 'Al Karam', price: 40.00, imageSrc: '/product-14.jpg', altText: 'Men set', rating: 4, reviewsText: '(1.3k)', statusText: 'Durable', category: "Men Accessories" },
  { id: 43, name: 'Lorem Ipsum 19', brand: 'Al Karam', price: 30.50, imageSrc: '/product-13.jpg', altText: 'Necklace', rating: 5, reviewsText: '(1.5k)', statusText: 'Secure', category: "Men Accessories" },
  { id: 44, name: 'Lorem Ipsum 20', brand: 'Al Karam', price: 25.99, imageSrc: '/product-20.jpg', altText: 'Tie Set', rating: 4, reviewsText: '(700)', statusText: 'Formal', category: "Men Accessories" },
  { id: 51, name: 'Lorem Ipsum 21', brand: 'Al Karam', price: 75.00, imageSrc: '/product-25.jpg', altText: 'T-Shirt Deal', rating: 4, reviewsText: '(2.0k)', statusText: '50% OFF', category: "Discount Deals" },
  { id: 52, name: 'Lorem Ipsum 22', brand: 'Al Karam', price: 29.99, imageSrc: '/product-30.jpg', altText: 'Accessory Deal', rating: 3, reviewsText: '(1.2k)', statusText: 'Limited Time!', category: "Discount Deals" },
  { id: 53, name: 'Lorem Ipsum 23', brand: 'Al Karam', price: 190.00, imageSrc: '/product-22.jpg', altText: 'Hoodie Sale', rating: 4, reviewsText: '(900)', statusText: 'Clearance', category: "Discount Deals" },
  { id: 54, name: 'Lorem Ipsum 24', brand: 'Al Karam', price: 135.50, imageSrc: '/product-50.jpg', altText: 'Jeans Discount', rating: 4, reviewsText: '(1.4k)', statusText: 'Special Price', category: "Discount Deals" },
];

const categories: ProductType['category'][] = [ "Men's Fashion", "Women's Fashion", "Women Accessories", "Men Accessories", "Discount Deals" ];

interface ProductCardProps { product: ProductType; index: number; }

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => (
  <div className="group relative bg-white rounded-md overflow-hidden shadow-[0_2px_5px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-shadow duration-300">
    {/* CORRECTED Link: Changed from /products/ to /product/ */}
    <Link href={`/product/${product.id}`} className="block aspect-[4/5] bg-gray-100 relative">
      <Image
        src={product.imageSrc}
        alt={product.altText}
        fill
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        priority={index < 3}
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg'; }} // Generic placeholder
      />
    </Link>
    <div className="p-2.5 sm:p-3">
      {/* CORRECTED Link: Changed from /products/ to /product/ */}
      <Link href={`/product/${product.id}`} className="hover:text-gray-600 transition-colors">
        <h2 className="text-[13px] sm:text-sm font-semibold text-gray-700 mb-0.5 truncate leading-tight" title={product.name}>{product.name}</h2>
      </Link>
      <p className="text-[10px] sm:text-[11px] text-gray-400 mb-1 leading-tight">{product.brand}</p>
      <div className="flex items-center mb-1.5">
        <FinalStarRatingDisplay rating={product.rating} />
        <span className="text-[9px] sm:text-[10px] text-gray-400 ml-1">{product.reviewsText}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm sm:text-base font-bold text-gray-800">
          {typeof product.price === 'number'
            ? product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, }) // Default to USD
            : product.price}
        </span>
        {product.statusText && (
          <span className={`text-[9px] sm:text-[10px] font-medium ${ product.statusText.toLowerCase().includes('off') || product.statusText.toLowerCase().includes('sale') || product.statusText.toLowerCase().includes('deal') || product.statusText.toLowerCase().includes('offer') || product.statusText.toLowerCase().includes('clearance') ? 'text-red-500' : product.statusText === 'Almost Sold Out' ? 'text-red-500' : 'text-gray-500' }`}>
            {product.statusText}
          </span>
        )}
      </div>
    </div>
  </div>
);

const NewArrivalsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ProductType['category']>("Women's Fashion");
  const filteredProducts = allProductsData.filter(product => product.category === activeCategory);

  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-700 mb-2 tracking-normal">New Arrivals</h1>
          <p className="text-gray-500 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices
            sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin
          </p>
        </div>
        <div className="flex justify-center space-x-1 sm:space-x-1.5 mb-8 sm:mb-10 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 my-1 rounded-sm text-[10px] sm:text-xs font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 ${activeCategory === category ? 'bg-gray-800 text-white border border-gray-800 shadow-sm focus:ring-gray-700' : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 focus:ring-gray-400'}`}
            >
              {category}
            </button>
          ))}
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5 md:gap-4">
            {filteredProducts.slice(0, 6).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-base py-8">
            No new arrivals found in "{activeCategory}".
          </p>
        )}
        <div className="mt-10 sm:mt-12 text-center">
            <Link
              href={`/shop?category=${encodeURIComponent(activeCategory)}&filter=new`}
              className="inline-block bg-gray-800 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-sm text-xs sm:text-sm font-semibold hover:bg-black transition-colors shadow-sm"
            >
            View More...
            </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;