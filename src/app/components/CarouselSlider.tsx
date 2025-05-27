'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface Testimonial {
  text: string;
  author: string;
  role: string;
  image: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    text: "You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!",
    author: "James K.",
    role: "Traveler",
    image: "/c1.svg",
    rating: 5
  },
  {
    text: "The support team was incredibly responsive and helpful. Made the whole process a breeze!",
    author: "Maria S.",
    role: "Photographer",
    image: "/c2.svg",
    rating: 5
  },

  {
    text: "A truly game-changing product. I can't imagine going back to how things were before.",
    author: "Linda P.",
    role: "Blogger",
    image: "/c3.svg", 
    rating: 4
  }
];

const StarRating = ({ rating, starSize = "w-5 h-5" }: { rating: number, starSize?: string }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${starSize} ${i < rating ? 'text-orange-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const TestimonialCarousel = () => {
  const [current, setCurrent] = useState(0);
  const numTestimonials = testimonials.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % numTestimonials);
  }, [numTestimonials]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + numTestimonials) % numTestimonials);
  }, [numTestimonials]);

  const getCardStyles = (index: number) => {
    const offset = index - current;
    const total = numTestimonials;

    let normalizedOffset = offset;
    if (total > 1) {
        if (offset < -Math.floor(total / 2)) {
          normalizedOffset = offset + total;
        } else if (offset > Math.floor(total / 2)) {
          normalizedOffset = offset - total;
        }
    }

    let transformValue = '';
    let opacity = 0;
    let zIndex = 0;
    let boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)';

    
    const sideCardShift = '25%'; 

    if (normalizedOffset === 0) {
      transformValue = 'translateX(-50%) translateY(-50%) scale(1)';
      opacity = 1;
      zIndex = 20;
      boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
    } else if (normalizedOffset === -1 && total > 1) {
      transformValue = `translateX(calc(-50% - ${sideCardShift})) translateY(-50%) scale(0.85)`;
      opacity = 0.6; 
      zIndex = 10;
      boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)';
    } else if (normalizedOffset === 1 && total > 1) {
      transformValue = `translateX(calc(-50% + ${sideCardShift})) translateY(-50%) scale(0.85)`;
      opacity = 0.6; 
      zIndex = 10;
      boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)';
    } else {
      
      const farTranslateX = normalizedOffset < 0 ? `calc(-50% - ${sideCardShift} - 40%)` : `calc(-50% + ${sideCardShift} + 40%)`; // Increased far shift more
      transformValue = `translateX(${farTranslateX}) translateY(-50%) scale(0.7)`;
      opacity = 0; 
      zIndex = 0;
    }
    
    if (total === 1 && index === 0) {
        transformValue = 'translateX(-50%) translateY(-50%) scale(1)';
        opacity = 1;
        zIndex = 20;
        boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)';
    }

    return {
      transform: transformValue,
      opacity,
      zIndex,
      boxShadow,
      transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
    };
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-gray-50 overflow-x-hidden">
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-800 mb-3 sm:mb-4">
            This Is What Our Customers Say
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis
          </p>
        </div>

        <div className="relative h-[480px] sm:h-[450px] md:h-[420px] flex items-center justify-center">
          <div className="relative w-full h-full">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                
                className="absolute top-1/2 left-1/2 w-[90%] sm:w-[80%] md:w-[75%] lg:w-[70%] xl:w-[65%] bg-white rounded-xl p-6 md:p-8"
                style={{
                  ...getCardStyles(index),
                  transformOrigin: 'center center',
                }}
                aria-hidden={index !== current}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0 w-32 h-40 sm:w-36 sm:h-44 md:w-40 md:h-48 bg-gray-100 p-2 md:p-3 relative shadow-sm">
                    <div className="relative w-full h-full">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        fill
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, 160px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-center sm:text-left flex-grow">
                    <blockquote className="text-gray-700 mb-3 md:mb-4">
                      <p className="text-sm md:text-base lg:text-lg leading-relaxed italic">
                        `&quot;`{testimonial.text}`&quot;`
                      </p>
                    </blockquote>
                    <div className="flex justify-center sm:justify-start mb-3 md:mb-4">
                      <StarRating rating={testimonial.rating} starSize="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <hr className="my-3 md:my-4 border-gray-300 w-16 md:w-24 mx-auto sm:mx-0" />
                    <div>
                      <p className="font-serif text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">{testimonial.author}</p>
                      <p className="text-xs md:text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {numTestimonials > 1 && (
            <div className="flex justify-center mt-8 lg:mt-12 space-x-3">
            <button
                onClick={prevSlide}
                aria-label="Previous testimonial"
                className="bg-white hover:bg-gray-100 text-gray-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md hover:shadow-lg flex items-center justify-center transition-all text-xl sm:text-2xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
               ‹

 
            </button>
            <button
                onClick={nextSlide}
                aria-label="Next testimonial"
                className="bg-white hover:bg-gray-100 text-gray-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md hover:shadow-lg flex items-center justify-center transition-all text-xl sm:text-2xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
                ›
            </button>
            </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialCarousel;