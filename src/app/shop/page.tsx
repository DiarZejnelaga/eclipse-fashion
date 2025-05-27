'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- DATA & TYPES ---
import { Product as BaseProduct, ProductImage, PriceRange, PLACEHOLDER_IMAGE_URL } from '../data/products';

interface Product extends BaseProduct {
  sizes?: string[];
  collections?: string[];
  tags?: string[];
  dateAdded?: string;
  salesCount?: number;
  isSaleItem?: boolean;
  relatedProductIds?: number[];
}

const productsData: Product[] = [
  // Your existing shop productsData...
  { id: 1, name: "Rounded Red Hat", price: "$8.00", priceValue: 8.00, brand: "Learts", allColors: ["#FFDD57", "#000000"], images: [ { url: "/images/products/pr1.svg", colorHex: "#FF0000" }], sizes: ["S", "M"], collections: ["New arrivals", "Hats"], tags: ["Hats", "Fashion"], salesCount: 120, dateAdded: "2023-10-26" },
  { id: 2, name: "VantaBlack Shirt", price: "$17.00", priceValue: 17.00, brand: "Minimog", allColors: ["#ADD8E6", "#FFC0CB"], images: [ { url: "/images/products/pr2.svg", colorHex: "#000000" } ], sizes: ["M", "L"], collections: ["Best sellers"], tags: ["Shirts", "Linen"], salesCount: 200, dateAdded: "2023-09-15", soldOut: true },
  { id: 3, name: "Long-sleeve Coat", price: "$106.00", priceValue: 106.00, brand: "Vagabond", allColors: ["#FFFFFF", "#90EE90"], images: [ { url: "/images/products/pr3.svg", colorHex: "#000000" }], sizes: ["L", "XL"], collections: ["Outerwear"], tags: ["Coats", "Winter"], salesCount: 75, dateAdded: "2023-10-01" },
  { id: 4, name: "Boxy Denim Hat", price: "$25.00", priceValue: 25.00, brand: "Retrolie Brook", allColors: ["#E0E0E0", "#36454F"], images: [ { url: "/images/products/pr4.svg", colorHex: "#000000" } ], sizes: ["M"], collections: ["Accessories", "Hats"], tags: ["Hats", "Denim"], salesCount: 90, dateAdded: "2023-11-05" },
  { id: 5, name: "Linen Plain Top", price: "$25.00", priceValue: 25.00, brand: "Abby", allColors: ["#90EE90", "#D3D3D3"], images: [ { url: "/images/products/pr5.svg", colorHex: "#000000" }], sizes: ["S", "M", "L"], collections: ["Tops"], tags: ["Linen", "Casual"], salesCount: 150, dateAdded: "2023-08-20" },
  { id: 6, name: "Oversized T-shirt", price: "$11.00", originalPrice: "$14.00", priceValue: 11.00, brand: "Minimog", allColors: ["#FFC0CB"], images: [ { url: "/images/products/pr6.svg", colorHex: "#FFC0CB" } ], sizes: ["XL"], collections: ["Best sellers", "T-shirts"], tags: ["Oversized", "Comfort"], salesCount: 250, dateAdded: "2023-07-10", isSaleItem: true },
  { id: 7, name: "Dress", price: "$18.00", originalPrice: "$21.00", priceValue: 18.00, brand: "Learts", allColors: ["#000000", "#A52A2A"], images: [ { url: "/images/products/pr10.svg", colorHex: "#000000" }, { url: "/images/products/pr13.jpg", colorHex: "#A52A2A" } ], sizes: ["M", "S"], collections: ["Accessories"], tags: ["Sunglasses", "Summer"], salesCount: 180, dateAdded: "2023-06-01", isSaleItem: true },
  { id: 8, name: "Rockstar Jacket", price: "$22.00", priceValue: 22.00, brand: "Vagabond", allColors: ["#C0C0C0", "#ADD8E6"], images: [ { url: "/images/products/pr8.svg", colorHex: "#000000" }], sizes: ["M", "L"], collections: ["Outerwear", "New arrivals"], tags: ["Jackets", "Edgy"], salesCount: 60, dateAdded: "2023-11-10" },
  { id: 9, name: "Polarized Sunglasses", price: "$20.00", priceValue: 20.00, brand: "Abby", allColors: ["#00008B", "#000000", "#87CEEB"], images: [ { url: "/images/products/pr9.svg", colorHex: "#00008B" }, { url: "/images/products/pr15.jpg", colorHex: "#FFA500" }, { url: "/images/products/pr12.svg", colorHex: "#008000" } ], sizes: ["S", "M"], collections: ["Dresses"], tags: ["Polka Dot", "Elegant"], salesCount: 110, dateAdded: "2023-09-01" },
  { id: 100, name: "Peaky Blinders Suit Set", price: "$100.00", priceValue: 100.00, brand: "FASCO Tailored", allColors: ["#36454F"], images: [{url: "/images/pk2.svg", colorHex: "#36454F"}], sizes: ["M", "L"], collections: ["Featured"], tags: ["Suit", "Formal", "Peaky Blinders"], salesCount: 25, dateAdded: "2023-11-01" },
];

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsletterSection from '../components/Newsletter';

