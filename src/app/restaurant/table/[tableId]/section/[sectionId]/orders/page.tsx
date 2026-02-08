"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { ArrowLeft, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { io, Socket } from "socket.io-client";
import {
  fetchTableOrders,
  fetchRealtimeTableOrders,
} from "@/lib/table-order-api";
import type { ApiTableOrdersList } from "@/types/api/table-order";
import ExpiredQRMessage from "../components/ExpiredQRMessage";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
    priority: 1,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: CheckCircle,
    priority: 2,
  },
  PREPARING: {
    label: "Preparing",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: Clock,
    priority: 3,
  },
  READY: {
    label: "Ready",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle,
    priority: 4,
  },
  SERVED: {
    label: "Served",
    color: "bg-gray-100 text-gray-600 border-gray-300",
    icon: CheckCircle,
    priority: 5,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: AlertCircle,
    priority: 6,
  },
};

export default function TableOrdersPage() {
  const params = useParams();
  const router = useRouter();

  const tableId = params.tableId as string;
  const sectionId = params.sectionId as string;

  const [orders, setOrders] = useState<ApiTableOrdersList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initial load
  const loadOrders = useCallback(async () => {
    try {
      const data = await fetchTableOrders(tableId, sectionId, "all");
      setOrders(data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      setError(null);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [tableId, sectionId]);

  // Polling fallback
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return;
    setIsPolling(true);

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const data = await fetchRealtimeTableOrders(tableId, sectionId, "all");
        setOrders(data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 7000); // Poll every 7 seconds
  }, [tableId, sectionId]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setIsPolling(false);
    }
  }, []);

  // Socket.IO setup
  useEffect(() => {
    if (!tableId || !sectionId) return;

    // Initial load
    loadOrders();

    // Connect to Socket.IO
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";
    const socket = io(wsUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      stopPolling();
      socket.emit("subscribe", {
        channel: "table-section",
        tableId,
        sectionId,
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      startPolling();
    });

    socket.on("table-order:new", (data: ApiTableOrdersList) => {
      console.log("New order received:", data);
      setOrders((prev) => {
        const exists = prev.some((o) => o.id === data.id);
        if (exists) return prev;
        return [data, ...prev].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    });

    socket.on("table-order:updated", (data: ApiTableOrdersList) => {
      console.log("Order updated:", data);
      setOrders((prev) =>
        prev.map((order) => (order.id === data.id ? data : order))
          .sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      );
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      startPolling();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("unsubscribe", {
          channel: "table-section",
          tableId,
          sectionId,
        });
        socketRef.current.disconnect();
      }
      stopPolling();
    };
  }, [tableId, sectionId, loadOrders, startPolling, stopPolling]);

  const goBack = () => {
    router.back();
  };

  if (!tableId || !sectionId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <p className="text-muted-foreground">Invalid table or section.</p>
      </div>
    );
  }

  if (error && error.includes("expired") || error && error.includes("Invalid")) {
    return <ExpiredQRMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="px-4 md:px-6 py-4 flex items-center gap-4">
          <button
            onClick={goBack}
            className="p-2 hover:bg-muted rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg md:text-xl font-bold text-foreground">
              My Orders
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
              <span className="text-xs text-muted-foreground">
                {isConnected ? "Live updates" : isPolling ? "Polling..." : "Connecting..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-4 md:p-6 animate-pulse"
              >
                <div className="h-6 bg-muted rounded w-1/4 mb-4" />
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 md:py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted mb-4">
              <Clock className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-2">
              No Orders Yet
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6">
              Your orders for this table will appear here
            </p>
            <button
              onClick={goBack}
              className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-opacity-90 transition-all"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: ApiTableOrdersList }) {
  const config = STATUS_CONFIG[order.status];
  const Icon = config.icon;
  const isActive = ["PENDING", "CONFIRMED", "PREPARING", "READY"].includes(
    order.status
  );

  return (
    <div
      className={`bg-card border-2 rounded-2xl p-4 md:p-6 transition-all ${
        isActive
          ? "border-primary shadow-lg"
          : "border-border shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-mono text-muted-foreground">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 font-semibold text-sm ${config.color}`}
        >
          <Icon className="w-4 h-4" />
          <span>{config.label}</span>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm py-2 border-b border-border/50 last:border-0"
          >
            <span className="text-foreground flex-1">
              {item.product.name} × {item.quantity}
            </span>
            <span className="text-muted-foreground font-medium">
              ฿ {parseFloat(item.netPrice).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-3 border-t-2 border-border">
        <span className="text-base font-semibold text-foreground">Total</span>
        <span className="text-xl font-bold text-primary">
          ฿ {parseFloat(order.total).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
