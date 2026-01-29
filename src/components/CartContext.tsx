"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface CartItem {
  id: string;
  title: string;
  description: string;
  price: string;
  quantity: number;
  selectedOptions: {
    id: string;
    displayName: string;
    value: string;
  } | null;
  image: string;
  thaiName: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  viewCart: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

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

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log("quantity", quantity);

    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item,
      ),
    );
  };

  const viewCart = () => {
    setOpen(true);
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        viewCart,
        open,
        setOpen,
        totalItems,
        totalPrice,
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
