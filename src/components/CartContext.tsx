"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { SelectedOptionDisplay, CartItem } from "@/types/api/cart";
import { toast } from "sonner";
import { api } from "@/lib/api";

const CART_STORAGE_KEY = "bambite_cart";
const GUEST_TOKEN_KEY = "guest_token";

interface CartContextType {
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
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
  loading: boolean;
  guestToken: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to get cart from localStorage
const getCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save cart to localStorage:", err);
  }
};

// Helper to get guest token
const getGuestToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(GUEST_TOKEN_KEY);
};

// Helper to save guest token
const saveGuestToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_TOKEN_KEY, token);
};

export function CartProvider({ children }: { children: ReactNode }) {
  // Lazy initialization from localStorage
  const [items, setItems] = useState<CartItem[]>(() => getCartFromStorage());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestToken, setGuestToken] = useState<string | null>(() => getGuestToken());

  // Debounce timers for quantity updates
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  // Build headers with guest token
  const buildHeaders = useCallback((): HeadersInit => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (guestToken) {
      headers["X-Guest-Token"] = guestToken;
    }
    return headers;
  }, [guestToken]);

  // Compute totals from items (no setState needed)
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [items]
  );

  // Save cart to localStorage whenever items change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  // Add item to cart
  const addItem = async (newItem: CartItem) => {
    const prevItems = items;

    // Optimistic update
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          JSON.stringify(item.selectedOptions) ===
            JSON.stringify(newItem.selectedOptions)
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        };
        return updated;
      }

      const itemWithId = {
        ...newItem,
        id: newItem.id || `${newItem.productId}-${Date.now()}`,
      };
      return [...prev, itemWithId];
    });

    toast.success("Item added to cart");

    // Call API
    try {
      const payload = {
        productId: newItem.productId,
        quantity: newItem.quantity,
        selectedOptions: newItem.selectedOptions || {},
      };

      const res = await api("/api/auth/user/cart", {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });

      // Save guest token if returned
      if (res.data?.guestToken && !guestToken) {
        saveGuestToken(res.data.guestToken);
        setGuestToken(res.data.guestToken);
      }
    } catch (err) {
      console.error("Failed to sync cart with backend:", err);
      // Rollback on error
      setItems(prevItems);
      toast.error("Failed to add item to cart");
    }
  };

  // Remove item from cart
  const removeItem = async (productId: string) => {
    const prevItems = items;

    // Optimistic update
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    toast.success("Item removed from cart");

    // Call API
    try {
      await api(`/api/auth/user/cart/items/${productId}`, {
        method: "DELETE",
        headers: buildHeaders(),
      });
    } catch (err) {
      console.error("Failed to remove item from backend:", err);
      setItems(prevItems);
      toast.error("Failed to remove item");
    }
  };

  // Update quantity with debounce
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) return;

      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );

      // Clear existing timer for this product
      if (timersRef.current[productId]) {
        clearTimeout(timersRef.current[productId]);
      }

      // Debounced API call
      timersRef.current[productId] = setTimeout(async () => {
        try {
          await api(`/api/auth/user/cart/${productId}`, {
            method: "PUT",
            headers: buildHeaders(),
            body: JSON.stringify({ quantity }),
          });
        } catch (err) {
          console.error("Failed to update quantity:", err);
          toast.error("Failed to update quantity");
        }
      }, 800);
    },
    [buildHeaders]
  );

  // Update options
  const updateOptions = async (
    cartId: string,
    selectedOptions: SelectedOptionDisplay
  ) => {
    const prevItems = items;

    // Optimistic update
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== cartId) return item;

        const nextSelectedOptions = {
          ...(item.selectedOptions ?? {}),
          [selectedOptions.id]: selectedOptions.value,
        };

        const prevDisplay = item.selectedOptionsDisplay ?? [];
        const idx = prevDisplay.findIndex((o) => o.id === selectedOptions.id);

        const nextDisplay =
          idx === -1
            ? [...prevDisplay, selectedOptions]
            : prevDisplay.map((o) =>
                o.id === selectedOptions.id ? selectedOptions : o
              );

        return {
          ...item,
          selectedOptions: nextSelectedOptions,
          selectedOptionsDisplay: nextDisplay,
        };
      })
    );

    // Call API
    try {
      const payload = {
        selectedOptions: {
          [selectedOptions.id]: selectedOptions.value,
        },
      };

      await api(`/api/auth/user/cart/options/${cartId}`, {
        method: "PATCH",
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to update options:", err);
      setItems(prevItems);
      toast.error("Failed to update options");
    }
  };

  // View cart
  const viewCart = () => {
    setOpen(true);
  };

  // Clear cart
  const clearCart = async () => {
    const prevItems = items;
    setLoading(true);
    setItems([]);

    try {
      await api("/api/cart", {
        method: "DELETE",
        headers: buildHeaders(),
      });
    } catch (err) {
      console.error("Failed to clear cart:", err);
      setItems(prevItems);
      toast.error("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        setItems,
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
        loading,
        guestToken,
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
