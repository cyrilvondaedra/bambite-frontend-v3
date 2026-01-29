"use client";

import { Minus, Plus } from "lucide-react";
import { useMemo } from "react";
import { useCart } from "@/components/CartContext";

export default function Quantity({ menuItemId }: { menuItemId: string }) {
  const { items, updateQuantity } = useCart();
  console.log("Quantity",items);
  
  const quantity = useMemo(() => {
    return items.find((i) => i.id === menuItemId)?.quantity ?? 1;
  }, [items, menuItemId]);

  const decrease = () => updateQuantity(menuItemId, quantity - 1);
  const increase = () => updateQuantity(menuItemId, quantity + 1);

  return (
    <div className="flex items-center gap-2">
      <button
        className="p-1 border rounded-lg border-(--color-primary) text-(--color-primary) hover:text-(--color-foreground) hover:bg-(--color-primary) transition-colors"
        aria-label="Decrease quantity"
        onClick={decrease}
      >
        <Minus className="w-3 h-3" />
      </button>

      <span className="w-6 sub_heading text-center text-sm">{quantity}</span>

      <button
        className="p-1 rounded-lg border border-(--color-primary) text-(--color-primary) hover:text-(--color-foreground) hover:bg-(--color-primary) transition-colors"
        aria-label="Increase quantity"
        onClick={increase}
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
