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
    }, 5000); 

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative mx-auto mt-4 max-w-7xl overflow-hidden">
      {/* Main slider container */}
      <div className="relative h-[500px] md:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out
              ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* Left content */}
              <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="text-[#414141] max-w-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-12 h-[2px] bg-[#414141]"></div>
                    <p className="font-medium text-sm md:text-base">
                      {slide.subtitle}
                    </p>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
                    {slide.title}
                  </h1>

                  <div className="flex items-center gap-2 group cursor-pointer">
                    <p className="font-semibold text-sm md:text-base">
                      {slide.cta}
                    </p>
                    <div className="w-12 h-[2px] bg-[#414141] transition-all group-hover:w-16"></div>
                  </div>
                </div>
              </div>

              {/* Right image */}
              <div className="w-full md:w-1/2 h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all
              ${index === currentSlide ? "bg-[#414141] w-4" : "bg-gray-300"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
