"use client";

import Image from "next/image";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useTableOrder } from "@/contexts/TableOrderContext";
import type { ApiCartItem } from "@/types/api/table-order";

interface TableCartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceOrderClick: () => Promise<void>;
}

export default function TableCartSheet({
  isOpen,
  onClose,
  onPlaceOrderClick,
}: TableCartSheetProps) {
  const { cart, updateQuantity, removeItem, placeOrderLoading } =
    useTableOrder();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const { items, totalItems, totalPrice } = cart;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden
      />

      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl max-h-[85vh] md:max-h-[80vh] overflow-y-auto border border-border shadow-2xl safe-area-bottom">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              Cart ({totalItems})
            </h2>
            {items.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-destructive hover:bg-destructive/10 p-2.5 md:p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                aria-label="Clear cart"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-base">
                Your cart is empty
              </p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {items.map((item) => (
                <TableCartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={(q) => updateQuantity(item.id, q)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="sticky bottom-0 bg-background border-t border-border pt-4 pb-2 md:pb-0">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base md:text-lg font-semibold text-foreground">
                  Total
                </span>
                <span className="text-xl md:text-2xl font-bold text-primary">
                  ฿ {parseFloat(totalPrice).toFixed(2)}
                </span>
              </div>
              <button
                onClick={async () => await onPlaceOrderClick()}
                disabled={placeOrderLoading}
                className="w-full py-3.5 md:py-4 px-6 min-h-[52px] bg-primary text-primary-foreground font-bold text-base md:text-lg rounded-full hover:bg-opacity-90 active:bg-opacity-80 disabled:opacity-70 disabled:cursor-not-allowed transition-all touch-manipulation"
              >
                {placeOrderLoading ? "Placing Order…" : "Place Order"}
              </button>
            </div>
          )}
        </div>
      </div>

      {showClearConfirm && (
        <ClearCartConfirmDialog
          onCancel={() => setShowClearConfirm(false)}
          onConfirm={async () => {
            for (const item of items) {
              await removeItem(item.id);
            }
            setShowClearConfirm(false);
            onClose();
          }}
        />
      )}
    </>
  );
}

function TableCartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: ApiCartItem;
  onUpdateQuantity: (q: number) => void;
  onRemove: () => void;
}) {
  const imageUrl = item.imageUrls?.[0] || "/noodleMenu.jpg";

  return (
    <div className="flex gap-3 md:gap-4 pb-3 md:pb-4 border-b border-border last:border-0">
      <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 64px, 80px"
          unoptimized={imageUrl.startsWith("http")}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm md:text-base text-foreground line-clamp-2">
            {item.name}
          </h3>
          {item.selectedOptionsDisplay &&
            item.selectedOptionsDisplay.length > 0 && (
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                {item.selectedOptionsDisplay
                  .map((o) => `${o.displayName}: ${o.value}`)
                  .join(", ")}
              </p>
            )}
        </div>
        <p className="text-xs md:text-sm text-primary font-semibold mt-1">
          ฿ {parseFloat(item.price).toFixed(2)} × {item.quantity} = ฿{" "}
          {parseFloat(item.subtotal).toFixed(2)}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between shrink-0 gap-2">
        <button
          onClick={onRemove}
          className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation"
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="flex items-center justify-center min-w-[36px] min-h-[36px] w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground active:bg-primary/80 transition-colors touch-manipulation"
            aria-label="Decrease quantity"
          >
            <span className="text-base">−</span>
          </button>
          <span className="min-w-[28px] text-center text-sm font-semibold text-foreground">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="flex items-center justify-center min-w-[36px] min-h-[36px] w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-opacity-90 active:bg-opacity-80 transition-colors touch-manipulation"
            aria-label="Increase quantity"
          >
            <span className="text-base">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ClearCartConfirmDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-2xl p-5 md:p-6 max-w-sm w-full border border-border">
        <h3 className="text-base md:text-lg font-bold text-foreground mb-5 md:mb-6">
          Remove all items from your cart?
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 px-4 min-h-[48px] border border-primary text-primary font-semibold text-sm md:text-base rounded-full hover:bg-primary/5 active:bg-primary/10 transition-colors disabled:opacity-50 touch-manipulation"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-3 px-4 min-h-[48px] bg-primary text-primary-foreground font-semibold text-sm md:text-base rounded-full hover:bg-opacity-90 active:bg-opacity-80 transition-colors disabled:opacity-50 touch-manipulation"
          >
            {loading ? "Removing…" : "Remove All"}
          </button>
        </div>
      </div>
    </div>
  );
}
