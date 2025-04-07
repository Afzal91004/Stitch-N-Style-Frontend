import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { assets } from "../assets/frontend_assets/assets";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    }, 6000); // Increased time slightly for better user experience

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative mx-auto pt-8 max-w-7xl overflow-hidden rounded-3xl shadow-xl">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-pink-100 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-60 z-0"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-100 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl opacity-60 z-0"></div>

      <div className="relative h-[650px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out
              ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <div className="flex h-full flex-col md:flex-row">
              {/* Left content */}
              <div className="w-full md:w-1/2 flex items-center justify-center p-12 bg-gradient-to-br from-white via-pink-50 to-indigo-50">
                <div className="text-gray-800 max-w-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-[2px] bg-gradient-to-r from-pink-400 to-transparent"></div>
                    <p className="font-medium tracking-widest text-pink-600">
                      {slide.subtitle}
                    </p>
                  </div>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif mb-10 leading-tight relative">
                    <span className="relative z-10">{slide.title}</span>
                    <span className="absolute -bottom-3 left-0 w-1/2 h-3 bg-pink-200 opacity-60 -z-10"></span>
                  </h1>

                  <p className="text-gray-600 mb-8 max-w-lg">
                    Discover our carefully curated selection designed for those
                    who appreciate quality and style.
                  </p>

                  <button className="group flex items-center gap-3 hover:gap-5 transition-all bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg">
                    <span className="font-semibold">{slide.cta}</span>
                    <div className="w-10 h-[2px]  bg-gradient-to-r from-gray-800 to-transparent transition-all group-hover:w-12" />
                  </button>
                </div>
              </div>

              {/* Right image with decorative elements */}
              <div className="w-full md:w-1/2 h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover transition-transform duration-5000 hover:scale-105"
                />
                {/* Decorative elements */}
                <div className="absolute top-6 right-6 w-16 h-16 border-2 border-white/30 rounded-full z-10"></div>
                <div className="absolute bottom-16 left-6 w-24 h-24 border-2 border-white/30 rounded-full z-10"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons with improved styling */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/80 hover:bg-white hover:shadow-xl hover:scale-110 transition-all border border-gray-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/80 hover:bg-white hover:shadow-xl hover:scale-110 transition-all border border-gray-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Improved slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3 p-2 bg-white/30 backdrop-blur-md rounded-full">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full
              ${
                index === currentSlide
                  ? "bg-pink-600 w-10 h-2"
                  : "bg-gray-300 w-2 h-2 hover:bg-pink-400"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Current slide number indicator */}
      <div className="absolute top-8 right-8 z-20 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-gray-700">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default Hero;
