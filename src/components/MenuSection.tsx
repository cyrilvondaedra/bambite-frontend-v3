"use client";

import Image from "next/image";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";
import { useEffect, useState } from "react";
import { MenuItem } from "@/types/api/menuItem";

function QuantityControls({ item }: { item: MenuItem }) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      id: item.id,
      title: item.name,
      description: item.description,
      price: item.price,
      image: item.imageUrls[0],
    });
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      updateQuantity(item.id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity === 0) {
      handleAdd();
    } else {
      updateQuantity(item.id, quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {quantity === 0 ? (
        <button
          onClick={handleAdd}
          className="flex items-center text-xs gap-2 p-2 bg-transparent text-(--color-primary) border border-(--color-primary) rounded-3xl tracking-wider hover:bg-(--color-accent) transition-colors"
          aria-label={`Add ${item.name} to cart`}
        >
          <ShoppingCart className="w-4 h-4" />
          Add To Cart
        </button>
      ) : (
        <div className="flex items-center gap-1">
          {/* <button
            onClick={handleDecrease}
            className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={handleIncrease}
            className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button> */}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 p-2 bg-transparent text-(--color-primary) border border-(--color-primary) hover:border hover:bg-(--color-accent) rounded-3xl text-xs tracking-wider transition-colors"
            aria-label={`Add ${item.name} to cart`}
          >
            {/* <ShoppingCart className="w-4 h-4" /> */}
            View Cart
          </button>
        </div>
      )}
    </div>
  );
}

export default function MenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchMenuItems = async () => {
      let allMenuItems: MenuItem[] = [];
      if (selectedCategory === "all") {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/products?page=1&limit=10",
        );
        const data = await response.json();
        allMenuItems = data.data;
        setMenuItems(allMenuItems);
      } 
      else {
        const filteredItems = allMenuItems.filter(
          (item) => item.category.id === selectedCategory,
        );
        setMenuItems(filteredItems);
      }
    };
    fetchMenuItems();
  }, [selectedCategory]);
  console.log("menuItems", menuItems);

  return (
    <section
      id="menu"
      className="py-24 bg-(--color-primary) text-(--color-primary-foreground) md:py-32 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.2em] md:text-4xl lg:text-5xl uppercase text-(--color-primary-foreground) mb-4">
            BamBite Menu
          </p>
          <h2 className="font-serif text-xl">All the best in one place</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col h-full bg-(--color-background) p-1 rounded-md"
            >
              <div className="relative aspect-square overflow-hidden mb-2">
                <Image
                  src={item.imageUrls[0]}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-2">
                <div className="flex-1">
                  <h3 className="font-serif text-xl mb-2 text-(--color-title)">
                    {item.name}
                  </h3>
                  <p className="font-serif text-sm mb-2 text-(--color-title)">
                    {item.thaiName}
                  </p>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 mt-4 text-(--color-title)">
                  <span className="font-serif text-lg">฿{item.price}</span>
                  <QuantityControls item={item} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="#reserve"
            className="inline-block px-8 py-3 bg-(--color-primary-foreground) text-(--color-primary) text-sm tracking-wider uppercase hover:bg-(--color-primary) hover:text-(--color-primary-foreground) hover:border hover:border-(--color-primary-foreground) rounded-4xl transition-all duration-300"
          >
            View Full Menu
          </a>
        </div>
      </div>
    </section>
  );
}
