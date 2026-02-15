"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import Image from "next/image";

// Interface matching backend response
interface NewsItem {
  id: string;
  type: string;
  status: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  images: string[] | null;
  coverAlt: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface NewsResponse {
  status: string;
  data: NewsItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        // Build query with category filter if selected
        const typeParam = selectedCategory ? `&type=${selectedCategory.toUpperCase()}` : "";
        const response = await fetch(
          `/api/news?limit=1000&page=1${typeParam}&t=${Date.now()}`,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          }
        );
        
        if (!response.ok) throw new Error("Failed to fetch news");
        
        const result: NewsResponse = await response.json();
        setNewsItems(result.data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNewsItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory]);

  const categories = ["FESTIVAL", "HOLIDAY", "MENU", "NEWS"];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
          ) : newsItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No news items found.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {newsItems.map((news) => (
                <div
                  key={news.id}
                  className="group overflow-hidden rounded-lg bg-card transition-all hover:border-secondary hover:shadow-lg"
                >
                  {/* Cover Image */}
                  {news.coverImageUrl && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={news.coverImageUrl}
                        alt={news.coverAlt || news.title}
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
                        {news.type}
                      </span>
                    </div>

                    <h3 className="mb-2 text-xl font-bold heading">
                      {news.title}
                    </h3>

                    <div className="mb-4 flex items-center gap-2 text-sm sub_heading">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(news.publishedAt)}</span>
                    </div>

                    <p className="mb-6 sub_heading">{news.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <Link
                        href={`/news/${news.slug}`}
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
          )}
        </main>

        <Footer />
      </div>
    </main>
  );
}
