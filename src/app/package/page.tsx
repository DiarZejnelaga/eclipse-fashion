// src/components/Package.tsx
import Link from 'next/link';
import Image from 'next/image';

// --- TEMPORARY HARDCODED DATA FOR DESIGNING ---
const placeholderHeroBanners = [
  {
    id: 'banner1',
    title: 'BBC ICECREAM JAPAN',
    heroImageUrl: '/images/hero/hero-banner-bbc-icecream.jpg', // Replace with a real image path for design
    shopNowLink: '#', // Placeholder link
    collectionShopNowLink: '#',
  },
  {
    id: 'banner2',
    title: 'BILLIONAIRE BOYS CLUB\nSPRING \'25',
    heroImageUrl: '/images/hero/hero-banner-bbc-spring25.jpg', // Replace
    shopNowLink: '#',
    collectionShopNowLink: '#',
  },
  {
    id: 'banner3',
    title: 'NEW SEASON HIGHLIGHTS',
    heroImageUrl: '/images/hero/hero-banner-third.jpg', // Replace
    shopNowLink: '#',
    collectionShopNowLink: '#',
  },
];

const placeholderProducts = [
  { id: 'p1', name: 'ATHLETIC T-SHIRT BLOCKS', price: '75.00 €', imageUrl: '/images/products/athletic-t-shirt-blocks.png' }, // Replace
  { id: 'p2', name: 'BORDER L/S T-SHIRT', price: '90.00 €', imageUrl: '/images/products/border-ls-t-shirt.png' }, // Replace
  { id: 'p3', name: 'FOOTBALL L/S SHIRT', price: '110.00 €', imageUrl: '/images/products/football-ls-shirt.png' }, // Replace
  { id: 'p4', name: 'BILLIONAIRE BOYS CLUB SWEATSHIRT', price: '120.00 €', imageUrl: '/images/products/bbc-sweatshirt-white.png' }, // Replace
  { id: 'p5', name: 'BORDER SS T-SHIRT', price: '50.00 €', imageUrl: '/images/products/border-ss-t-shirt-black.png' }, // Replace
];
// --- END OF TEMPORARY HARDCODED DATA ---


// Simple Product Card for design purposes
const StaticProductCard = ({ name, price, imageUrl }: { name: string, price: string, imageUrl: string }) => (
  <Link href="#" className="block w-52 md:w-60 flex-shrink-0 group text-center">
    <div className="relative aspect-[3/4] bg-neutral-800 rounded-md overflow-hidden mb-2 transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:scale-105">
      {/* If using Next/Image, ensure domain is configured or use regular <img> for static placeholders */}
      <Image
        src={imageUrl || '/images/placeholder-product.png'} // Fallback placeholder
        alt={name}
        fill
        sizes="(max-width: 768px) 30vw, 20vw"
        className="object-cover"
      />
    </div>
    <h3 className="text-xs sm:text-sm font-semibold text-neutral-200 truncate group-hover:text-white">{name}</h3>
    <p className="text-xs text-neutral-400">{price}</p>
  </Link>
);


// This sub-component renders ONE hero banner AND its associated product scroll
// It now takes the products directly as a prop for static design
function HeroAndScrollSection({
  bannerConfig,
  productsForScroll
}: {
  bannerConfig: typeof placeholderHeroBanners[0]; // Use type from placeholder
  productsForScroll: typeof placeholderProducts;  // Use type from placeholder
}) {
  return (
    <div className="mb-0">
      {/* Hero Banner Section */}
      <section
        className="relative h-[65vh] md:h-[75vh] bg-cover bg-center text-white flex items-end justify-start"
        style={{ backgroundImage: `url(${bannerConfig.heroImageUrl || '/images/placeholder-banner.jpg'})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div> {/* Dark overlay */}
        <div className="relative container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pb-10 md:pb-16 z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase whitespace-pre-line leading-tight max-w-xl">
            {bannerConfig.title}
          </h2>
          <Link
            href={bannerConfig.shopNowLink}
            className="mt-6 inline-block bg-neutral-900 text-white py-2.5 px-8 sm:py-3 sm:px-10 text-sm sm:text-base font-semibold border-2 border-white hover:bg-white hover:text-black transition-colors rounded-sm"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Product Scroll Section */}
      <section className="bg-black py-10 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto space-x-4 md:space-x-5 pb-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
            {productsForScroll.map((product) => (
              <StaticProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>
          <div className="text-center mt-6 md:mt-8">
            <Link
                href={bannerConfig.collectionShopNowLink}
                className="border border-white text-white py-2.5 px-10 sm:py-3 sm:px-12 text-sm sm:text-base font-semibold hover:bg-white hover:text-black transition-colors rounded-sm"
            >
                Shop Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Main component for the "Package" page content
export default function PackagePageLayout() { // This can be a regular function now, not async
  const heroBannerConfigs = placeholderHeroBanners; // Use hardcoded data

  if (!heroBannerConfigs || heroBannerConfigs.length === 0) {
    return <div className="text-center py-20 text-white bg-black min-h-screen">No banner configurations found.</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {heroBannerConfigs.map((bannerConfig) => (
        <HeroAndScrollSection
          key={bannerConfig.id}
          bannerConfig={bannerConfig}
          productsForScroll={placeholderProducts} // Pass the same set of placeholder products to each scroll for design
        />
      ))}
    </div>
  );
}