import { MenuItemWithUserSelections } from "@/types/api/menuItem";
import { useCart } from "@/components/CartContext";
import { ShoppingCart } from "lucide-react";

export default function QuantityControls({
  item,
}: {
  item: MenuItemWithUserSelections;
}) {
  const { items, addItem, viewCart } = useCart();
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      id: item.id,
      title: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity || 0,
      selectedOptions: item.selectedOptions,
      thaiName: item.thaiName,
      image: item.imageUrls[0],
    });
  };

  console.log("item", item);

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
