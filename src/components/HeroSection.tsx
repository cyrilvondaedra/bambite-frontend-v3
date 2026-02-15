"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

interface HeroSection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSection[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch hero sections from backend
  useEffect(() => {
    const fetchHeroSections = async () => {
      try {
        // Add cache-busting query parameter and no-cache header
        const response = await fetch(`/api/hero-sections?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch hero sections");
        const { data } = await response.json();
        // Sort by order and filter active ones
        const activeSlides = data
          .filter((slide: HeroSection) => slide.isActive)
          .sort((a: HeroSection, b: HeroSection) => a.order - b.order);
        setSlides(activeSlides);
        console.log("data", data);
      } catch (error) {
        console.error("Error fetching hero sections:", error);
        // Fallback to empty slides
        setSlides([]);
      }
    };

    fetchHeroSections();
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating],
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % (slides.length || 1));
  }, [currentSlide, goToSlide, slides.length]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + (slides.length || 1)) % (slides.length || 1));
  }, [currentSlide, goToSlide, slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Image Slider */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Blurred background */}
            <Image
              src={slide.imageUrl || "/placeholder.jpg"}
              alt=""
              fill
              className="object-cover scale-110 blur-xl"
              aria-hidden
            />

            {/* Main image */}
            <Image
              src={slide.imageUrl || "/placeholder.jpg"}
              alt={slide.title}
              fill
              className="object-contain"
              priority={index === 0}
            />

            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Content */}
      {/* <div className="relative z-20 w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-all duration-700 ease-out ${
                index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 absolute pointer-events-none"
              }`}
            >
              <p className="sub_heading text-sm tracking-[0.3em] uppercase mb-4 text-white/90">
                {slide.subheading}
              </p>
              <h1 className="heading font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-[1.2] text-balance text-white">
                {slide.heading}
              </h1>
              <p className="mt-8 sub_heading max-w-xl leading-relaxed text-white/90">
                {slide.description}
              </p>
            </div>
          ))}

          <div className="flex items-center gap-4 mt-10">
            {slides.map((slide, index) => (
              <a
                key={slide.id}
                href={slide.buttonLink}
                className={`inline-block secondary_btn border border-white/30 px-8 py-3 text-sm rounded-3xl tracking-wider uppercase transition-all duration-700 hover:bg-white/10 hover:border-white/50 text-white backdrop-blur-sm ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8 absolute pointer-events-none"
                }`}
              >
                {slide.buttonText}
              </a>
            ))}
          </div>
        </div>
      </div> */}
      <div className="relative z-20 w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl">
          <div className="relative min-h-100 md:min-h-125">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-out mt-20 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8 pointer-events-none"
                }`}
              >
                {slide.subtitle && (
                  <p className="sub_heading text-sm tracking-[0.3em] uppercase mb-4 text-white/90">
                    {slide.subtitle}
                  </p>
                )}
                <h1 className="heading font-serif text-4xl md:text-6xl lg:text-7xl font-light leading-[1.2] md:leading-[1.15] text-balance text-white">
                  {slide.title}
                </h1>
                {slide.description && (
                  <p className="mt-8 sub_heading max-w-xl leading-relaxed text-white/90">
                    {slide.description}
                  </p>
                )}
                {slide.buttonText && slide.buttonUrl && (
                  <div className="flex items-center gap-4 mt-10">
                    <a
                      href={slide.buttonUrl}
                      className="inline-block secondary_btn border border-white/30 px-8 py-3 text-sm rounded-3xl tracking-wider uppercase transition-all duration-300 hover:bg-white/10 hover:border-white/50 text-white backdrop-blur-sm"
                    >
                      {slide.buttonText}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 md:w-7 md:h-7 text-white transition-transform group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 md:w-7 md:h-7 text-white transition-transform group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`group relative transition-all duration-500 disabled:cursor-not-allowed ${
              index === currentSlide ? "w-12" : "w-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide}
          >
            {/* Background circle */}
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? "bg-white shadow-lg shadow-white/50"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />

            {/* Active indicator with progress animation */}
            {index === currentSlide && (
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div
                  className="h-full bg-white/50 origin-left animate-progress"
                  style={{
                    animation: "progress 5s linear",
                  }}
                />
              </div>
            )}

            {/* Hover tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/75 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none backdrop-blur-sm">
              {index + 1} / {slides.length}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
