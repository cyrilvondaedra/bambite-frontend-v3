"use client";

import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    quote:
      "An extraordinary dining experience. Every dish was a masterpiece, and the attention to detail was impeccable.",
    author: "Sarah Mitchell",
    title: "Food Critic, The Dining Review",
  },
  {
    id: 2,
    quote:
      "TERROIR has redefined my expectations of modern cuisine. The flavors are bold yet refined.",
    author: "James Chen",
    title: "Executive Chef, Le Jardin",
  },
  {
    id: 3,
    quote:
      "From the moment we walked in, we knew this would be special. An unforgettable culinary journey.",
    author: "Elena Rodriguez",
    title: "Travel & Lifestyle Editor",
  },
  {
    id: 4,
    quote:
      "The perfect blend of tradition and innovation. Each course tells a story of passion and craftsmanship.",
    author: "Michael Torres",
    title: "Culinary Director, Gourmet Magazine",
  },
  {
    id: 5,
    quote:
      "A true gem. The seasonal menu showcases the best local ingredients with stunning presentation.",
    author: "Anna Bergström",
    title: "Michelin Guide Inspector",
  },
  {
    id: 6,
    quote:
      "Exceptional service and an atmosphere that transports you. Worth every visit.",
    author: "David Park",
    title: "Restaurant Reviewer, City Weekly",
  },
];

const CARDS_PER_SLIDE = 3;
const AUTO_SLIDE_INTERVAL = 5000;

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(testimonials.length / CARDS_PER_SLIDE);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const getCurrentSlideItems = () => {
    const startIndex = currentSlide * CARDS_PER_SLIDE;
    return testimonials.slice(startIndex, startIndex + CARDS_PER_SLIDE);
  };

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-(--color-background)">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          {/* <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Feedbacks
          </p> */}
          <h2 className="font-serif text-(--color-header1) text-4xl font-medium leading-tight md:text-5xl lg:text-6xl text-balance">
            What our customers say
          </h2>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {getCurrentSlideItems().map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-(--color-header1) p-8 flex flex-col rounded-xl border border-(--color-border)"
              >
                <blockquote className="font-serif text-lg leading-relaxed text-(--color-body) mb-6 flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="border-t border-(--color-primary) pt-6">
                  <p className="text-(--color-body) font-medium">
                    {testimonial.author}
                  </p>
                  <p className="text-(--color-body) text-sm mt-1">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-12">
            {/* <button
              onClick={goToPrevious}
              className="w-12 h-12 flex items-center justify-center border border-border hover:bg-foreground hover:text-background transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button> */}

            <div className="flex gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 transition-colors rounded-full ${
                    index === currentSlide
                      ? "bg-(--color-primary)"
                      : "bg-(--color-header2)"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* <button
              onClick={goToNext}
              className="w-12 h-12 flex items-center justify-center border border-border hover:bg-foreground hover:text-background transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
}
