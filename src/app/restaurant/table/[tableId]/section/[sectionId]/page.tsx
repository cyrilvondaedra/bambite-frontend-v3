"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useTableOrder } from "@/contexts/TableOrderContext";
import { fetchActiveCategories, fetchProducts } from "@/lib/table-order-api";
import type {
  ApiCategory,
  ApiProduct,
  ApiTableOrder,
} from "@/types/api/table-order";
import TableOrderHeader from "./components/TableOrderHeader";
import TableOrderNavigation from "./components/TableOrderNavigation";
import TableProductGrid from "./components/TableProductGrid";
import TableCartSheet from "./components/TableCartSheet";
import OrderConfirmation from "./components/OrderConfirmation";
import ExpiredQRMessage from "./components/ExpiredQRMessage";

export default function TableOrderPage() {
  const params = useParams();
  const tableId = params.tableId as string;
  const sectionId = params.sectionId as string;

  const { cart, cartError, fetchCart, placeOrder } = useTableOrder();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<ApiTableOrder | null>(null);

  useEffect(() => {
    if (!tableId || !sectionId) return;
    fetchCart();
  }, [tableId, sectionId, fetchCart]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setCategoriesLoading(true);
      try {
        const data = await fetchActiveCategories();
        if (!cancelled) setCategories(data);
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setProductsLoading(true);
      try {
        // Fetch first page to get total count
        const { data: firstPage, meta } = await fetchProducts({
          page: 1,
          limit: 100,
        });
        if (cancelled) return;

        // If total products > limit, fetch all pages
        if (meta.total > 100) {
          const totalPages = Math.ceil(meta.total / 100);
          const allProducts = [...firstPage];

          // Fetch remaining pages in parallel
          const remainingPages = Array.from(
            { length: totalPages - 1 },
            (_, i) => i + 2,
          );
          const remainingResults = await Promise.all(
            remainingPages.map((page) => fetchProducts({ page, limit: 100 })),
          );

          for (const result of remainingResults) {
            allProducts.push(...result.data);
          }

          if (!cancelled) setProducts(allProducts);
        } else {
          if (!cancelled) setProducts(firstPage);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePlaceOrderClick = async () => {
    try {
      const order = await placeOrder({});
      setPlacedOrder(order);
      setShowCart(false);
    } catch (err) {
      // Error is handled by TableOrderContext (toast + cartError state)
      console.error("Failed to place order:", err);
    }
  };

  const handleOrderMore = () => {
    setPlacedOrder(null);
  };

  if (!tableId || !sectionId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <p className="text-muted-foreground">Invalid table or section.</p>
      </div>
    );
  }

  if (cartError) {
    return <ExpiredQRMessage message={cartError} />;
  }

  if (placedOrder) {
    return (
      <main className="min-h-screen bg-background">
        <OrderConfirmation order={placedOrder} onOrderMore={handleOrderMore} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <TableOrderHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <TableOrderNavigation
        categories={categories}
        activeCategoryId={activeCategoryId}
        setActiveCategoryId={setActiveCategoryId}
        isLoading={categoriesLoading}
      />

      <div className="px-4 md:px-8 py-6 pb-32">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">
          {activeCategoryId
            ? (categories.find((c) => c.id === activeCategoryId)?.name ??
              "Menu")
            : "All Items"}
        </h2>
        <TableProductGrid
          products={products}
          categoryId={activeCategoryId}
          searchQuery={searchQuery}
          isLoading={productsLoading}
        />
      </div>

      {cart.totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-secondary text-secondary-foreground p-3 md:p-4 flex items-center justify-between rounded-t-2xl z-40 border-t border-border shadow-lg safe-area-bottom">
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center gap-2 md:gap-3 flex-1 min-h-[44px] touch-manipulation"
            aria-label="View cart"
          >
            <div className="relative">
              <ShoppingCart size={24} className="md:w-6 md:h-6" />
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1">
                {cart.totalItems}
              </div>
            </div>
            <div className="text-left">
              <p className="text-xs opacity-80">Total</p>
              <p className="text-base md:text-lg font-bold">
                ฿ {parseFloat(cart.totalPrice).toFixed(2)}
              </p>
            </div>
          </button>
          <button
            onClick={() => setShowCart(true)}
            className="ml-3 md:ml-4 px-4 md:px-6 py-2.5 md:py-3 min-h-[44px] bg-primary text-primary-foreground font-semibold text-sm md:text-base rounded-full hover:bg-opacity-90 active:bg-opacity-80 transition-all whitespace-nowrap touch-manipulation"
            aria-label="View cart details"
          >
            View Cart
          </button>
        </div>
      )}

      <TableCartSheet
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onPlaceOrderClick={handlePlaceOrderClick}
      />
    </main>
  );
}
