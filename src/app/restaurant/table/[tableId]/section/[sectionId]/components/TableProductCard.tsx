"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type {
  ApiProduct,
  ApiProductOption,
  ApiProductOptionWrapper,
} from "@/types/api/table-order";
import { useTableOrder } from "@/contexts/TableOrderContext";

function getProductOptions(product: ApiProduct): ApiProductOption[] {
  if (!product.productOptions?.length) return [];
  return product.productOptions.map((po) =>
    "option" in po && po.option
      ? po.option
      : (po as unknown as ApiProductOption),
  );
}

interface TableProductCardProps {
  product: ApiProduct;
}

export default function TableProductCard({ product }: TableProductCardProps) {
  const router = useRouter();
  const params = useParams();
  const { addItem } = useTableOrder();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [adding, setAdding] = useState(false);

  const tableId = params.tableId as string;
  const sectionId = params.sectionId as string;

  const options = getProductOptions(product);
  const hasOptions = options.length > 0;
  const optionsValid =
    !hasOptions ||
    options.every(
      (opt) =>
        selectedOptions[opt.id] &&
        opt.optionLists.includes(selectedOptions[opt.id]),
    );

  const imageUrl = product.imageUrls?.[0] || "/noodleMenu.jpg";
  const canAdd = product.stockQuantity > 0 && optionsValid;

  const handleAddToCart = async () => {
    if (!canAdd || adding) return;
    setAdding(true);
    try {
      await addItem({
        productId: product.id,
        quantity,
        selectedOptions: hasOptions ? selectedOptions : undefined,
      });
    } finally {
      setAdding(false);
    }
  };

  const viewDetails = () => {
    router.push(
      `/restaurant/table/${tableId}/section/${sectionId}/product/${product.id}`,
    );
  };

  return (
    <div className="flex flex-col gap-2.5 md:gap-3">
      <button
        onClick={viewDetails}
        className="relative w-full aspect-square bg-muted rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all group cursor-pointer touch-manipulation"
        aria-label={`View ${product.name} details`}
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          unoptimized={imageUrl.startsWith("http")}
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-medium text-foreground">
            View Details
          </span>
        </div>
      </button>

      <div className="flex flex-col gap-1.5 md:gap-2">
        <button
          onClick={viewDetails}
          className="text-left hover:text-primary transition-colors"
        >
          <h3 className="text-sm md:text-base lg:text-lg font-semibold text-foreground line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </button>
        {product.thaiName && (
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
            {product.thaiName}
          </p>
        )}
        {product.description && (
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        <p className="text-primary font-bold text-base md:text-lg">
          ฿ {parseFloat(product.price).toFixed(2)}
        </p>

        {hasOptions && (
          <div className="space-y-2 md:space-y-2.5">
            {options.map((opt) => (
              <div key={opt.id}>
                <label className="text-xs md:text-sm font-medium text-foreground block mb-1.5">
                  {opt.displayName}
                </label>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
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
                      className={`px-3 md:px-4 py-2 min-h-[40px] md:min-h-[44px] text-xs md:text-sm rounded-full border transition-colors touch-manipulation ${
                        selectedOptions[opt.id] === val
                          ? "bg-primary text-primary-foreground border-primary"
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-2">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground active:bg-primary/80 transition-colors touch-manipulation"
              aria-label="Decrease quantity"
            >
              <span className="text-lg">−</span>
            </button>
            <span className="min-w-[48px] text-center text-base md:text-lg font-semibold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuantity((q) => Math.min(product.stockQuantity, q + 1))
              }
              className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-primary text-primary-foreground hover:bg-opacity-90 active:bg-opacity-80 transition-colors touch-manipulation"
              aria-label="Increase quantity"
            >
              <span className="text-lg">+</span>
            </button>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAdd || adding}
            className="flex-1 py-3 px-4 min-h-[44px] bg-primary text-primary-foreground font-semibold text-sm md:text-base rounded-full hover:bg-opacity-90 active:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation whitespace-nowrap"
          >
            {adding ? "Adding…" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
