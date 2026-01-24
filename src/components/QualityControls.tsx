import { MenuItem } from "@/types/api/menuItem";
import { useCart } from "@/components/CartContext";
import { ShoppingCart } from "lucide-react";

export default function QuantityControls({ item }: { item: MenuItem }) {
  const { items, addItem, viewCart } = useCart();
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

  return (
    <div className="flex items-center gap-3">
      {quantity === 0 ? (
        <button
          onClick={handleAdd}
          className="flex items-center text-xs gap-2 p-1 lg:p-2  bg-transparent text-(--color-text) border border-(--color-primary) rounded-3xl tracking-wider hover:bg-(--color-primary) transition-colors"
          aria-label={`Add ${item.name} to cart`}
        >
          <ShoppingCart className="w-4 h-4" />
          Add To Cart
        </button>
      ) : (
        <div className="flex items-center gap-1">
          <button
            onClick={viewCart}
            className="flex items-center gap-2 p-2 bg-transparent text-(--color-text) border border-(--color-primary) hover:border hover:bg-(--color-primary)  rounded-3xl text-xs tracking-wider transition-colors"
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
