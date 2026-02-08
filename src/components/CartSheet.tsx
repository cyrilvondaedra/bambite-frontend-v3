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
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartSheet() {
  const {
    items,
    totalPrice,
    updateQuantity,
    removeItem,
    open,
    setOpen,
    loading,
    deleteLoading,
  } = useCart();

  console.log("CartSheet",items);
  console.log("totalPrice",totalPrice);
  

  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="relative nav-link p-2 transition-colors"
          aria-label="Open cart"
        >
          <ShoppingCart className="w-4 h-4 xl:w-5 xl:h-5" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 primary_btn text-xs flex items-center justify-center rounded-full">
              {items.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full secondary_background sm:max-w-md flex flex-col border-none">
        {deleteLoading && (
          <div className="absolute inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 border primary_border bg-background shadow-sm">
              <span className="animate-spin h-5 w-5 rounded-full border-2 border_border border-t-transparent" />
              <span className="text-sm heading">Updating your cart…</span>
            </div>
          </div>
        )}
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl font-light">
            Your Order
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingCart className="w-12 h-12 heading2 mb-4" />
            <p className="heading2">Your cart is empty</p>
            <p className="text-sm heading2 mt-2">
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
                    className="flex gap-4 border-b primary_border p-4"
                  >
                    <div className="relative w-20 h-20 shrink-0 overflow-hidden">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-lg heading2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.thaiName}
                      </p>
                      <p className="text-sm heading2 truncate">
                        {item.description}
                      </p>
                      {item.selectedOptionsDisplay !== null &&
                        item.selectedOptionsDisplay.length > 0 &&
                        item.selectedOptionsDisplay.map((opt, i) => (
                          <p className="text-sm heading2 mt-2" key={i}>
                            {opt.displayName}: {opt.value}
                          </p>
                        ))}
                      <p className="text-sm font-medium mt-1 heading2">
                        ฿{item.price}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        className="p-1 rounded-2xl heading2 hover:text-destructive transition-colors"
                        aria-label="Remove item"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="w-4 h-4 hover:text-red-500" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={item.quantity <= 1}
                          className="p-1 border rounded-lg primary_border primary_text hover:text-(--color-foreground) hover:bg-(--color-primary) transition-colors"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          className="p-1 border rounded-lg primary_border primary_text hover:text-(--color-foreground) hover:bg-(--color-primary) transition-colors"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
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

            <div className="border-t primary_border pt-6 space-y-4 px-5">
              <div className="flex justify-between text-lg">
                <span className="font-serif">Total</span>
                {loading ? (
                  <div className="animate-spin h-6 w-6 rounded-full border-2 sub_heading2 border-t-transparent" />
                ) : (
                  <span className="font-medium">
                    ฿ {totalPrice.toFixed(2) || 0.0}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/checkout");
                }}
                className="w-full primary_btn rounded-xl mb-4 py-4 text-sm tracking-wider uppercase"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
