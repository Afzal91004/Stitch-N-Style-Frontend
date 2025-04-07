import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { assets } from "../assets/frontend_assets/assets";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smooth transition
    setTimeout(() => setLoading(false), 500);
  }, []);

  const slides = [
    {
      title: "Latest Arrivals",
      subtitle: "OUR BEST SELLERS",
      cta: "SHOP NOW",
      image: assets.hero_img1,
    },
    {
      title: "Summer Collection",
      subtitle: "NEW SEASON",
      cta: "DISCOVER MORE",
      image: assets.hero_img2,
    },
    {
      title: "Special Offers",
      subtitle: "LIMITED TIME",
      cta: "VIEW DEALS",
      image: assets.hero_img3,
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <div className="relative mx-auto pt-6 max-w-7xl overflow-hidden rounded-2xl shadow-lg">
        <div className="animate-pulse bg-gray-200">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-gray-100 p-6 md:p-12 min-h-64">
              <div className="space-y-4 md:space-y-6">
                <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                <div className="h-8 md:h-12 bg-gray-200 w-3/4 rounded"></div>
                <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
              </div>
            </div>
            <div className="w-full min-h-64 md:min-h-96 md:w-1/2 bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto pt-6 max-w-7xl overflow-hidden rounded-2xl shadow-lg">
      <div className="relative">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`transition-all duration-700 ease-in-out
              ${index === currentSlide ? "block" : "hidden"}`}
          >
            <div className="flex flex-col md:flex-row">
              {/* Left content */}
              <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-gradient-to-br from-white to-pink-50">
                <div className="text-gray-800 max-w-xl py-8 md:py-12">
                  <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                    <div className="w-8 md:w-12 h-[2px] bg-pink-600"></div>
                    <p className="text-sm md:text-base font-medium tracking-wide">
                      {slide.subtitle}
                    </p>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif mb-4 md:mb-8">
                    {slide.title}
                  </h1>

                  <button className="group flex items-center gap-2 md:gap-3 hover:gap-4 md:hover:gap-5 transition-all">
                    <span className="text-sm md:text-base font-semibold">
                      {slide.cta}
                    </span>
                    <div className="w-8 md:w-12 h-[2px] bg-pink-600 transition-all group-hover:w-12 md:group-hover:w-16" />
                  </button>
                </div>
              </div>

              {/* Completely redesigned image container */}
              <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4 h-auto min-h-96">
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-auto h-auto max-h-96 md:max-h-full object-contain"
                    style={{ maxWidth: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons with updated styling */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/90 hover:bg-white hover:shadow-lg transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/90 hover:bg-white hover:shadow-lg transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1 md:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all duration-300
              ${
                index === currentSlide
                  ? "bg-pink-600 w-4 md:w-6"
                  : "bg-gray-300 hover:bg-pink-300"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
