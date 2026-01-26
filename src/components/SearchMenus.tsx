"use client";
import Image from "next/image";
import QuantityControls from "@/components/QualityControls";
import Link from "next/link";
import { MenuItem } from "@/types/api/menuItem";

interface SearchMenusProps {
  SearchMenus: MenuItem[];
}

export default function SearchMenus({ SearchMenus }: SearchMenusProps) {
  return (
    <section className="py-12 md:py-16 bg-(--color-background)">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
          {SearchMenus.length > 0 ? (
            SearchMenus.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col h-full bg-(--color-background) p-1 rounded-md"
              >
                <div className="relative aspect-square overflow-hidden mb-2">
                  <Image
                    src={item.imageUrls[0]}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="flex flex-col flex-1 p-2">
                  <div className="flex-1">
                    <h3 className="font-serif text-xl mb-2 text-(--color-header1)">
                      {item.name}
                    </h3>
                    <p className="font-serif text-sm mb-2 text-(--color-header1)">
                      {item.thaiName}
                    </p>
                    <p className="text-(--color-header1) text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 text-(--color-title)">
                    <div className="flex flex-col sm:flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
                      <span className="font-serif text-(--color-header2) text-lg">{`฿${item.price}`}</span>
                      <div className="w-full md:w-auto">
                        <QuantityControls item={item} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center">
              <p className="text-center text-muted-foreground text-lg">
                No search results found.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
