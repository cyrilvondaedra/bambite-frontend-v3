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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    let token;
    const storedValue = localStorage.getItem("token");

    if (!storedValue) return;

    try {
      token = JSON.parse(storedValue);
    } catch (error) {
      token = storedValue;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

      const url =
        user || !token
          ? `${baseUrl}/cart`
          : `${baseUrl}/cart?guestToken=${encodeURIComponent(token)}`;

      const res = await fetch(url, {
        headers: {
          ...(!user && token ? { "X-Guest-Token": token } : {}),
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) return;

      const { data } = await res.json();

      console.log("cartdata", data.items);

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
    fetchCart();
  }, []);

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
      let token;
      const storedValue = localStorage.getItem("token");

      if (!storedValue) return;

      try {
        token = JSON.parse(storedValue);
      } catch (error) {
        token = storedValue;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart/items/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(!user && token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        },
      );

      const data = await res.json();
      console.log("removefromcart", data);

      if (!res.ok) {
        setItems(prevItems);
        throw new Error(data.message || "Failed to remove from cart");
      }

      console.log("delete", id);

      setItems((prev) => prev.filter((item) => item.productId !== id));
    } catch (err: any) {
      setItems(prevItems);
      console.error(err.message);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const prevItems = items;
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
    try {
      let token;
      const storedValue = localStorage.getItem("token");

      if (!storedValue) return;

      try {
        token = JSON.parse(storedValue);
      } catch (error) {
        token = storedValue;
      }

      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cart/items/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(!user && token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({ quantity }),
        },
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
    } finally {
      setLoading(false);
    }
  };

  const updateOptions = (id: string, options: SelectedOptionDisplay) => {
    // setItems((prev) =>
    //   prev.map((item) =>
    //     item.id === id ? { ...item, selectedOptions: options } : item,
    //   ),
    // );
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
