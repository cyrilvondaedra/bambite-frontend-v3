"use client";

import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Interface matching backend response
interface NewsItem {
  id: string;
  type: string;
  title: string;
  content: string | null;
  images: string[] | null;
  publishedAt: string;
}

interface NewsResponse {
  status: string;
  data: NewsItem[];
}

interface NewsDetailProps {
  slug: string;
}

export default function NewsDetail({ slug }: NewsDetailProps) {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch news item by slug
  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/news/slug/${slug}?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("News item not found");
          } else {
            setError("Failed to load news item");
          }
          return;
        }

        const result: NewsResponse = await response.json();
        // Get the first item from the array
        if (result.data && result.data.length > 0) {
          setNewsItem(result.data[0]);
        } else {
          setError("News item not found");
        }
      } catch (err) {
        console.error("Error fetching news item:", err);
        setError("Failed to load news item");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsItem();
  }, [slug]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen primary_background overflow-hidden">
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
        <Footer />
      </main>
    );
  }
  
  // Error state
  if (error || !newsItem) {
    return (
      <main className="min-h-screen primary_background overflow-hidden">
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || "News item not found"}
            </h1>
            <Link href="/news" className="text-secondary hover:underline">
              Back to News & Events
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen primary_background overflow-hidden">
      <Header />
      <div className="min-h-screen bg-background">
        {/* Back Navigation */}
        <div className="mx-auto max-w-4xl px-4 pt-24 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="flex items-center gap-2 text-secondary font-semibold w-fit hover:gap-3 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to News
          </Link>
        </div>

        <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-semibold text-secondary">
                {newsItem.type}
              </span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time dateTime={newsItem.publishedAt}>
                  {formatDate(newsItem.publishedAt)}
                </time>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {newsItem.title}
            </h1>
          </header>

          {/* Main Content */}
          {newsItem.content && (
            <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed mb-12">
              {newsItem.content.split("\n").map((paragraph, index) =>
                paragraph.trim() ? (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ) : null
              )}
            </div>
          )}

          {/* Images Gallery */}
          {newsItem.images && newsItem.images.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Gallery
              </h2>
              <div
                className={`grid gap-4 ${
                  newsItem.images.length === 1
                    ? "grid-cols-1"
                    : newsItem.images.length === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {newsItem.images.map((imgSrc, index) => (
                  <div
                    key={index}
                    className="relative aspect-video overflow-hidden rounded-lg"
                  >
                    <Image
                      src={imgSrc}
                      alt={`${newsItem.title} - Image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article Footer */}
          <footer className="border-t border-border pt-8">
            <div className="flex items-center justify-end">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all"
              >
                View All News & Events
                <span>→</span>
              </Link>
            </div>
          </footer>
        </article>
      </div>
      <Footer />
    </main>
  );
}
