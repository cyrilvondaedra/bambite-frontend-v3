"use client";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { MenuItem } from "@/types/api/menuItem";
import QuantityControls from "./QualityControls";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SingleMenuProps {
  menuItem: MenuItem;
}

export default function SingleMenu({ menuItem }: SingleMenuProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { updateQuantity } = useCart();

  const decreaseQuantity = (id: string) => {
    if (quantity > 1) setQuantity(quantity - 1);
    updateQuantity(id, quantity - 1);
  };

  const increaseQuantity = (id: string) => {
    setQuantity(quantity + 1);
    updateQuantity(id, quantity + 1);
  };
  console.log(menuItem);

  return (
    <section className="pt-32 pb-16 bg-(--color-background)">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full h-105 bg-(--color-foreground) rounded-lg overflow-hidden">
              <Image
                src={menuItem.imageUrls[selectedImage]}
                alt={menuItem.name}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {menuItem.imageUrls.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border transition-all
          ${selectedImage === index && "border-(--color-primary)"}`}
                >
                  <Image
                    src={img}
                    alt={`${menuItem.name} view ${index + 1}`}
                    fill
                    className="object-contain bg-muted"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-ultra-wide text-(--color-header2) mb-4">
              {menuItem.category.name}
            </p>

            <h1 className="font-serif text-(--color-header2) text-4xl md:text-5xl font-light mb-6">
              {menuItem.name}
            </h1>

            <p className="text-(--color-body) leading-relaxed mb-8">
              {menuItem.thaiName}
            </p>

            <p className="text-(--color-header2) leading-relaxed mb-8">
              {menuItem.description}
            </p>

            <div className="mb-4">
              {menuItem.productOptions.length > 0 &&
                menuItem.productOptions.map((opt) => (
                  <div key={opt.id} className="mb-4">
                    <p className="font-medium text-(--color-header2) mb-2">{opt.option.name}</p>

                    {opt.option.optionLists.length > 2 ? (
                      <Combobox items={opt.option.optionLists}>
                        <ComboboxInput
                          className="w-40 rounded-3xl border-(--color-header2) text-(--color-header2)"
                          placeholder={opt.option.optionLists[0]}
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>No items found.</ComboboxEmpty>
                          <ComboboxList className="rounded-3xl shadow-none">
                            {(item) => (
                              <ComboboxItem key={item} value={item}>
                                {item}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {opt.option.optionLists.map((list, i) => (
                          <label
                            key={i}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input type="radio" name={opt.id} value={list} />
                            <span>{list}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="mb-8">
              <span className="font-serif text-(--color-header2) text-3xl">฿{menuItem.price}</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <button
                  className="p-1 border rounded-lg border-(--color-primary) text-(--color-primary) hover:text-(--color-primary-foreground) hover:bg-(--color-primary)  transition-colors"
                  aria-label="Decrease quantity"
                  onClick={() => decreaseQuantity(menuItem.id)}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-(--color-header2) text-center text-sm">{quantity}</span>
                <button
                  className="p-1 rounded-lg  border border-(--color-primary) text-(--color-primary) hover:text-(--color-primary-foreground) hover:bg-(--color-primary)  transition-colors"
                  aria-label="Increase quantity"
                  onClick={() => increaseQuantity(menuItem.id)}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <QuantityControls item={menuItem} />
              <button
                onClick={() => router.push("/checkout")}
                className="w-50 flex items-center justify-center gap-2 p-2 bg-(--color-primary) text-(--color-primary-foreground) border border-(--color-primary) hover:border rounded-3xl text-xs tracking-wider transition-colors"
              >
                Buy Now
              </button>
            </div>

            <Accordion
              type="single"
              collapsible
              defaultValue="shipping"
              className="max-w-lg text-(--color-header2)"
            >
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-xl hover:no-underline">
                  What are your Ingredients?
                </AccordionTrigger>
                <AccordionContent className="text-(--color-header2)">{menuItem.ingredients}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
