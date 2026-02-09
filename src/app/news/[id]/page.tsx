"use client";

import { ArrowLeft, Calendar, MapPin, Check, Pen } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getEventById } from "@/lib/events";
import Image from "next/image";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = parseInt(params.id as string);
  const event = getEventById(eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Event not found
          </h1>
          <Link href="/news" className="text-secondary hover:underline">
            Back to News & Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="flex items-center gap-2 text-secondary font-semibold w-fit"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to News
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Banner */}

        <div className="relative aspect-video overflow-hidden mb-8">
          <Image
            src={event.img}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className=" object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary mb-3">
                {event.category}
              </span>
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
                {event.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:gap-6">
            {event.author && (
              <div className="flex items-center gap-2 heading">
                <Pen className="h-5 w-5" />
                <span>{event.author}</span>
              </div>
            )}
            <div className="flex items-center sub_heading gap-2">
              <Calendar className="h-5 w-5" />
              <span>{event.date}</span>
            </div>
            {event.details.time && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{event.details.time}</span>
              </div>
            )}
            {event.details.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{event.details.location}</span>
              </div>
            )}
          </div>

          <p className="text-lg text-foreground/80 leading-relaxed mb-8">
            {event.fullDescription}
          </p>
        </div>

        {/* Details Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Left Column */}

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Details</h2>
            <div className="space-y-4">
              {event.details.time && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    Time
                  </p>
                  <p className="text-foreground">{event.details.time}</p>
                </div>
              )}
              {event.details.totalPages && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    စာမျက်နှာ
                  </p>
                  <p className="text-foreground">{event.details.totalPages}</p>
                </div>
              )}
              {event.details.paperType && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    Paper Type
                  </p>
                  <p className="text-foreground">{event.details.paperType}</p>
                </div>
              )}
              {event.details.cover && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    Cover
                  </p>
                  <p className="text-foreground">{event.details.cover}</p>
                </div>
              )}
              {event.details.size && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    Size
                  </p>
                  <p className="text-foreground">{event.details.size}</p>
                </div>
              )}
              {event.details.publishedTime && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    Published Date
                  </p>
                  <p className="text-foreground">
                    {event.details.publishedTime}
                  </p>
                </div>
              )}
              {event.details.location && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    Location
                  </p>
                  <p className="text-foreground">{event.details.location}</p>
                </div>
              )}
              {event.details.capacity && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    Capacity
                  </p>
                  <p className="text-foreground">{event.details.capacity}</p>
                </div>
              )}
              {event.details.price && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    Price
                  </p>
                  <p className="text-2xl font-bold text-secondary">
                    {event.details.price}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          {event.details.highlights && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                {event.category === "News" ? "Book Includes" : "Highlights"}
              </h2>
              {event.details.highlights ? (
                <ul className="space-y-3">
                  {event.details.highlights?.map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <Check className="h-5 w-5 shrink-0 text-secondary mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {event.details.specialOffer && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Special Offer
                  </p>
                  <p className="text-foreground font-semibold">
                    {event.details.specialOffer}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="mb-12">
          {!event.author && (
            <button className="w-full rounded-lg primary_btn px-8 py-4 text-lg font-bold">
              {event.buttonText}
            </button>
          )}
          {event.author && (
            <a
              href="https://m.me/61581495755518"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <button className="w-full rounded-lg primary_btn px-8 py-4 text-lg font-bold">
                {event.buttonText}
              </button>
            </a>
          )}
        </div>

        {/* Related Events */}
        <div className="rounded-lg bg-card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Other Events
          </h2>
          <div className="text-muted-foreground">
            <p className="mb-4">
              Check out more exciting events and announcements.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-secondary hover:gap-3 transition-all font-semibold"
            >
              View All Events
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
