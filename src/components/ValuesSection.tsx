"use client";

import Image from "next/image";

const values = [
  {
    title: "Carefree Spirit, True to Bam",
    description:
      "BamBite stay true to ourselves, designed to brighten your day, lift your mood, and remind you not to take life too seriously. Bam's spirit guides us - carefree, happy, optimistic. We believe food should be fun, uplifting, and full of personality.",
    image: "/hero.jpg",
  },
  {
    title: "Connection through Food",
    description:
      "We bring people together through shared flavors and stories. Food is how we bring worlds, cultures, and generations together. Every dish is crafted to make people feel closer—no matter where they come from.",
    image: "/hero.jpg",
  },
  {
    title: "Innovation with Purpose",
    description:
      "We push creative boundaries to make every flavor and experience feel meaningful. Through thoughtful research, experimentation, and intentional recipe design, we transform inspiration into dishes that surprise and delight.",
    image: "/hero.jpg",
  },
  {
    title: "Quality with Consistency",
    description:
      "From ingredient sourcing to packaging and shelf-life, BamBite ensures every bite meets the same high standard of taste, safety, and design, wherever it's enjoyed.",
    image: "/hero.jpg",
  },
];

export default function ValuesSection() {
  return (
    <section className="card py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center md:mb-24">
          <span className="mb-4 inline-block text-sm font-medium uppercase tracking-[0.2em] sub_heading">
            Our Values
          </span>
          <h2 className="font-serif text-4xl font-medium heading md:text-5xl">
            What We Stand For
          </h2>
        </div>

        {/* Values Grid */}
        <div className="space-y-20 md:space-y-32">
          {values.map((value, index) => (
            <ValueCard key={value.title} value={value} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueCard({ value ,index}: { value: (typeof values)[0]; index: number }) {
  const isEven = index % 2 === 0;
  return (
    <div
      className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
        isEven ? "" : "lg:grid-flow-dense"
      }`}
    >
      <div
        className={`relative aspect-4/3 overflow-hidden rounded-2xl transition-all duration-1000 ${
          isEven ? "lg:col-start-1" : "lg:col-start-2"
        }`}
      >
        <Image
          src={value.image}
          alt={value.title}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/20 to-transparent" />
      </div>

      {/* Content */}
      <div
        className={`transition-all delay-200 duration-1000 ${
          isEven ? "lg:col-start-2" : "lg:col-start-1"
        } `}
      >
        <h3 className="mb-4 font-serif text-3xl font-medium sub_heading md:text-4xl">
          {value.title}
        </h3>
        <p className="text-lg leading-relaxed body">
          {value.description}
        </p>
      </div>
    </div>
  );
}
