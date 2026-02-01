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

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none), (pointer: coarse)").matches;

  return (
    <section
      className="fixed top-10 left-0 right-0 w-full z-20 xl:z-50 bg-secondary mt-10"
      onMouseEnter={() => {
        if (!isTouch) setIsExpanded(true);
      }}
      onMouseLeave={() => {
        if (!isTouch) setIsExpanded(false);
      }}
      onClick={() => {
        if (isTouch) setIsExpanded((v) => !v);
      }}
    >
      <div className="relative flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5">
        <p
          className="
      flex flex-wrap items-center justify-center gap-x-2 gap-y-1
      text-xs sm:text-sm
      heading2 tracking-wide
      text-center
      pr-8
    "
        >
          <span className="heading2">{eventTitle}</span>

          <span className="primary_text hidden sm:inline">—</span>

          <span className="font-medium whitespace-nowrap">
            {timeLeft.days}d {timeLeft.hours}h left
          </span>

          <ArrowRight size={14} className="hidden sm:inline ml-1" />
        </p>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-2 sm:right-3 p-1 heading2 transition-colors"
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
              <span className="heading2 text-2xl font-light">:</span>
              <TimeBlock value={timeLeft.hours} label="Hours" />
              <span className="heading2 text-2xl font-light">:</span>
              <TimeBlock value={timeLeft.minutes} label="Mins" />
              <span className="heading2 text-2xl font-light">:</span>
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
