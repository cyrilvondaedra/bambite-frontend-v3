"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import Image from "next/image";
import { events } from "@/lib/events";

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ["Festival", "Holiday", "Menu", "News"];
  const filteredEvents = selectedCategory
    ? events.filter((event) => event.category === selectedCategory)
    : events;

  return (
    <main className="min-h-screen primary_background overflow-hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold heading mt-20 sm:text-5xl">
              Upcoming Events & News
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sub_heading">
              Stay updated with our latest celebrations, seasonal menus, and
              exciting announcements.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-6 py-2 font-medium transition-all ${
                selectedCategory === null
                  ? "secondary_background text-secondary-foreground"
                  : "border border_border primary_background text-foreground hover:border-secondary"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-secondary text-secondary-foreground"
                    : "border border-border bg-background text-foreground hover:border-secondary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group overflow-hidden rounded-lg bg-card transition-all hover:border-secondary hover:shadow-lg"
              >
                {/* Gradient Banner */}
                {event.img.length > 0 && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={event.img[0]}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold sub_heading">
                      {event.category}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-bold heading">
                    {event.title}
                  </h3>

                  <div className="mb-4 flex items-center gap-2 text-sm sub_heading">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>

                  <p className="mb-6 sub_heading">{event.description}</p>

                  <div className="flex items-center justify-between">
                    <Link
                      href={`/news/${event.id}`}
                      className="inline-flex items-center gap-2 heading hover:gap-3 transition-all font-semibold"
                    >
                      Learn More
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </main>
  );
}
