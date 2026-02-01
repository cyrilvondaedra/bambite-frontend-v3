import { MenuItemWithUserSelections } from "@/types/api/menuItem";
import { useCart } from "@/components/CartContext";
import { ShoppingCart } from "lucide-react";
import { useUser } from "@/components/UserContext";

export default function QuantityControls({
  item,
}: {
  item: MenuItemWithUserSelections;
}) {
  const { items, addItem, viewCart, fetchCart } = useCart();
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const { user } = useUser();

  const handleAdd = async () => {
    const firstOpt = item.productOptions?.[0];
    const firstValue = firstOpt?.option?.optionLists?.[0];

    const payload: {
      productId: string;
      quantity: number;
      selectedOptions?: Record<string, string>;
    } = {
      productId: item.id,
      quantity: item.quantity ?? 1,
    };

    if (item.selectedOptions) {
      payload.selectedOptions = {
        [item.selectedOptions.id]: item.selectedOptions.value,
      };
    } else if (firstOpt?.optionId && firstValue) {
      payload.selectedOptions = {
        [firstOpt.optionId]: firstValue,
      };
    }

    console.log("payload", payload);

    const isGuest = !user;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          ...(isGuest ? {} : { credentials: "include" as const }),
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      console.log("QCdata", data);

      if (!res.ok) throw new Error(data.message || "Failed to add item");

      localStorage.setItem("token", JSON.stringify(data.data.guestToken));
      fetchCart();
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {quantity === 0 ? (
        <button
          onClick={handleAdd}
          className="flex items-center text-xs gap-2 p-1 lg:p-2 secondary_btn border border_border rounded-3xl tracking-wider transition-colors"
          aria-label={`Add ${item.name} to cart`}
        >
          <ShoppingCart className="w-4 h-4" />
          Add To Cart
        </button>
      ) : (
        <div className="flex items-center gap-1">
          <button
            onClick={viewCart}
            className="flex items-center gap-2 p-2 secondary_btn border border_border rounded-3xl text-xs tracking-wider transition-colors"
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
