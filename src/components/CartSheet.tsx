"use client";

import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "./CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartSheet() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    open,
    setOpen,
  } = useCart();

  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="relative p-2 hover:bg-secondary transition-colors"
          aria-label="Open cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-(--color-primary) text-(--color-primary-foreground) text-xs flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl font-light">
            Your Order
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add items from the menu to get started
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-0">
              <div className="space-y-6 p-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b border-border p-4"
                  >
                    <div className="relative w-20 h-20 shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-lg">{item.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.description}
                      </p>
                      <p className="text-sm font-medium mt-1">฿{item.price}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        className="p-1 rounded-2xl text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Remove item"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 hover:text-red-500" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 border border-border rounded-lg bg-(--color-accent) text-(--color-text) hover:bg-(--color-accent/80) transition-colors"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          className="p-1 border border-border rounded-lg bg-(--color-accent) text-(--color-text) hover:bg-(--color-accent/80) transition-colors"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-4 px-5">
              <div className="flex justify-between text-lg">
                <span className="font-serif">Total</span>
                <span className="font-medium">
                  ฿ {totalPrice.toFixed(2) || 0.0}
                </span>
              </div>
              <Button
                onClick={() => router.push("/checkout")}
                className="w-full bg-primary rounded-xl mb-4 text-primary-foreground hover:bg-primary/90 py-6 text-sm tracking-wider uppercase"
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
