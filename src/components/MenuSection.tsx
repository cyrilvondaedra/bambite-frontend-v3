"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MenuItem } from "@/types/api/menuItem";
import QuantityControls from "@/components/QualityControls";
import Link from "next/link";

export default function MenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const quantity = 1;
  const selectedOptions = null;

  useEffect(() => {
    const fetchMenuItems = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/products?page=1&limit=4",
      );
      const data = await response.json();
      setMenuItems(data.data);
    };
    fetchMenuItems();
  }, []);

  return (
    <section
      id="menu"
      className="py-24 secondary_background heading2 md:py-32 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-serif text-4xl heading2 font-medium leading-tight md:text-5xl lg:text-6xl text-balance mb-4">
            BamBite Menu
          </p>
          <h2 className="font-serif text-xl heading2 ">
            All the best in one place
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
          {menuItems.length > 0 &&
            menuItems.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col h-full card p-1 rounded-md"
              >
                <Link
                  href={`/menu/${item.id}`}
                  className="relative aspect-square overflow-hidden mb-2"
                >
                  <Image
                    src={item.imageUrls[0]}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </Link>
                <div className="flex flex-col flex-1 p-2">
                  <div className="flex-1">
                    <Link
                      href={`/menu/${item.id}`}
                      className="font-serif text-xl mb-2 heading"
                    >
                      {item.name}
                    </Link>
                    <p className="font-serif text-sm mb-2 heading">
                      {item.thaiName}
                    </p>
                    <p className="heading text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 heading">
                    <div className="flex flex-col sm:flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
                      <span className="font-serif text-lg heading">{`฿${item.price}`}</span>
                      <div className="w-full md:w-auto">
                        <QuantityControls
                          item={{ ...item, quantity, selectedOptions }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="/menus"
            className="inline-block px-8 py-3 secondary_btn text-sm tracking-wider uppercase rounded-4xl transition-all duration-300"
          >
            View Full Menu
          </a>
        </div>
      </div>
    </section>
  );
}
