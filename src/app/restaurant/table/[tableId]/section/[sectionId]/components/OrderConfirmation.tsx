"use client";

import type { ApiTableOrder } from "@/types/api/table-order";

interface OrderConfirmationProps {
  order: ApiTableOrder;
  onOrderMore: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PREPARING: "Preparing",
  SERVED: "Served",
  PAID: "Paid",
  CANCELLED: "Cancelled",
};

export default function OrderConfirmation({
  order,
  onOrderMore,
}: OrderConfirmationProps) {
  return (
    <div className="max-w-lg mx-auto p-4 md:p-6 min-h-screen flex items-center">
      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 w-full shadow-lg">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 text-primary mb-4">
            <svg
              className="w-8 h-8 md:w-10 md:h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Order Placed Successfully
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="space-y-4 md:space-y-5 mb-6 md:mb-8">
          <div className="flex justify-between items-center py-2 md:py-3 border-b border-border">
            <span className="text-sm md:text-base text-muted-foreground">
              Status
            </span>
            <span
              className={`font-semibold text-sm md:text-base ${
                order.status === "CANCELLED"
                  ? "text-destructive"
                  : "text-primary"
              }`}
            >
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-base md:text-lg text-foreground">
              Items
            </h3>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-4 text-sm md:text-base py-2 border-b border-border/50 last:border-0"
              >
                <span className="text-foreground flex-1 min-w-0">
                  <span className="line-clamp-1">{item.product.name}</span>
                  <span className="text-muted-foreground ml-1">
                    × {item.quantity}
                  </span>
                </span>
                <span className="text-primary font-medium whitespace-nowrap">
                  ฿ {parseFloat(item.netPrice).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-3 md:pt-4 border-t-2 border-border">
            <span className="text-base md:text-lg font-semibold text-foreground">
              Total
            </span>
            <span className="text-xl md:text-2xl font-bold text-primary">
              ฿ {parseFloat(order.total).toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={onOrderMore}
          className="w-full py-3.5 md:py-4 px-6 min-h-[52px] bg-primary text-primary-foreground font-bold text-base md:text-lg rounded-full hover:bg-opacity-90 active:bg-opacity-80 transition-all touch-manipulation"
        >
          Order More
        </button>
      </div>
    </div>
  );
}