const ChevronDownIcon: React.FC<{className?: string}> = ({className = "w-3 h-3"}) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /> </svg> );
const PlusIcon: React.FC<{className?: string}> = ({className = "w-3.5 h-3.5"}) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /> </svg> );
const MinusIcon: React.FC<{className?: string}> = ({className = "w-3.5 h-3.5"}) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /> </svg> );
const LayoutIcon: React.FC<{ lines: number, className?: string }> = ({ lines, className="w-4 h-4 text-gray-600 group-hover:text-black" }) => ( <svg viewBox="0 0 16 16" fill="currentColor" className={className}> {Array.from({ length: lines }).map((_, i) => ( <rect key={i} x={2 + i * (12/lines) + (i > 0 ? 0.5 : 0) } y="3" width={(12/lines) - (lines > 1 ? 0.5 : 0)} height="10" /> ))} </svg> );

const ColorSwatch: React.FC<{ color: string; selected?: boolean; className?: string; onClick?: () => void; isFilterSwatch?: boolean; }> = ({ color, selected, className, onClick, isFilterSwatch = false }) => ( <button type="button" onClick={onClick} className={`rounded-full focus:outline-none transition-all duration-150 border ${isFilterSwatch ? 'w-5 h-5' : 'w-4 h-4'} ${selected ? (isFilterSwatch ? 'ring-2 ring-offset-1 ring-black border-black' : 'ring-1 ring-offset-1 ring-gray-700 border-gray-500') : 'border-gray-300 hover:border-gray-400'} ${className}`} style={{ backgroundColor: color }} aria-label={`Color ${color}${selected ? ' (selected)' : ''}`} aria-pressed={selected} /> );
interface FilterSectionToggleProps { title: string; children: React.ReactNode; initiallyOpen?: boolean; }
const FilterSectionToggle: React.FC<FilterSectionToggleProps> = ({ title, children, initiallyOpen = true }) => { const [isOpen, setIsOpen] = useState(initiallyOpen); const isCollapsible = ['Brands', 'Collections'].includes(title); return ( <div className="py-3.5 border-b border-gray-200 last:border-b-0"> <div className="flex justify-between items-center mb-2.5"> <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">{title}</h3> {isCollapsible && ( <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-gray-700 p-0.5"> {isOpen ? <MinusIcon /> : <PlusIcon />} </button> )} </div> {(!isCollapsible || isOpen) && children} </div> ); };
interface FiltersSidebarProps { allAvailableColors: string[]; selectedFilterColor: string | null; onColorFilterChange: (color: string | null) => void; allAvailableBrands: string[]; selectedBrand: string | null; onBrandChange: (brand: string | null) => void; allAvailableSizes: string[]; selectedSize: string | null; onSizeChange: (size: string | null) => void; allAvailableCollections: string[]; selectedCollection: string | null; onCollectionChange: (collection: string | null) => void; allAvailableTags: string[]; selectedTag: string | null; onTagChange: (tag: string | null) => void; priceRanges: PriceRange[]; selectedPriceRangeLabel: string | null; onPriceRangeChange: (label: string | null) => void; }
const FiltersSidebar: React.FC<FiltersSidebarProps> = ({ allAvailableColors, selectedFilterColor, onColorFilterChange, allAvailableBrands, selectedBrand, onBrandChange, allAvailableSizes, selectedSize, onSizeChange, allAvailableCollections, selectedCollection, onCollectionChange, allAvailableTags, selectedTag, onTagChange, priceRanges, selectedPriceRangeLabel, onPriceRangeChange, }) => { const handleFilterClick = (currentSelected: string | null, value: string, setter: (val: string | null) => void) => { setter(currentSelected === value ? null : value); }; return ( <aside className="w-full lg:w-56 xl:w-60 shrink-0"> <h2 className="text-base font-semibold text-gray-900 mb-3">Filters</h2> <FilterSectionToggle title="Size"> <div className="flex flex-wrap gap-1.5"> {allAvailableSizes.map(size => ( <button key={size} type="button" onClick={() => handleFilterClick(selectedSize, size, onSizeChange)} className={`w-9 h-9 flex items-center justify-center border rounded-sm text-[11px] transition-colors ${selectedSize === size ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'}`}> {size} </button> ))} </div> </FilterSectionToggle> <FilterSectionToggle title="Colors"> <div className="grid grid-cols-8 gap-1.5"> {allAvailableColors.map(color => ( <ColorSwatch key={color} color={color} selected={color === selectedFilterColor} onClick={() => handleFilterClick(selectedFilterColor, color, onColorFilterChange)} isFilterSwatch={true}/> ))} </div> </FilterSectionToggle> <FilterSectionToggle title="Prices"> <ul className="space-y-1"> {priceRanges.map(range => ( <li key={range.label}> <button type="button" onClick={() => handleFilterClick(selectedPriceRangeLabel, range.label, onPriceRangeChange)} className={`text-[11px] text-left w-full py-0.5 ${selectedPriceRangeLabel === range.label ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'} focus:outline-none`}> {range.label} </button> </li> ))} </ul> </FilterSectionToggle> <FilterSectionToggle title="Brands" initiallyOpen={true}> <ul className="space-y-1"> {allAvailableBrands.map(brand => ( <li key={brand}> <button type="button" onClick={() => handleFilterClick(selectedBrand, brand, onBrandChange)} className={`text-[11px] text-left w-full py-0.5 ${selectedBrand === brand ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'} focus:outline-none`}> {brand} </button> </li> ))} </ul> </FilterSectionToggle> <FilterSectionToggle title="Collections" initiallyOpen={true}> <ul className="space-y-1"> {allAvailableCollections.map(collection => ( <li key={collection}> <button type="button" onClick={() => handleFilterClick(selectedCollection, collection, onCollectionChange)} className={`text-[11px] text-left w-full py-0.5 ${selectedCollection === collection ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'} focus:outline-none`}> {collection} </button> </li> ))} </ul> </FilterSectionToggle> <FilterSectionToggle title="Tags"> <div className="flex flex-wrap gap-1.5"> {allAvailableTags.map(tag => ( <button key={tag} type="button" onClick={() => handleFilterClick(selectedTag, tag, onTagChange)} className={`px-2 py-1 bg-gray-100 border border-transparent rounded-sm text-[10px] text-gray-600 hover:bg-gray-200 hover:text-black transition-colors ${selectedTag === tag ? '!bg-gray-700 !text-white' : '' }`}> {tag} </button> ))} </div> </FilterSectionToggle> </aside> ); };
const ProductCard: React.FC<{ product: Product; className?: string }> = ({ product }) => { const [currentImageInfo, setCurrentImageInfo] = useState<ProductImage | null>( product.images && product.images.length > 0 ? product.images[0] : null ); useEffect(() => { setCurrentImageInfo(product.images && product.images.length > 0 ? product.images[0] : null); }, [product.images]); const displayImageSrc = currentImageInfo?.url || PLACEHOLDER_IMAGE_URL; const displayAlt = `${product.name}${currentImageInfo?.colorHex ? ` - Color ${currentImageInfo.colorHex}` : ''}`; return ( <div className="group"> <Link href={`/product/${product.id}`} className="block cursor-pointer mb-2.5"> <div className="relative aspect-[0.78] bg-gray-100 overflow-hidden"> <Image src={displayImageSrc} alt={displayAlt} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover object-center group-hover:scale-105 transition-transform duration-300" key={displayImageSrc} onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE_URL; }} priority={product.id < 4} /> {product.soldOut && ( <div className="absolute top-2 right-2 bg-white text-black text-[9px] px-1.5 py-0.5 rounded-sm uppercase font-medium tracking-normal shadow-sm"> SOLD OUT </div> )} </div> </Link> <div className="text-left"> <Link href={`/product/${product.id}`} className="text-xs font-medium text-gray-700 hover:text-black truncate block mb-0.5"> {product.name} </Link> <p className="text-xs mb-1.5"> <span className="text-gray-900 font-semibold">{product.price}</span> {product.originalPrice && ( <span className="ml-1.5 line-through text-gray-400 text-[10px]">{product.originalPrice}</span> )} </p> {product.images && product.images.length > 0 && ( <div className="flex space-x-1"> {product.images.map((imageInfo) => ( <ColorSwatch key={imageInfo.url || imageInfo.colorHex} color={imageInfo.colorHex} selected={imageInfo.url === currentImageInfo?.url || (imageInfo.colorHex === currentImageInfo?.colorHex && !currentImageInfo?.url && !imageInfo.url)} onClick={() => setCurrentImageInfo(imageInfo)} /> ))} </div> )} </div> </div> ); };

// --- Peaky Blinders Pointer Data & Logic ---
interface PointerInfoPeaky {
  id: string;
  label: string;
  circlePosition: { top: string; left: string; };
  labelPosition: { top: string; left?: string; right?: string; };
  estimatedLabelWidth: string; // Crucial for line calculation
}

const pointersDataPeaky: PointerInfoPeaky[] = [
  {
    id: 'shop-flat-cap', label: 'Flat Cap',
    circlePosition: { top: '10%', left: '48%' },
    labelPosition: { top: '10%', right: '25%' }, // Label's right edge 25% from parent right
    estimatedLabelWidth: '60px',
  },
  {
    id: 'shop-hugo-boss-shirt', label: 'Hugo Boss',
    circlePosition: { top: '30%', left: '40%' },
    labelPosition: { top: '30%', right: '20%' },
    estimatedLabelWidth: '80px',
  },
  {
    id: 'shop-suspender', label: 'Suspender',
    circlePosition: { top: '33%', left: '37%' },
    labelPosition: { top: '33%', left: '5%' }, // Label's left edge 5% from parent left
    estimatedLabelWidth: '80px',
  },
  {
    id: 'shop-hugo-boss-trousers', label: 'Hugo Boss',
    circlePosition: { top: '60%', left: '40%' },
    labelPosition: { top: '60%', left: '2%' },
    estimatedLabelWidth: '80px',
  },
  {
    id: 'shop-santoni-shoes', label: 'Santoni',
    circlePosition: { top: '87%', left: '42%' },
    labelPosition: { top: '87%', left: '10%' },
    estimatedLabelWidth: '70px',
  }
];


const PromoSectionPeaky: React.FC = () => {
  const peakyBlindersProductId = 100; 
  const circleRadiusPx = 6; 

  return (
    <section className="overflow-hidden relative">
      <div className="absolute inset-0 z-0"
           style={{ backgroundColor: '#FFFFFF', clipPath: 'polygon(0 0, 55% 0, 45% 100%, 0% 100%)' }} />
      <div className="absolute inset-0 z-0"
           style={{ backgroundColor: '#E9E9E9', clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 45% 100%)' }} />

      <div
        className="absolute top-0 h-full bg-black z-10"
        style={{
          width: '2px',
          left: 'calc(50% - 1px)', 
          transform: 'skewX(-12.5deg)', 
        }}
      />

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-20">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-[52%] xl:w-[50%] relative lg:pr-8 xl:pr-12">
            <div className="relative mx-auto" style={{ maxWidth: '520px' }}> 
              <Image
                src="/images/pk2.svg" 
                alt="Peaky Blinders Style Model"
                width={520}
                height={680}
                className="object-contain w-full h-auto" 
              />
              {pointersDataPeaky.map((p) => {
                const isLabelLeftOfCircle = p.labelPosition.left !== undefined;
                const lineTopCss = `calc(${p.circlePosition.top} - 0.5px)`; 

                let lineLeftCss, lineWidthCss;

                if (isLabelLeftOfCircle) {
                  lineLeftCss = `calc(${p.labelPosition.left} + ${p.estimatedLabelWidth})`;
                  lineWidthCss = `calc((${p.circlePosition.left} - ${circleRadiusPx}px) - (${p.labelPosition.left} + ${p.estimatedLabelWidth}))`;
                } else {
                  lineLeftCss = `calc(${p.circlePosition.left} + ${circleRadiusPx}px)`;
                  lineWidthCss = `calc((100% - ${p.labelPosition.right} - ${p.estimatedLabelWidth}) - (${p.circlePosition.left} + ${circleRadiusPx}px))`;
                }

                return (
                  <React.Fragment key={p.id}>
                    <div className="absolute w-3 h-3 bg-white rounded-full z-30 border border-black"
                         style={{
                           top: p.circlePosition.top,
                           left: p.circlePosition.left,
                           transform: 'translate(-50%, -50%)'
                         }} />
                    <div className="absolute z-40 text-black bg-gray-200/90 border border-gray-400 shadow-md whitespace-nowrap px-2.5 py-1 rounded text-[10px] sm:text-xs pointer-events-none"
                         style={{
                           top: p.labelPosition.top,
                           left: p.labelPosition.left,
                           right: p.labelPosition.right,
                           transform: 'translateY(-50%)',
                           width: p.estimatedLabelWidth, 
                         }}>
                      {p.label}
                    </div>
                    <div className="absolute bg-black z-20 pointer-events-none"
                         style={{
                           top: lineTopCss,
                           left: lineLeftCss,
                           width: lineWidthCss,
                           height: '1px',
                         }}/>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="lg:w-[48%] xl:w-[50%] text-left lg:pl-8 xl:pl-12 pt-10 lg:pt-0"> 
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Women Collection</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800" style={{ fontFamily: '"Times New Roman", Times, serif' }}>Peaky Blinders</h2>
            <h3 className="text-sm font-semibold mb-2 text-gray-700 uppercase tracking-wider underline">DESCRIPTION</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis.
            </p>
            <div className="flex items-center mb-4">
              <span className="text-sm font-medium mr-3 text-gray-700">Size:</span>
              <button type="button" className="bg-black text-white text-xs w-8 h-8 flex items-center justify-center rounded">M</button>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-8">$100.00</p>
            <Link
              href={`/product/${peakyBlindersProductId}`}
              className="bg-black text-white font-semibold py-3 px-10 rounded hover:bg-gray-800 transition-colors text-sm uppercase tracking-wider"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};


interface InstagramItemConfig {
  aspect: string;
  isTall: boolean;
  applyShift: boolean;
}
const getInstagramItemConfig = (num: number): InstagramItemConfig => {
  if (num === 1 || num === 7) {
    return { aspect: 'aspect-[320/302]', isTall: false, applyShift: true };
  } else if ([2, 4, 6].includes(num)) {
    return { aspect: 'aspect-[256/380]', isTall: true, applyShift: false };
  } else {
    return { aspect: 'aspect-[256/302]', isTall: false, applyShift: true };
  }
};

export default function ShopPage() {
  const navbarHeight = "pt-16 md:pt-20";
  const [selectedFilterColor, setSelectedFilterColor] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('best-selling');
  const [activeLayoutCols, setActiveLayoutCols] = useState<number>(3);
  const [selectedPriceRangeLabel, setSelectedPriceRangeLabel] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const priceRangeOptions: PriceRange[] = useMemo(() => [ { label: "$0-$50", min: 0, max: 50 }, { label: "$50-$100", min: 50, max: 100 }, { label: "$100-$150", min: 100, max: 150 }, { label: "$150-$200", min: 150, max: 200 }, { label: "$200-$400", min: 200, max: 400 }, ], []);
  const allAvailableFilterColors = useMemo(() => Array.from(new Set(productsData.flatMap(p => p.allColors))).sort(), []);
  const allAvailableBrands = useMemo(() => Array.from(new Set(productsData.map(p => p.brand))).sort(), []);
  const allAvailableSizes = useMemo(() => Array.from(new Set(productsData.flatMap(p => p.sizes || []))).sort((a,b) => ['S','M','L','XL'].indexOf(a) - ['S','M','L','XL'].indexOf(b)), []);
  const allAvailableCollections = useMemo(() => Array.from(new Set(productsData.flatMap(p => p.collections || []))).sort(), []);
  const allAvailableTags = useMemo(() => Array.from(new Set(productsData.flatMap(p => p.tags || []))).sort(), []);
  const filteredProducts = useMemo(() => { let productsToShow = [...productsData]; if (selectedFilterColor) { productsToShow = productsToShow.filter(p => p.allColors.includes(selectedFilterColor)); } if (selectedSize) { productsToShow = productsToShow.filter(p => p.sizes?.includes(selectedSize)); } if (selectedBrand) { productsToShow = productsToShow.filter(p => p.brand === selectedBrand); } if (selectedCollection) { productsToShow = productsToShow.filter(p => p.collections?.includes(selectedCollection)); } if (selectedTag) { productsToShow = productsToShow.filter(p => p.tags?.includes(selectedTag)); } if (selectedPriceRangeLabel) { const activeRange = priceRangeOptions.find(r => r.label === selectedPriceRangeLabel); if (activeRange) { productsToShow = productsToShow.filter(p => p.priceValue >= activeRange.min && p.priceValue <= activeRange.max); } } switch (sortOption) { case 'price-low-high': productsToShow.sort((a, b) => a.priceValue - b.priceValue); break; case 'price-high-low': productsToShow.sort((a, b) => b.priceValue - a.priceValue); break; case 'newest': productsToShow.sort((a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime()); break; case 'best-selling': default: productsToShow.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)); break; } return productsToShow; }, [selectedFilterColor, selectedPriceRangeLabel, selectedBrand, selectedSize, selectedCollection, selectedTag, sortOption, priceRangeOptions]);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = useMemo(() => { const startIndex = (currentPage - 1) * productsPerPage; return filteredProducts.slice(startIndex, startIndex + productsPerPage); }, [filteredProducts, currentPage, productsPerPage]);
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => { setSortOption(event.target.value); setCurrentPage(1); };
  const handleLayoutChange = (cols: number) => { setActiveLayoutCols(cols); };
  const handlePageChange = (page: number) => { setCurrentPage(page); const productGridElement = document.getElementById('product-grid-section'); if (productGridElement) { window.scrollTo({ top: productGridElement.offsetTop - (parseInt(navbarHeight.substring(3)) * 4 || 80), behavior: 'smooth' }); } };
  useEffect(() => { setCurrentPage(1); }, [selectedFilterColor, selectedPriceRangeLabel, selectedBrand, selectedSize, selectedCollection, selectedTag]);
  const getGridColsClass = (layout: number): string => { switch (layout) { case 2: return "grid-cols-1 sm:grid-cols-2"; case 4: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"; case 3: default: return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"; } };
  const layoutOptions = [ { cols: 2, icon: <LayoutIcon lines={2} />, label: "View 2 columns" }, { cols: 3, icon: <LayoutIcon lines={3} />, label: "View 3 columns" }, { cols: 4, icon: <LayoutIcon lines={4} />, label: "View 4 columns" }, ];
  return ( <> <Navbar /> <main className={`flex-grow ${navbarHeight} bg-white`}> <div className="bg-white py-5 border-b border-gray-200"> <div className="container mx-auto px-4"> <div className="mb-0.5 text-[10px] text-gray-500 uppercase tracking-wider"> <Link href="/" className="hover:text-black">Home</Link> <span className="mx-1.5 text-gray-400" aria-hidden="true">/</span> <span>Fashion</span> </div> <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Fashion</h1> </div> </div> <div id="product-grid-section" className="container mx-auto px-4 py-6 md:py-8"> <div className="flex flex-col lg:flex-row gap-6 lg:gap-8"> <FiltersSidebar allAvailableColors={allAvailableFilterColors} selectedFilterColor={selectedFilterColor} onColorFilterChange={setSelectedFilterColor} allAvailableBrands={allAvailableBrands} selectedBrand={selectedBrand} onBrandChange={setSelectedBrand} allAvailableSizes={allAvailableSizes} selectedSize={selectedSize} onSizeChange={setSelectedSize} allAvailableCollections={allAvailableCollections} selectedCollection={selectedCollection} onCollectionChange={setSelectedCollection} allAvailableTags={allAvailableTags} selectedTag={selectedTag} onTagChange={setSelectedTag} priceRanges={priceRangeOptions} selectedPriceRangeLabel={selectedPriceRangeLabel} onPriceRangeChange={setSelectedPriceRangeLabel} /> <div className="w-full lg:flex-1"> <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3"> <div className="relative"> <select id="sort-by" name="sort-by" value={sortOption} onChange={handleSortChange} className="appearance-none bg-white border border-gray-300 rounded-sm px-2.5 py-1 text-[11px] text-gray-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 pr-6 cursor-pointer"> <option value="best-selling">Best selling</option> <option value="price-low-high">Price: Low to High</option> <option value="price-high-low">Price: High to Low</option> <option value="newest">Newest</option> </select> <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-400"> <ChevronDownIcon className="w-2.5 h-2.5"/> </div> </div> <div className="flex space-x-0.5 items-center"> {layoutOptions.map((opt) => ( <button key={opt.label} type="button" title={opt.label} onClick={() => handleLayoutChange(opt.cols)} className={`p-1.5 border rounded-sm group ${activeLayoutCols === opt.cols ? 'bg-gray-200 border-gray-300' : 'border-gray-300 hover:bg-gray-100'} transition-colors`}> {React.cloneElement(opt.icon, { className: `w-4 h-4 ${activeLayoutCols === opt.cols ? 'text-black' : 'text-gray-500 group-hover:text-black'}`})} </button> ))} </div> </div> {currentProducts.length > 0 ? ( <div className={`grid ${getGridColsClass(activeLayoutCols)} gap-x-4 gap-y-6`}> {currentProducts.map(product => <ProductCard key={product.id} product={product} />)} </div> ) : ( <div className="text-center py-12 text-gray-500"> <p className="text-lg mb-1">No products found</p> <p className="text-xs">Try adjusting your filters.</p> </div> )} {totalPages > 1 && ( <nav className="mt-8 md:mt-10 flex justify-center" aria-label="Pagination"> <ul className="flex space-x-1 items-center"> {currentPage > 1 && ( <li><button onClick={() => handlePageChange(currentPage - 1)} className="px-2.5 py-1 border border-gray-300 hover:bg-gray-100 rounded-sm text-[10px] font-medium text-gray-500 hover:text-gray-700">«</button></li> )} {[...Array(totalPages)].map((_, i) => { const pageNum = i + 1; return ( <li key={pageNum}><button onClick={() => handlePageChange(pageNum)} className={`px-2.5 py-1 rounded-sm text-[10px] font-medium border ${currentPage === pageNum ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`} aria-current={currentPage === pageNum ? 'page' : undefined}>{pageNum}</button></li> ); })} {currentPage < totalPages && ( <li><button onClick={() => handlePageChange(currentPage + 1)} className="px-2.5 py-1 border border-gray-300 hover:bg-gray-100 rounded-sm text-[10px] font-medium text-gray-500 hover:text-gray-700">»</button></li> )} </ul> </nav> )} </div> </div> </div>

        <PromoSectionPeaky />

        <section className="flex justify-center items-center py-8 md:py-10 bg-white border-t border-b border-gray-200">
          <Image
            src="/features.svg"
            alt="Features"
            width={800}
            height={56}
          />
        </section>

        <section className="w-full bg-white">
          <div className="mx-auto px-0">
            <div className="max-w-2xl mx-auto px-4 text-center py-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                Follow Us On Instagram
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sussurisque dolo<br />
                utthore colliductin ultiguam sem. Sussislique dolo utthore colliductin
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-0 auto-rows-auto items-start">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const config = getInstagramItemConfig(num);
                return (
                  <div
                    key={num}
                    className={`
                      group relative
                      overflow-hidden
                      ${config.aspect}
                      ${config.isTall ? 'md:row-span-2' : ''}
                      ${config.applyShift ? 'md:-mt-8 md:mb-8' : ''}
                      ${num === 1 && 'col-start-1'}
                    `}
                  >
                    <div className="h-full w-full">
                      <Image
                        src={`/gallery/${num}.svg`}
                        alt={`Instagram post ${num}`}
                        fill
                        style={{ objectFit: 'cover', transformOrigin: 'center center' }}
                        className="transition-transform duration-300 group-hover:scale-105"
                        sizes={
                          config.isTall
                            ? "(max-width: 767px) 50vw, (min-width: 768px) 14.28vw"
                            : "(max-width: 767px) 50vw, (min-width: 768px) 14.28vw"
                        }
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Tinos:wght@700&display=swap'); // Example for serif font
        /* You might want to define a more specific serif font if needed */
        .font-serif-display {
          font-family: 'Tinos', "Times New Roman", Times, serif; /* Fallback serif */
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </>
  );
}