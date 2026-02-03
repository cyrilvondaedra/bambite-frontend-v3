"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Star, StarHalf } from "lucide-react";
import { fetchProductDetail } from "@/lib/table-order-api";
import { useTableOrder } from "@/contexts/TableOrderContext";
import type {
  ApiProductDetail,
  ApiProductOption,
} from "@/types/api/table-order";

function getProductOptions(product: ApiProductDetail): ApiProductOption[] {
  if (!product.productOptions?.length) return [];
  return product.productOptions.map((po) => po.option);
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className="w-5 h-5 fill-amber-400 text-amber-400"
        />
      ))}
      {hasHalfStar && (
        <StarHalf className="w-5 h-5 fill-amber-400 text-amber-400" />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="w-5 h-5 text-muted-foreground/30" />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useTableOrder();

  const tableId = params.tableId as string;
  const sectionId = params.sectionId as string;
  const productId = params.productId as string;

  const [product, setProduct] = useState<ApiProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [adding, setAdding] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductDetail(productId);
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load product",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product || adding) return;

    const options = getProductOptions(product);
    const hasOptions = options.length > 0;
    const optionsValid =
      !hasOptions ||
      options.every(
        (opt) =>
          selectedOptions[opt.id] &&
          opt.optionLists.includes(selectedOptions[opt.id]),
      );

    if (!optionsValid || product.stockQuantity < 1) return;

    setAdding(true);
    try {
      await addItem({
        productId: product.id,
        quantity,
        selectedOptions: hasOptions ? selectedOptions : undefined,
      });
      router.back();
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setAdding(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="p-4 md:p-6 space-y-6">
          <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
          <div className="space-y-3">
            <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
            <div className="h-20 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-destructive/20 text-destructive mb-4">
            <svg
              className="w-8 h-8 md:w-10 md:h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-2">
            {error || "Product not found"}
          </h2>
          <button
            onClick={goBack}
            className="mt-4 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-opacity-90 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const options = getProductOptions(product);
  const hasOptions = options.length > 0;
  const optionsValid =
    !hasOptions ||
    options.every(
      (opt) =>
        selectedOptions[opt.id] &&
        opt.optionLists.includes(selectedOptions[opt.id]),
    );
  const canAdd = product.stockQuantity > 0 && optionsValid;
  const imageUrl = product.imageUrls?.[selectedImageIndex] || "/noodleMenu.jpg";

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 md:px-6 py-4 flex items-center gap-4">
          <button
            onClick={goBack}
            className="p-2 hover:bg-muted rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
          </button>
          <h1 className="text-lg md:text-xl font-bold text-foreground truncate flex-1">
            Product Details
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Image Gallery - Left Column on Desktop */}
          <div className="lg:col-span-2 space-y-3">
            <div className="sticky top-24">
              <div className="relative w-full aspect-square bg-muted rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  unoptimized={imageUrl.startsWith("http")}
                  priority
                />
              </div>
            </div>
            {product.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.imageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                      idx === selectedImageIndex
                        ? "ring-2 ring-primary scale-105"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized={url.startsWith("http")}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Right Column on Desktop */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h2>
              {product.thaiName && (
                <p className="text-base md:text-lg text-muted-foreground">
                  {product.thaiName}
                </p>
              )}
            </div>

            {/* Rating */}
            {product.averageRating && product.totalReviews ? (
              <div className="flex items-center gap-3">
                <RatingStars rating={product.averageRating} />
                <span className="text-sm text-muted-foreground">
                  {product.averageRating.toFixed(1)} ({product.totalReviews}{" "}
                  reviews)
                </span>
              </div>
            ) : null}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl md:text-4xl font-bold text-primary">
                ฿ {parseFloat(product.price).toFixed(2)}
              </span>
              {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                <span className="text-sm text-amber-600 font-medium">
                  Only {product.stockQuantity} left
                </span>
              )}
              {product.stockQuantity === 0 && (
                <span className="text-sm text-destructive font-medium">
                  Out of stock
                </span>
              )}
            </div>

            {/* Category */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-muted text-muted-foreground text-sm rounded-full">
                {product.category.name}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                  Description
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                  Ingredients
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            )}

            {/* Options */}
            {hasOptions && (
              <div className="pt-4 border-t border-border space-y-4">
                <h3 className="text-base md:text-lg font-semibold text-foreground">
                  Customize Your Order
                </h3>
                {options.map((opt) => (
                  <div key={opt.id}>
                    <label className="text-sm md:text-base font-medium text-foreground block mb-2">
                      {opt.displayName}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {opt.optionLists.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() =>
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [opt.id]: val,
                            }))
                          }
                          className={`px-4 py-2.5 min-h-[44px] text-sm md:text-base rounded-xl border-2 transition-all touch-manipulation font-medium ${
                            selectedOptions[opt.id] === val
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "bg-muted/50 text-foreground border-border hover:border-primary/50 active:border-primary/70"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="pt-4 border-t border-border">
              <label className="text-sm md:text-base font-medium text-foreground block mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex items-center justify-center min-w-[48px] min-h-[48px] w-12 h-12 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground active:bg-primary/80 transition-colors touch-manipulation font-semibold text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[60px] text-center text-xl md:text-2xl font-bold text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                  }
                  className="flex items-center justify-center min-w-[48px] min-h-[48px] w-12 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-opacity-90 active:bg-opacity-80 transition-colors touch-manipulation font-semibold text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border p-4 md:p-6 shadow-2xl safe-area-bottom">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 flex items-center justify-between sm:justify-start sm:gap-6">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl md:text-3xl font-bold text-primary">
              ฿ {(parseFloat(product.price) * quantity).toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAdd || adding}
            className="px-8 py-4 min-h-[56px] bg-primary text-primary-foreground font-bold text-base md:text-lg rounded-xl hover:bg-opacity-90 active:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation shadow-lg whitespace-nowrap"
          >
            {adding ? "Adding to Cart…" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
