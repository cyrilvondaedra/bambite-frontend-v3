"use client";

import { useMemo } from "react";
import TableProductCard from "./TableProductCard";
import type { ApiProduct } from "@/types/api/table-order";

interface TableProductGridProps {
  products: ApiProduct[];
  categoryId: string | null;
  searchQuery: string;
  isLoading?: boolean;
}

export default function TableProductGrid({
  products,
  categoryId,
  searchQuery,
  isLoading,
}: TableProductGridProps) {
  const filteredProducts = useMemo(() => {
    let list = products;

    if (categoryId) {
      list = list.filter((p) => p.category?.id === categoryId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.thaiName && p.thaiName.includes(searchQuery)),
      );
    }

    return list;
  }, [products, categoryId, searchQuery]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
            <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-16 md:py-20">
        <p className="text-muted-foreground text-base md:text-lg">
          No products found
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {filteredProducts.map((product) => (
        <TableProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
