'use client'; // Your Home component is already a client component due to useState, etc.

import React, { Suspense, useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// We will move useSearchParams and useRouter into the new component if they are only for scrolling.
// If useRouter is used for other things in Home, it can stay, but useSearchParams for scrolling must move.
import { useSearchParams, useRouter } from 'next/navigation'; // These will be primarily used by the new component

import TestimonialCarousel from './components/CarouselSlider';
import NewArrivalsSection from './components/Newarravials';
import NewsletterSection from './components/Newsletter';
import Footer from './components/Footer';

// ========================================================================
// ALL YOUR EXISTING COMPONENT DEFINITIONS (CountdownTimer, DealsImageRowSlider, etc.)
// AND HELPER FUNCTIONS (scrollToElementById, pointersDataPeaky, getInstagramItemConfig)
// REMAIN EXACTLY AS THEY ARE HERE. I AM NOT REMOVING OR CHANGING THEM.
// For example:
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: '02', hours: '06', minutes: '05', seconds: '30',
  });
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2); targetDate.setHours(targetDate.getHours() + 6);
    targetDate.setMinutes(targetDate.getMinutes() + 5); targetDate.setSeconds(targetDate.getSeconds() + 30);
    const timer = setInterval(() => {
      const now = new Date(); const difference = targetDate.getTime() - now.getTime();
      if (difference <= 0) { clearInterval(timer); setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' }); return; }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24)); const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)); const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({ days: String(days).padStart(2, '0'), hours: String(hours).padStart(2, '0'), minutes: String(minutes).padStart(2, '0'), seconds: String(seconds).padStart(2, '0'),});
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const labels = { days: 'Days', hours: 'Hr', minutes: 'Mins', seconds: 'Sec' };
  return (
    <div className="pt-6 md:pt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center md:text-left"> Hurry, Before It's Too Late! </h2>
      <div className="flex space-x-2 sm:space-x-3 justify-center md:justify-start">
        {(Object.keys(labels) as Array<keyof typeof timeLeft>).map((key) => (
          <div key={key} className="bg-white py-2.5 px-3 sm:py-3 sm:px-3.5 rounded-md shadow-sm border border-gray-200 text-center min-w-[60px] sm:min-w-[65px]">
            <div className="text-2xl sm:text-3xl font-bold text-gray-800 tabular-nums">{timeLeft[key]}</div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">{labels[key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DealsImageRowSlider = () => {
  const allDealItems = [
    { itemKey: 'deal-slider-1', src: '/s2.svg', alt: 'Brown Hoodie Deal', saleLabel: '30% OFF' },
    { itemKey: 'deal-slider-2', src: '/s3.svg', alt: 'Black Jacket Deal', saleLabel: '30% OFF' },
    { itemKey: 'deal-slider-3', src: '/s4.svg', alt: 'Orange Hoodie Deal', saleLabel: '30% OFF' },
  ];
  const totalRealItems = allDealItems.length; const gap = 12;
  const displayItems = totalRealItems > 0 ? [allDealItems[totalRealItems - 1], ...allDealItems, allDealItems[0]] : [];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(totalRealItems > 0 ? 1 : 0); const [isTransitioning, setIsTransitioning] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null); const [itemActualWidth, setItemActualWidth] = useState(0); const [viewportWidth, setViewportWidth] = useState(0);
  useEffect(() => { const sliderNode = sliderRef.current; if (!sliderNode) return; const parentElement = sliderNode.parentElement;  if (parentElement) { const roViewport = new ResizeObserver(([entry]) => setViewportWidth(entry.contentRect.width)); roViewport.observe(parentElement); setViewportWidth(parentElement.offsetWidth); return () => roViewport.unobserve(parentElement); } }, []);
  useEffect(() => { const sliderNode = sliderRef.current; if (sliderNode && sliderNode.children.length > 1 && totalRealItems > 0) {  const itemElement = sliderNode.children[1] as HTMLElement;  if (itemElement) { const roItem = new ResizeObserver(([entry]) => setItemActualWidth(entry.contentRect.width)); roItem.observe(itemElement); setItemActualWidth(itemElement.offsetWidth); return () => roItem.disconnect(); } } }, [totalRealItems]);
  const itemWidthWithGap = itemActualWidth > 0 ? itemActualWidth + gap : 0; let translateXValue = 0;
  if (itemWidthWithGap > 0 && viewportWidth > 0 && itemActualWidth > 0 && totalRealItems > 0) { const offsetToCenterItem = (viewportWidth - itemActualWidth) / 2; translateXValue = (currentSlideIndex * itemWidthWithGap) - offsetToCenterItem; }
  const logicalCurrentIndex = totalRealItems > 0 ? (currentSlideIndex - 1 + totalRealItems) % totalRealItems : 0;
  const handleNavigation = (direction: 'next' | 'prev') => { if (totalRealItems === 0) return; setIsTransitioning(true); setCurrentSlideIndex(prev => direction === 'next' ? prev + 1 : prev - 1); };
  useEffect(() => { if (totalRealItems === 0 || (!isTransitioning && (currentSlideIndex === 0 || currentSlideIndex === totalRealItems + 1))) return; if (currentSlideIndex === 0 || currentSlideIndex === totalRealItems + 1) { const timer = setTimeout(() => { setIsTransitioning(false);  setCurrentSlideIndex(currentSlideIndex === 0 ? totalRealItems : 1);  }, 500); return () => clearTimeout(timer); } else if (!isTransitioning) { const reenableTimer = setTimeout(() => setIsTransitioning(true), 50); return () => clearTimeout(reenableTimer); } }, [currentSlideIndex, totalRealItems, isTransitioning]);
  const renderItem = (itemData: { itemKey: string; src: string; alt: string; saleLabel: string; }, displayIdx: number) => { /* ... your renderItem logic ... */   if (!itemData) return null;
    const isEffectivelyActive = displayIdx === currentSlideIndex; let showSaleBox = false; let slotClasses = "relative flex-shrink-0 block w-[180px] sm:w-[220px] md:w-[200px] lg:w-[250px] xl:w-[280px] aspect-[3/4]"; let imageContainerClasses = "h-full w-full overflow-hidden rounded-lg bg-gray-100"; let priority = false; const relativePosFromCenter = displayIdx - currentSlideIndex;
    if (relativePosFromCenter === 0) { imageContainerClasses += " shadow-xl"; priority = true; showSaleBox = true; slotClasses += " scale-105 z-20"; } else if (Math.abs(relativePosFromCenter) === 1) { slotClasses += " scale-90 opacity-70 z-10"; imageContainerClasses += " shadow-lg"; } else { slotClasses += " scale-75 opacity-40 z-0"; }
    let uniqueKey = itemData.itemKey; if (displayIdx === 0) uniqueKey += "-clone-start"; if (displayIdx === displayItems.length - 1) uniqueKey += "-clone-end";
    return (
      <Link key={uniqueKey} href="/product/1001"> 
        <div className={slotClasses} style={{ marginRight: `${gap}px` }}>
          <div className={imageContainerClasses}>
            <Image src={itemData.src} alt={itemData.alt} fill style={{ objectFit: 'cover' }} priority={priority} sizes="(max-width: 640px) 180px, (max-width: 768px) 220px, (max-width: 1024px) 200px, (max-width: 1280px) 250px, 280px" />
          </div>
          {showSaleBox && isEffectivelyActive && (
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-md shadow-lg z-10 border border-gray-100">
              <div className="text-[10px] sm:text-[11px] font-medium text-gray-700 tracking-wide">{itemData.saleLabel}</div>
              <div className="text-sm sm:text-base text-gray-900 font-bold tracking-normal mt-0.5">Special Deal</div>
            </div>
          )}
        </div>
      </Link>
    );};
  if (totalRealItems === 0) return <div className="text-center py-10">No deals available right now.</div>;
  return ( <div className="relative w-full py-4">  <div className="overflow-hidden w-full"> <div ref={sliderRef} className="flex" style={{ transform: `translateX(-${translateXValue}px)`, transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none' }}> {displayItems.map((item, index) => renderItem(item, index))} </div> </div> {totalRealItems > 1 && (<> <button onClick={() => handleNavigation('prev')} aria-label="Previous group" className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-gray-700"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button> <button onClick={() => handleNavigation('next')} aria-label="Next group" className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-gray-700"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button> </>)} {totalRealItems > 1 && ( <div className="absolute bottom-[-35px] sm:bottom-[-40px] left-1/2 transform -translate-x-1/2 flex space-x-2 pt-4 z-10"> {allDealItems.map((_, index) => (<button key={`dot-${index}`} className={`h-2.5 w-2.5 rounded-full transition-all duration-150 ease-in-out focus:outline-none ${ logicalCurrentIndex === index ? 'bg-gray-800 scale-110' : 'bg-gray-300 hover:bg-gray-400' }`} onClick={() => { setIsTransitioning(true); setCurrentSlideIndex(index + 1); }} aria-label={`Go to group ${index + 1}`} />))} </div> )} </div> );
};
interface PointerInfoPeaky { id: string; label: string; circlePosition: { top: string; left: string; }; labelPosition: { top: string; left?: string; right?: string; }; hLineStyle: React.CSSProperties; vLineStyle: React.CSSProperties;}
const pointersDataPeaky: PointerInfoPeaky[] = [ { id: 'suspender', label: 'Suspender', circlePosition: { top: '32%', left: '39%' }, labelPosition: { top: '30%', left: '8%' }, hLineStyle: { position: 'absolute', top: 'calc(30% + 10px)', left: 'calc(8% + 70px)', width: 'calc(39% - (8% + 70px) - 4.5px)', height: '1px' }, vLineStyle: { position: 'absolute', top: 'calc(30% + 10px)', left: 'calc(39% - 4.5px)', width: '1px', height: 'calc(32% + 4.5px - (30% + 10px))' } }, { id: 'hugo-boss', label: 'Hugo Boss', circlePosition: { top: '62%', left: '37%' }, labelPosition: { top: '72%', left: '6%' }, hLineStyle: { position: 'absolute', top: 'calc(62% + 4.5px)', left: 'calc(6% + 80px)', width: 'calc(37% - (6% + 80px) - 4.5px)', height: '1px' }, vLineStyle: { position: 'absolute', top: 'calc(62% + 4.5px)', left: 'calc(6% + 80px)', width: '1px', height: 'calc(72% + 10px - (62% + 4.5px))' } }, { id: 'flat-cap', label: 'Flat Cap', circlePosition: { top: '14%', left: '47%' }, labelPosition: { top: '12%', right: '12%' }, vLineStyle: { position: 'absolute', top: 'calc(14% + 4.5px)', left: '47%', width: '1px', height: 'calc((12% + 10px) - (14% + 4.5px))' }, hLineStyle: { position: 'absolute', top: 'calc(12% + 10px)', left: '47%', width: 'calc((100% - 12% - 60px) - 47%)', height: '1px' }, }, { id: 'santori', label: 'Santori', circlePosition: { top: '87%', left: 'calc(44% - 4px)' }, labelPosition: { top: '82%', right: '8%' }, vLineStyle: { position: 'absolute', top: 'calc(82% + 10px)', left: 'calc(44% - 4px)', width: '1px', height: 'calc((87% + 4.5px) - (82% + 10px))' }, hLineStyle: { position: 'absolute', top: 'calc(82% + 10px)', left: 'calc(44% - 4px)', width: 'calc((100% - 8% - 65px) - (44% - 4px))', height: '1px' }} ];
interface InstagramItemConfig { aspect: string; isTall: boolean; applyShift: boolean; }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getInstagramItemConfig = (_num: number): InstagramItemConfig => { return { aspect: 'aspect-[320/302]', isTall: false, applyShift: true }; };

const scrollToElementById = (elementId: string, navbarOffset: number = 64) => {
  console.log(`[Homepage] Attempting to scroll to element with ID: ${elementId}`);
  const targetElement = document.getElementById(elementId);
  if (targetElement) {
    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    console.log(`[Homepage] Scrolled to ${elementId}`);
    return true;
  } else {
    console.warn(`[Homepage] Element with ID '${elementId}' not found in the DOM.`);
  }
  return false;
};
// ========================================================================


// --- NEW COMPONENT TO HANDLE SEARCH PARAMS AND SCROLLING ---
// This component is a Client Component because it uses useSearchParams
function PageNavigationManager() {
  const searchParams = useSearchParams(); // Hook that needs Suspense
  const router = useRouter(); // Hook that often accompanies useSearchParams for navigation

  useEffect(() => {
    const sectionIdToScroll = searchParams.get('scrollTo');
    if (sectionIdToScroll) {
      console.log(`[PageNavigationManager] Detected 'scrollTo' query parameter: ${sectionIdToScroll}`);
      const attemptScrollWithDelay = () => {
        const scrolled = scrollToElementById(sectionIdToScroll); // Using your existing function
        if (scrolled) {
          const currentPath = window.location.pathname;
          const newSearchParams = new URLSearchParams(searchParams.toString());
          newSearchParams.delete('scrollTo');
          const newUrl = newSearchParams.toString() ? `${currentPath}?${newSearchParams.toString()}` : currentPath;
          // Only replace if 'scrollTo' is actually in the URL's query string
          if (window.location.search.includes('scrollTo=')) {
            router.replace(newUrl, { scroll: false }); // { scroll: false } prevents Next.js from auto-scrolling
          }
        }
      };
      
      let animationFrameId: number | undefined;
      const tryScroll = () => {
        if (document.readyState === 'complete') {
            // A small delay can sometimes help ensure all DOM elements are fully ready for scroll calculations
            setTimeout(attemptScrollWithDelay, 50);
        } else {
            animationFrameId = requestAnimationFrame(tryScroll);
        }
      };
      // Initial delay before starting the requestAnimationFrame loop
      const timeoutId = setTimeout(() => {
        animationFrameId = requestAnimationFrame(tryScroll);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [searchParams, router]); // Dependencies for the useEffect

  return null; // This component does not render any UI itself
}


export default function Home() {
  // ALL YOUR EXISTING STATE AND REFS for the Home component remain here
  const [selectedPeakySize, setSelectedPeakySize] = useState<string>('M');
  const availablePeakySizes = ['S', 'M', 'L', 'XL'];

  // THE FOLLOWING LINES ARE MOVED to PageNavigationManager:
  // const searchParams = useSearchParams();
  // const router = useRouter(); // (if only used for scrolling logic)
  // useEffect(() => { /* ... your scrolling logic ... */ }, [searchParams, router]);

  return (
    <> {/* Using a fragment to avoid an extra div if Suspense is at the root */}
      {/* Wrap the component that uses useSearchParams in Suspense */}
      <Suspense fallback={null}> {/* Fallback can be null or a minimal loading UI */}
        <PageNavigationManager />
      </Suspense>

      {/* ALL YOUR EXISTING JSX FOR THE HOME PAGE REMAINS EXACTLY AS IS BELOW */}
      <main className="min-h-screen bg-white text-gray-900 pt-16">
        
        <section id="home-top-section" className="w-full py-16 px-4 flex justify-center bg-white">
          <div className="w-full flex justify-center py-10 px-4 bg-white">
            <div className="max-w-6xl w-full grid grid-cols-[minmax(200px,280px)_1fr_minmax(200px,280px)] gap-5 items-stretch">
              <div className="relative h-[650px]">
                <div className="absolute inset-0 bg-gray-100 rounded-xl"></div>
                <div className="absolute bottom-[-25px] left-0 right-0 h-[calc(100%+25px)] z-10">
                  <Image src="/dude.svg" alt="Man sitting on a box" layout="fill" objectFit="contain" objectPosition="bottom center" />
                </div>
              </div>
              <div className="flex flex-col h-[650px] space-y-5">
                <div className="relative w-full h-[180px] bg-gray-100 rounded-xl overflow-hidden">
                  <Image src="/quatro.svg" alt="Four women models" layout="fill" objectFit="cover" />
                </div>
                <div className="flex-grow flex flex-col items-center justify-center text-center px-4 space-y-3">
                  <h2 style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#374151', }}>ULTIMATE</h2>
                  <h2 style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: 'clamp(80px, 14vw, 150px)', lineHeight: 0.9, letterSpacing: '-0.04em', color: 'white', WebkitTextStroke: '1.5px #374151', paintOrder: 'stroke fill', }}>SALE</h2>
                  <p style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 500, fontSize: 'clamp(12px, 1.8vw, 16px)', lineHeight: 1, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280', paddingTop: '0.5rem', }}>NEW COLLECTION</p>
                  <Link href="/shop" className="bg-gray-800 text-white text-sm uppercase hover:bg-black transition-colors px-10 py-3.5 rounded-lg mt-4">Shop Now</Link>
                </div>
                <div className="relative w-full h-[150px] bg-pink-100 rounded-xl overflow-hidden">
                  <Image src="/hahaha.svg" alt="Two women models laughing" layout="fill" objectFit="cover" />
                </div>
              </div>
              <div className="relative h-[650px] bg-gray-100 rounded-xl overflow-hidden">
                <Image src="/cloth.svg" alt="Clothing items: sweater, jeans, shoes" layout="fill" objectFit="cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full h-[200px] bg-white">
          <div className="relative w-full h-full">
            <Image src="/logos.svg" alt="Brand logos" fill style={{ objectFit: 'contain' }} className="px-8" />
          </div>
        </section>

        <section id="deals-of-month-section" className="w-full py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-x-8 lg:gap-x-12 xl:gap-x-16 gap-y-10 items-center">
            <div className="space-y-5 md:space-y-6 text-center md:text-left">
              <h1 className="text-[32px] sm:text-[34px] font-bold text-gray-900 leading-tight">Deals Of The Month</h1>
              <div className="text-gray-600 text-[15px] leading-relaxed space-y-1.5">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p>Scelerisque duis ultrices sollicitudin aliquam sem.</p>
                <p>Scelerisque duis ultrices sollicitudin</p>
              </div>
              <Link
                href="/product/1001" 
                className="inline-block px-7 py-3 bg-gray-900 text-white rounded-md text-[14px] font-semibold tracking-normal hover:bg-gray-800 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Buy Now
              </Link>
              <CountdownTimer />
            </div>
            <div className="mt-6 md:mt-0">
              <DealsImageRowSlider /> 
            </div>
          </div>
        </section>

        <section id="new-arrivals-section">
          <NewArrivalsSection />
        </section>

        <div id="peaky-blinders-section" className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] overflow-hidden bg-black">
          <div className="absolute inset-0" style={{ backgroundColor: '#FEF2F2', clipPath: 'polygon(0 0, 62% 0, 48% 100%, 0% 100%)' }} />
          <div className="absolute inset-0" style={{ backgroundColor: '#FFEBEB', clipPath: 'polygon(62% 0, 100% 0, 100% 100%, 48% 100%)' }} />
          <div className="relative z-10 flex h-full max-w-7xl mx-auto">
            <div className="w-3/5 relative flex items-end justify-center pb-0 sm:pb-6 md:pb-10"> 
              <div className="relative w-[75%] sm:w-[70%] md:w-[65%] lg:w-[60%] h-[85%] sm:h-[90%] md:h-[95%] self-end">
                <Image src="/pb1.svg" alt="Peaky Blinders Outfit" layout="fill" objectFit="contain" objectPosition="bottom center" />
                {pointersDataPeaky.map((p) => ( <React.Fragment key={p.id}> <div className="absolute w-[9px] h-[9px] sm:w-2.5 sm:h-2.5 bg-white rounded-full z-30 border border-black" style={{ top: p.circlePosition.top, left: p.circlePosition.left, transform: 'translate(-50%, -50%)' }} /> <div className="absolute z-20 text-black bg-[#FBE9E7] border-2 border-black shadow-md whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm" style={{ top: p.labelPosition.top, left: p.labelPosition.left, right: p.labelPosition.right, transform: 'translateY(-50%)', backgroundColor: '#FBE9E7', }}>{p.label}</div> <div className="absolute bg-black z-10" style={{ ...(p.hLineStyle as React.CSSProperties), transform: `translateY(-${parseFloat(String(p.hLineStyle.height).replace('px','')) / 2}px)` }}/> <div className="absolute bg-black z-10" style={{ ...(p.vLineStyle as React.CSSProperties), transform: `translateX(-${parseFloat(String(p.vLineStyle.width).replace('px','')) / 2}px)` }}/> </React.Fragment> ))}
              </div>
            </div>
            <div className="w-2/5 flex flex-col justify-center pl-4 pr-6 sm:pl-6 sm:pr-8 md:pr-10 lg:pr-12 xl:pr-16 text-black">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 leading-tight">Peaky Blinders</h1>
              <h2 className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 sm:mb-1.5 border-b-[1.5px] border-gray-700 inline-block pb-0.5">DESCRIPTION</h2>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 mb-3 sm:mb-4 md:mb-5 leading-relaxed max-h-[80px] sm:max-h-[100px] md:max-h-[110px] overflow-y-auto pr-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis. Lorem ipsum dolor sit amet.</p>
              <div className="mb-3 sm:mb-4"> <span className="text-[10px] sm:text-xs md:text-sm text-gray-600 mr-2 sm:mr-3">Size:</span> {availablePeakySizes.map(size => (  <button key={size} onClick={() => setSelectedPeakySize(size)} className={`px-2 sm:px-2.5 py-1 sm:py-1.5 mr-1 sm:mr-1.5 rounded-sm text-[10px] sm:text-xs transition-colors duration-150 ${selectedPeakySize === size ? 'bg-black text-white font-medium' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{size}</button>))} </div>
              <div className="mb-4 sm:mb-5"><span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">99.99€</span></div>
              <Link
                href="/product/2001" 
                className="w-full max-w-[180px] sm:max-w-[200px] md:max-w-none sm:w-auto bg-black text-white text-xs sm:text-sm font-semibold px-6 py-2.5 sm:px-7 sm:py-3 rounded-md hover:bg-gray-800 transition-colors self-start"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      
        <br /><br />
        <section className="flex justify-center items-center">
          <Image src="/features.svg" alt="Features" width={800} height={56} />
        </section><br /><br />

        <section id="instagram-section" className="w-full bg-white">
          <div className="mx-auto px-0">
            <div className="max-w-2xl mx-auto px-4 text-center py-16"> <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Follow Us On Instagram</h2> <p className="text-gray-600 leading-relaxed"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sussurisque dolo<br /> utthore colliductin ultiguam sem. Sussislique dolo utthore colliductin </p> </div>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-0 auto-rows-auto items-start">  {[1, 2, 3, 4, 5, 6, 7].map((num) => { const config = getInstagramItemConfig(num); return ( <div key={num} className={`group relative overflow-hidden ${config.aspect} ${config.isTall ? 'md:row-span-2' : ''} ${config.applyShift ? 'md:-mt-8 md:mb-8' : ''} ${num === 1 && 'col-start-1'}`}> <div className="h-full w-full">  <Image src={`/gallery/${num}.svg`} alt={`Instagram post ${num}`} fill style={{ objectFit: 'cover', transformOrigin: 'center center' }} className="transition-transform duration-300 group-hover:scale-105" sizes={ config.isTall ? "(max-width: 767px) 50vw, (min-width: 768px) 14.28vw" : "(max-width: 767px) 50vw, (min-width: 768px) 14.28vw" } /> </div> <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"> <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"> <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/> </svg> </div> </div> );})}
            </div>
          </div>
        </section> 

        <section id="carousel-slider-section"> <TestimonialCarousel/> </section>
        <section id="newsletter-section"> <NewsletterSection/> </section>
        
        <Footer/>

        <style jsx global>{`
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        `}</style>
      </main>
    </>
  );
}