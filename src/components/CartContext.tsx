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
import { useRef, useCallback } from "react";

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

  const fetchCart = useCallback(async () => {
    try {
      const guestToken = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

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
        !!user
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
        })
      );

      setItems(mappedItems);
      setTotalItems(data.totalItems);
      setTotalPrice(data.totalPrice);
      if (!guestToken) {
        localStorage.setItem("token", data.guestToken);
      }
    } catch (err) {
      console.error("Failed to restore cart", err);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    fetchCart();
  }, []);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
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
        !!user
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

  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) return;

      // 1) update UI immediately
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );

      // 2) reset timer for this product
      if (timersRef.current[productId]) {
        clearTimeout(timersRef.current[productId]);
      }

      // 3) call API after user "chills"
      timersRef.current[productId] = setTimeout(async () => {
        try {
          setLoading(true);

          const res = await fetchWithAuth(
            `${process.env.NEXT_PUBLIC_BASE_URL}/cart/items/${productId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ quantity }),
            },
            !!user
          );

          const data = await res.json();
          if (!res.ok)
            throw new Error(data.message || "Failed to update quantity");

          await fetchCart();
        } catch (err: any) {
          toast.error(err.message);
          await fetchCart();
        } finally {
          setLoading(false);
        }
      }, 800);
    },
    [fetchCart, user]
  );

  const updateOptions = async (
    cartId: string,
    selectedOptions: SelectedOptionDisplay
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
        !!user
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

  const clearCart = async () => {
    const prevItems = items;

    try {
      setLoading(true);

      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
        !!user
      );

      const data =
        res.headers.get("content-length") !== "0" ? await res.json() : null;

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete cart");
      }

      setItems([]);
    } catch (err: any) {
      setItems(prevItems);
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
