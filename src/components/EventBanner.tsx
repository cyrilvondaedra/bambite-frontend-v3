"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowRight, X } from "lucide-react";
import TimeBlock from "./Timeblock";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function EventBanner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const eventDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    date.setHours(19, 30, 0, 0); 
    return date;
  }, []);

  const eventTitle = "Exclusive Chef's Table Experience";

  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = eventDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <section
      className="fixed top-10 left-0 right-0 w-full py-2 z-50 bg-secondary mt-10"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* <div className="px-6 md:px-12 lg:px-20">
        <div className="relative overflow-hidden rounded-3xl border border_border px-6 py-4 md:py-2">
          <div className="pointer-events-none absolute inset-0 opacity-20 bg-secondary">
            <div className="absolute -top-16 -right-10 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_center,var(--color-primary),transparent_70%)]" />
            <div className="absolute -bottom-20 -left-8 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,var(--color-foreground),transparent_70%)]" />
          </div>

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] sub_heading2">
                Chef&apos;s Table Event
              </p>
              <p className="font-serif text-lg md:text-xl heading2">
                Winter Tasting Menu · Limited seats
              </p>
              <p className="text-sm heading2">
                Fridays &amp; Saturdays · 6–9 PM
              </p>
            </div>
            <a
              href="/contact_us"
              className="inline-flex w-fit items-center justify-center rounded-3xl border border_border px-6 py-2 text-xs uppercase tracking-[0.3em] secondary_btn transition-colors"
            >
              Reserve
            </a>
          </div>
        </div>
      </div> */}
      <div className="relative flex items-center justify-center py-2.5 px-4">
        <p className="text-xs md:text-sm heading2 tracking-wide flex items-center gap-2">
          <span className="heading2">{eventTitle}</span>
          <span className="primary_text">—</span>
          <span className="font-medium">
            {timeLeft.days}d {timeLeft.hours}h left
          </span>
          <ArrowRight size={14} className="ml-1" />
        </p>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-3 p-1 heading2 transition-colors"
          aria-label="Close banner"
        >
          <X size={14} />
        </button>
      </div>

      {/* Expanded State */}
      {isExpanded && (
        <div className="overflow-hidden">
          <div className="py-8 px-6 flex flex-col items-center gap-6">
            {/* Event title */}
            <p className="text-xs uppercase tracking-ultra-wide heading2">
              {eventTitle}
            </p>

            {/* Countdown */}
            <div className="flex items-center gap-4 md:gap-8">
              <TimeBlock value={timeLeft.days} label="Days" />
              <span className="heading2 text-2xl font-light">
                :
              </span>
              <TimeBlock value={timeLeft.hours} label="Hours" />
              <span className="heading2 text-2xl font-light">
                :
              </span>
              <TimeBlock value={timeLeft.minutes} label="Mins" />
              <span className="heading2 text-2xl font-light">
                :
              </span>
              <TimeBlock value={timeLeft.seconds} label="Secs" />
            </div>

            {/* CTA */}
            <a
              href="#reservations"
              className="text-xs uppercase tracking-ultra-wide primary_text border-b primary_border pb-1 hover:border-primary-foreground transition-colors flex items-center gap-2"
            >
              Reserve Your Spot
              <ArrowRight size={12} />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
