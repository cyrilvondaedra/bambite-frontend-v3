"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function CartSheet() {
  //   const totalPrice = 0;
  const { items, totalItems, totalPrice, updateQuantity, removeItem } =
    useCart();
    
  return (
    <Sheet>
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

        {/* {items.length === 0 ? ( */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add items from the menu to get started
          </p>
        </div>
        {/* ) : (
          <>
            <div className="flex-1 overflow-y-auto py-6">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 shrink-0 overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
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
                      <p className="text-sm font-medium mt-1">${item.price}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 border border-border hover:bg-secondary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          className="p-1 border border-border hover:bg-secondary transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex justify-between text-lg">
                <span className="font-serif">Total</span>
                <span className="font-medium">${totalPrice.toFixed(2) || 0.00}</span>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-sm tracking-wider uppercase">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )} */}
      </SheetContent>
    </Sheet>
  );
}
