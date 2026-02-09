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
import { api } from "@/lib/api";

interface CartContextType {
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateOptions: (id: string, options: SelectedOptionDisplay) => void;
  clearCart: () => void;
  viewCart: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
  // fetchCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const { user, accessToken, guestToken } = useUser();
  const [loading, setLoading] = useState(false);

  // const fetchCart = useCallback(async () => {
  //   try {
  //     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  //     const rawToken =
  //       typeof window !== "undefined" ? localStorage.getItem("token") : null;

  //     const guestToken =
  //       rawToken &&
  //       rawToken.trim() &&
  //       rawToken !== "undefined" &&
  //       rawToken !== "null"
  //         ? rawToken.trim()
  //         : null;

  //     const url =
  //       !user && guestToken
  //         ? `${baseUrl}/cart?guestToken=${encodeURIComponent(guestToken)}`
  //         : `${baseUrl}/cart`;

  //     const res = await fetchWithAuth(
  //       url,
  //       {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //       },
  //       !!user
  //     );

  //     if (!res.ok) return;

  //     const { data } = await res.json();

  //     const mappedItems: CartItem[] = data.items.map(
  //       (item: CartItemFromBackend) => ({
  //         id: item.id,
  //         productId: item.productId,
  //         title: item.name,
  //         description: item.description ?? "",
  //         price: item.price,
  //         quantity: item.quantity,
  //         selectedOptions: item.selectedOptions || null,
  //         selectedOptionsDisplay: item.selectedOptionsDisplay,
  //         image: item.imageUrls?.[0] ?? "",
  //         thaiName: item.thaiName ?? "",
  //         subtotal: item.subtotal,
  //       })
  //     );

  //     setItems(mappedItems);
  //     setTotalItems(data.totalItems);
  //     setTotalPrice(data.totalPrice);

  //     // Save guestToken ONLY if backend returns one and we don't already have a valid one
  //     if (!user && !guestToken && data?.guestToken) {
  //       localStorage.setItem("token", data.guestToken);
  //     }
  //   } catch (err) {
  //     console.error("Failed to restore cart", err);
  //   }
  // }, [user]);

  // useEffect(() => {
  //   if (authLoading) return;

  //   fetchCart();
  // }, [user]);

  const fetchCart = async () => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (accessToken && !guestToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      if (!accessToken && guestToken) {
        headers["X-Guest-Token"] = guestToken;
      }

      const res = await api("/api/auth/user/cart", {
        headers,
      });
      const mappedItems: CartItem[] = res.data.items.map(
        (item: CartItemFromBackend) => ({
          id: item.id,
          productId: item.productId,
          title: item.name,
          description: item.description ?? "",
          price: item.price,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions || null,
          selectedOptionsDisplay: item.selectedOptionsDisplay,
          image: item.imageUrls?.[0] ?? "",
          thaiName: item.thaiName ?? "",
          subtotal: item.subtotal,
        }),
      );
      setItems(mappedItems);
      setTotalItems(res.data.totalItems);
      setTotalPrice(res.data.totalPrice);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    if (accessToken || guestToken) {
      fetchCart();
    }
  }, [accessToken, guestToken]);

  const removeItem = async (id: string) => {
    const prevItems = items;

    setItems((prev) => prev.filter((item) => item.productId !== id));

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (!accessToken && guestToken) {
        headers["X-Guest-Token"] = guestToken;
      }

      const res = await api(`api/auth/user/cart/items/${id}`, {
        method: "DELETE",
        headers,
      });

      console.log("res", res);
    } catch (err: any) {
      setItems(prevItems);
      toast.error(err.message);
      console.error(err.message);
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
          item.productId === productId ? { ...item, quantity } : item,
        ),
      );

      // 2) reset timer for this product
      if (timersRef.current[productId]) {
        clearTimeout(timersRef.current[productId]);
      }

      // 3) call API after user "chills"
      timersRef.current[productId] = setTimeout(async () => {
        try {
          const headers: HeadersInit = {
            "Content-Type": "application/json",
          };

          if (!accessToken && guestToken) {
            headers["X-Guest-Token"] = guestToken;
          }

          await api(`/api/auth/user/cart/${productId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ quantity }),
          });
        } catch (err: any) {
          toast.error(err.message);
          fetchCart();
        }
      }, 800);
    },
    [accessToken, guestToken],
  );

  useEffect(() => {
    const total = items.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    setTotalPrice(total);
  }, [items]);

  const updateOptions = async (
    cartId: string,
    selectedOptions: SelectedOptionDisplay,
  ) => {
    const prevItems = items;

    // ✅ optimistic UI update
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== cartId) return item;

        // 1) update selectedOptions object
        const nextSelectedOptions = {
          ...(item.selectedOptions ?? {}),
          [selectedOptions.id]: selectedOptions.value,
        };

        // 2) update selectedOptionsDisplay list (if you show it in UI)
        const prevDisplay = item.selectedOptionsDisplay ?? [];
        const idx = prevDisplay.findIndex((o) => o.id === selectedOptions.id);

        const nextDisplay =
          idx === -1
            ? [...prevDisplay, selectedOptions]
            : prevDisplay.map((o) =>
                o.id === selectedOptions.id ? selectedOptions : o,
              );

        return {
          ...item,
          selectedOptions: nextSelectedOptions,
          selectedOptionsDisplay: nextDisplay,
        };
      }),
    );

    const payload = {
      selectedOptions: {
        [selectedOptions.id]: selectedOptions.value,
      },
    };

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (!accessToken && guestToken) {
        headers["X-Guest-Token"] = guestToken;
      }

      await api(`/api/auth/user/cart/options/${cartId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ ...payload }),
      });
    } catch (err: any) {
      setItems(prevItems);
      console.error(err.message);
      toast.error(err.message);
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
        !!user,
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
        setItems,
        removeItem,
        updateQuantity,
        updateOptions,
        clearCart,
        viewCart,
        open,
        setOpen,
        totalItems,
        totalPrice,
        // fetchCart,
        loading,
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
