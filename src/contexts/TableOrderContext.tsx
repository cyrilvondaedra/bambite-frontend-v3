"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { ApiCartItem, ApiTableOrder } from "@/types/api/table-order";
import {
  fetchTableCart,
  addToTableCart,
  updateTableCartItemQuantity,
  updateTableCartItemOptions,
  removeFromTableCart,
  placeTableOrder,
  TableSectionError,
  RateLimitError,
} from "@/lib/table-order-api";
import { toast } from "sonner";

interface TableOrderContextType {
  tableId: string;
  sectionId: string;
  cart: {
    items: ApiCartItem[];
    totalItems: number;
    totalPrice: string;
  };
  cartLoading: boolean;
  cartError: string | null;
  fetchCart: () => Promise<void>;
  addItem: (params: {
    productId: string;
    quantity: number;
    selectedOptions?: Record<string, string>;
  }) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  updateOptions: (
    cartItemId: string,
    selectedOptions: Record<string, string>,
  ) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  placeOrder: (params?: {
    email?: string;
    phoneNumber?: string;
    customerName?: string;
  }) => Promise<ApiTableOrder>;
  placeOrderLoading: boolean;
  clearCartError: () => void;
}

const TableOrderContext = createContext<TableOrderContextType | undefined>(
  undefined,
);

interface TableOrderProviderProps {
  children: ReactNode;
  tableId: string;
  sectionId: string;
}

export function TableOrderProvider({
  children,
  tableId,
  sectionId,
}: TableOrderProviderProps) {
  const [cart, setCart] = useState<{
    items: ApiCartItem[];
    totalItems: number;
    totalPrice: string;
  }>({ items: [], totalItems: 0, totalPrice: "0" });
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setCartLoading(true);
    setCartError(null);
    try {
      const data = await fetchTableCart(tableId, sectionId);
      setCart({
        items: data.items,
        totalItems: data.totalItems,
        totalPrice: data.totalPrice,
      });
    } catch (err) {
      if (err instanceof TableSectionError) {
        setCartError(err.message);
      } else if (err instanceof RateLimitError) {
        setCartError(err.message);
        toast.error(err.message);
      } else {
        setCartError(
          err instanceof Error ? err.message : "Failed to load cart",
        );
      }
    } finally {
      setCartLoading(false);
    }
  }, [tableId, sectionId]);

  const addItem = useCallback(
    async (params: {
      productId: string;
      quantity: number;
      selectedOptions?: Record<string, string>;
    }) => {
      try {
        await addToTableCart(tableId, sectionId, params);
        await fetchCart();
        toast.success("Added to cart");
      } catch (err) {
        if (err instanceof TableSectionError) {
          setCartError(err.message);
        } else if (err instanceof RateLimitError) {
          toast.error(err.message);
        } else {
          toast.error(
            err instanceof Error ? err.message : "Failed to add to cart",
          );
        }
      }
    },
    [tableId, sectionId, fetchCart],
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      if (quantity < 1) return;
      try {
        await updateTableCartItemQuantity(
          tableId,
          sectionId,
          cartItemId,
          quantity,
        );
        await fetchCart();
      } catch (err) {
        if (err instanceof TableSectionError) {
          setCartError(err.message);
        } else if (err instanceof RateLimitError) {
          toast.error(err.message);
        } else {
          toast.error(
            err instanceof Error ? err.message : "Failed to update quantity",
          );
        }
      }
    },
    [tableId, sectionId, fetchCart],
  );

  const updateOptions = useCallback(
    async (cartItemId: string, selectedOptions: Record<string, string>) => {
      try {
        await updateTableCartItemOptions(
          tableId,
          sectionId,
          cartItemId,
          selectedOptions,
        );
        await fetchCart();
        toast.success("Options updated");
      } catch (err) {
        if (err instanceof TableSectionError) {
          setCartError(err.message);
        } else if (err instanceof RateLimitError) {
          toast.error(err.message);
        } else {
          toast.error(
            err instanceof Error ? err.message : "Failed to update options",
          );
        }
      }
    },
    [tableId, sectionId, fetchCart],
  );

  const removeItem = useCallback(
    async (cartItemId: string) => {
      try {
        await removeFromTableCart(tableId, sectionId, cartItemId);
        await fetchCart();
        toast.success("Item removed");
      } catch (err) {
        if (err instanceof TableSectionError) {
          setCartError(err.message);
        } else if (err instanceof RateLimitError) {
          toast.error(err.message);
        } else {
          toast.error(
            err instanceof Error ? err.message : "Failed to remove item",
          );
        }
      }
    },
    [tableId, sectionId, fetchCart],
  );

  const placeOrder = useCallback(
    async (params?: {
      email?: string;
      phoneNumber?: string;
      customerName?: string;
    }) => {
      setPlaceOrderLoading(true);
      try {
        const order = await placeTableOrder(tableId, sectionId, params);
        await fetchCart();
        return order;
      } catch (err) {
        if (err instanceof TableSectionError) {
          setCartError(err.message);
          throw err;
        } else if (err instanceof RateLimitError) {
          toast.error(err.message);
          throw err;
        } else {
          const msg =
            err instanceof Error ? err.message : "Failed to place order";
          toast.error(msg);
          throw new Error(msg);
        }
      } finally {
        setPlaceOrderLoading(false);
      }
    },
    [tableId, sectionId, fetchCart],
  );

  const clearCartError = useCallback(() => setCartError(null), []);

  return (
    <TableOrderContext.Provider
      value={{
        tableId,
        sectionId,
        cart,
        cartLoading,
        cartError,
        fetchCart,
        addItem,
        updateQuantity,
        updateOptions,
        removeItem,
        placeOrder,
        placeOrderLoading,
        clearCartError,
      }}
    >
      {children}
    </TableOrderContext.Provider>
  );
}

export function useTableOrder() {
  const ctx = useContext(TableOrderContext);
  if (ctx === undefined) {
    throw new Error("useTableOrder must be used within TableOrderProvider");
  }
  return ctx;
}
