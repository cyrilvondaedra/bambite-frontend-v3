"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  CartItemFromBackend,
  SelectedOptionDisplay,
  CartItem,
} from "@/types/api/cart";
import { useUser } from "./UserContext";
import { fetchWithAuth } from "@/utils/api";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateOptions: (id: string, options: SelectedOptionDisplay) => void;
  clearCart: () => void;
  viewCart: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
  fetchCart: () => Promise<void>;
  loading: boolean;
  deleteLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const { user, authLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const guestToken = localStorage.getItem("token");

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

      // Build URL with query param for guest users (if not authenticated via cookie)
      const url =
        !user && guestToken
          ? `${baseUrl}/cart?guestToken=${encodeURIComponent(guestToken)}`
          : `${baseUrl}/cart`;

      const res = await fetchWithAuth(
        url,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        !!user,
      );

      if (!res.ok) return;

      const { data } = await res.json();

      const mappedItems: CartItem[] = data.items.map(
        (item: CartItemFromBackend) => ({
          id: item.id,
          productId: item.productId,
          title: item.name,
          description: item.description ?? "",
          price: item.price,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions || null,
          selectedOptionsDisplay: item.selectedOptionsDisplay,
          image: item.imageUrls[0],
          thaiName: item.thaiName ?? "",
          subtotal: item.subtotal,
        }),
      );

      setItems(mappedItems);
      setTotalItems(data.totalItems);
      setTotalPrice(data.totalPrice);
    } catch (err) {
      console.error("Failed to restore cart", err);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    fetchCart();
  }, [user, authLoading]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, newItem as CartItem];
    });
  };

  const removeItem = async (id: string) => {
    const prevItems = items;

    try {
      setDeleteLoading(true);
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart/items/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
        !!user,
      );

      const data = await res.json();

      if (!res.ok) {
        setItems(prevItems);
        throw new Error(data.message || "Failed to remove from cart");
      }
      setItems((prev) => prev.filter((item) => item.productId !== id));
    } catch (err: any) {
      setItems(prevItems);
      toast.error(err.message);
      console.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 1) {
      return;
    }

    const prevItems = items;
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );

    try {
      setLoading(true);
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart/items/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        },
        !!user,
      );

      const data = await res.json();
      if (!res.ok) {
        setItems(prevItems);
        throw new Error(data.message || "Failed to update quantity");
      }

      await fetchCart();
    } catch (err: any) {
      setItems(prevItems);
      console.error(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOptions = async (
    cartId: string,
    selectedOptions: SelectedOptionDisplay,
  ) => {
    const prevItems = items;

    const payload = {
      selectedOptions: {
        [selectedOptions.id]: selectedOptions.value,
      },
    };

    try {
      setLoading(true);

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart/items/${cartId}/options`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...payload }),
        },
        !!user,
      );

      const data = await res.json();

      if (!res.ok) {
        setItems(prevItems);
        throw new Error(data.message || "Failed to update options");
      }

      await fetchCart();
    } catch (err: any) {
      setItems(prevItems);
      console.error(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const viewCart = () => {
    setOpen(true);
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateOptions,
        clearCart,
        viewCart,
        open,
        setOpen,
        totalItems,
        totalPrice,
        fetchCart,
        loading,
        deleteLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
