"use client";

import Image from "next/image";

export default function AboutHeroSection() {

  return (
    <section className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 z-0"
      >
        <Image
          src="/noodleMenu.jpg"
          alt="BamBite kitchen with warm ambient lighting"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div
          className="max-w-4xl"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-primary-foreground/80">
            Our Story
          </p>
          <h1 className="font-serif text-5xl font-medium leading-tight text-primary-foreground md:text-7xl lg:text-8xl">
            BamBite
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/90 md:text-xl">
            Food is happiness, comfort, and connection
          </p>
        </div>
      </div>
    </section>
  );
}
