"use client";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { MenuItem, MenuItemOption } from "@/types/api/menuItem";
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
  const [selectedImage, setSelectedImage] = useState(0);
  const { items, updateQuantity, updateOptions } = useCart();
  const cartItem = items.find((item) => item.productId === menuItem.id);

  const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
  const [selectedOptions, setSelectedOptions] = useState<{
    id: string;
    displayName: string;
    value: string;
  } | null>(null);

  // Zoom state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomPosition({ x: 50, y: 50 });
  };

  const decreaseQuantity = (id: string) => {
    if (quantity <= 1) {
      return;
    }
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    updateQuantity(id, newQuantity);
  };

  const increaseQuantity = (id: string) => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(id, newQuantity);
  };
  
  useEffect(() => {
    if (cartItem?.quantity !== undefined && cartItem.quantity !== quantity) {
      setQuantity(cartItem?.quantity);
    }
    if (cartItem?.selectedOptionsDisplay) {
      setSelectedOptions(cartItem?.selectedOptionsDisplay[0]);
    }
  }, [cartItem]);

  const handleOptionChange = (
    id: string,
    opt: MenuItemOption,
    value: string | null
  ) => {
    if (!value) return;

    if (!cartItem) return;

    setSelectedOptions({
      id: opt.optionId,
      displayName: opt.option.displayName,
      value: value,
    });

    updateOptions(cartItem.id, {
      id: opt.optionId,
      displayName: opt.option.displayName,
      value: value,
    });
  };

  return (
    <section className="pt-32 pb-16 primary_background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="relative w-full h-105 secondary_background rounded-lg overflow-hidden cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={menuItem.imageUrls[selectedImage]}
                alt={menuItem.name}
                fill
                className="object-cover transition-transform duration-150 ease-out"
                style={{
                  transform: isZoomed ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
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
          ${selectedImage === index && "primary_border"}`}
                >
                  <Image
                    src={img}
                    alt={`${menuItem.name} view ${index + 1}`}
                    fill
                    className="object-fill secondary_background"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="flex flex-col">
            <p className="text-xs uppercase sub_heading tracking-ultra-wide mb-4">
              {menuItem.category.name}
            </p>

            <h1 className="font-serif heading text-4xl md:text-5xl font-light mb-6">
              {menuItem.name}
            </h1>

            <p className="sub_heading leading-relaxed mb-8">
              {menuItem.thaiName}
            </p>

            <p className="sub_heading leading-relaxed mb-8">
              {menuItem.description}
            </p>

            <div className="mb-4">
              {menuItem.productOptions.length > 0 &&
                menuItem.productOptions.map((opt) => (
                  <div key={opt.id} className="mb-4">
                    <p className="font-medium sub_heading mb-2">
                      {opt.option.name}
                    </p>
                    {opt.option.optionLists.length > 2 ? (
                      <Combobox
                        items={opt.option.optionLists}
                        value={
                          selectedOptions?.id === opt.optionId
                            ? selectedOptions.value
                            : ""
                        }
                        onValueChange={(value) =>
                          handleOptionChange(menuItem.id, opt, value || "")
                        }
                      >
                        <ComboboxInput
                          className="w-40 rounded-3xl border border_border sub_heading"
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
                            <input
                              type="radio"
                              name={opt.optionId}
                              value={list}
                              checked={
                                selectedOptions?.id === opt.optionId &&
                                selectedOptions?.value === list
                              }
                              onChange={(e) =>
                                handleOptionChange(
                                  menuItem.id,
                                  opt,
                                  e.target.value
                                )
                              }
                            />
                            <span>{list}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="mb-8">
              <span className="font-serif sub_heading text-3xl">
                ฿{menuItem.price}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              {items.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 border rounded-lg border-(--color-primary) text-(--color-primary) hover:text-(--color-foreground) hover:bg-(--color-primary)  transition-colors"
                    aria-label="Decrease quantity"
                    onClick={() => decreaseQuantity(menuItem.id)}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 sub_heading text-center text-sm">
                    {quantity}
                  </span>
                  <button
                    className="p-1 rounded-lg  border border-(--color-primary) text-(--color-primary) hover:text-(--color-foreground) hover:bg-(--color-primary)  transition-colors"
                    aria-label="Increase quantity"
                    onClick={() => increaseQuantity(menuItem.id)}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <QuantityControls
                item={{ ...menuItem, quantity, selectedOptions }}
              />
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
              className="max-w-lg heading"
            >
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-xl hover:no-underline">
                  What are your Ingredients?
                </AccordionTrigger>
                <AccordionContent className="heading">
                  {menuItem.ingredients}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
