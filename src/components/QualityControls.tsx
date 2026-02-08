import { MenuItemWithUserSelections } from "@/types/api/menuItem";
import { useCart } from "@/components/CartContext";
import { ShoppingCart } from "lucide-react";
import { useUser } from "@/components/UserContext";
import { useState } from "react";
import { CartItem } from "@/types/api/cart";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function QuantityControls({
  item,
}: {
  item: MenuItemWithUserSelections;
}) {
  const { items, viewCart, setItems } = useCart();
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;
  const [loading, setLoading] = useState(false);

  const { user, accessToken } = useUser();

  const handleAdd = async () => {
    setLoading(true);
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

    const isGuest = !user;
    const guestToken = localStorage.getItem("token");

    const optimisticItem: CartItem = {
      id: `temp-${Date.now()}`, // temporary ID
      productId: item.id,
      title: item.name,
      description: item.description,
      thaiName: item.thaiName,
      image: item.imageUrls?.[0] || "",
      price: item.price,
      quantity: payload.quantity,
      subtotal: parseFloat(item.price) * payload.quantity,
      selectedOptions: payload.selectedOptions || {},
      selectedOptionsDisplay: payload.selectedOptions
        ? Object.entries(payload.selectedOptions).map(([optionId, value]) => {
            const productOption = item.productOptions?.find(
              (po) => po.optionId === optionId
            );
            return {
              id: optionId,
              displayName:
                productOption?.option?.displayName ||
                productOption?.option?.name ||
                "Option",
              value: value as string,
            };
          })
        : null,
    };
    const prevItems = items

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (cartItem) =>
          cartItem.productId === item.id &&
          JSON.stringify(cartItem.selectedOptions) ===
            JSON.stringify(payload.selectedOptions)
      );
      if (existingIndex !== -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + payload.quantity,
          subtotal:
            (updated[existingIndex].quantity + payload.quantity) *
            parseFloat(item.price),
        };
        return updated;
      } else {
        return [...prevItems, optimisticItem];
      }
    });
    setLoading(false);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (!accessToken && guestToken) {
      headers["X-Guest-Token"] = guestToken; // guestToken is string here
    }

    try {
      const res = await api(`/api/auth/user/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      toast.success(res.message)
    } catch (err: any) {
      toast.error(err.message);
      console.error(err.message);
      setItems(prevItems);
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
          {loading ? (
            <span className="flex items-center">
              <span className="animate-spin h-4 w-4 rounded-full border-2 border_border border-t-transparent" />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Add To Cart</span>
            </span>
          )}
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
