/**
 * API client for Restaurant Table Order flow.
 * Uses X-Section-Id header for table/section identification (no auth).
 */

import type {
  ApiProduct,
  ApiProductDetail,
  ApiCategory,
  ApiTableCart,
  ApiTableOrder,
  ApiResponse,
  ApiProductsMeta,
} from "@/types/api/table-order";

const getBaseUrl = () =>
  (process.env.NEXT_PUBLIC_BASE_URL || "").trim().replace(/\/$/, "");

// ─── Public endpoints (no X-Section-Id) ─────────────────────────────────────

export async function fetchActiveCategories(): Promise<ApiCategory[]> {
  const res = await fetch(`${getBaseUrl()}/categories/active`);
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  const json: ApiResponse<ApiCategory[]> = await res.json();
  if (json.status !== "success" || !json.data) {
    throw new Error(json.message || "Failed to fetch categories");
  }
  return json.data;
}

export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: "createdAt" | "name" | "price";
  sortOrder?: "asc" | "desc";
}): Promise<{ data: ApiProduct[]; meta: ApiProductsMeta }> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);
  if (params?.category) searchParams.set("category", params.category);
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const query = searchParams.toString();
  const url = `${getBaseUrl()}/products${query ? `?${query}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  const json: ApiResponse<ApiProduct[]> & { meta?: ApiProductsMeta } =
    await res.json();
  if (json.status !== "success" || !json.data) {
    throw new Error(json.message || "Failed to fetch products");
  }
  return {
    data: json.data,
    meta: json.meta ?? { page: 1, limit: 50, total: json.data.length },
  };
}

export async function fetchProductDetail(
  productId: string,
): Promise<ApiProductDetail> {
  const res = await fetch(`${getBaseUrl()}/products/${productId}`);
  if (res.status === 404) {
    throw new Error("Product not found");
  }
  if (!res.ok) {
    throw new Error("Failed to fetch product details");
  }
  const json: ApiResponse<ApiProductDetail> = await res.json();
  if (json.status !== "success" || !json.data) {
    throw new Error(json.message || "Failed to fetch product details");
  }
  return json.data;
}

// ─── Table cart/order endpoints (require X-Section-Id) ────────────────────────

function tableHeaders(sectionId: string, contentType = true): HeadersInit {
  const headers: HeadersInit = {
    "X-Section-Id": sectionId,
  };
  if (contentType) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }
  return headers;
}

export async function fetchTableCart(
  tableId: string,
  sectionId: string,
): Promise<ApiTableCart> {
  const res = await fetch(`${getBaseUrl()}/restaurant/tables/${tableId}/cart`, {
    headers: tableHeaders(sectionId, false),
  });
  if (res.status === 404 || res.status === 410) {
    throw new TableSectionError(res.status);
  }
  if (res.status === 429) {
    throw new RateLimitError();
  }
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Failed to fetch cart");
  }
  const json: ApiResponse<ApiTableCart> = await res.json();
  if (json.status !== "success" || !json.data) {
    throw new Error(json.message || "Failed to fetch cart");
  }
  return json.data;
}

export async function addToTableCart(
  tableId: string,
  sectionId: string,
  body: {
    productId: string;
    quantity: number;
    selectedOptions?: Record<string, string>;
  },
): Promise<void> {
  const res = await fetch(
    `${getBaseUrl()}/restaurant/tables/${tableId}/cart/items`,
    {
      method: "POST",
      headers: tableHeaders(sectionId),
      body: JSON.stringify(body),
    },
  );
  if (res.status === 404 || res.status === 410) {
    throw new TableSectionError(res.status);
  }
  if (res.status === 429) {
    throw new RateLimitError();
  }
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Failed to add to cart");
  }
}

export async function updateTableCartItemQuantity(
  tableId: string,
  sectionId: string,
  cartItemId: string,
  quantity: number,
): Promise<void> {
  const res = await fetch(
    `${getBaseUrl()}/restaurant/tables/${tableId}/cart/items/${cartItemId}`,
    {
      method: "PUT",
      headers: tableHeaders(sectionId),
      body: JSON.stringify({ quantity }),
    },
  );
  if (res.status === 404 || res.status === 410) {
    throw new TableSectionError(res.status);
  }
  if (res.status === 429) {
    throw new RateLimitError();
  }
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Failed to update quantity");
  }
}

export async function updateTableCartItemOptions(
  tableId: string,
  sectionId: string,
  cartItemId: string,
  selectedOptions: Record<string, string>,
): Promise<void> {
  const res = await fetch(
    `${getBaseUrl()}/restaurant/tables/${tableId}/cart/items/${cartItemId}/options`,
    {
      method: "PATCH",
      headers: tableHeaders(sectionId),
      body: JSON.stringify({ selectedOptions }),
    },
  );
  if (res.status === 404 || res.status === 410) {
    throw new TableSectionError(res.status);
  }
  if (res.status === 429) {
    throw new RateLimitError();
  }
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Failed to update options");
  }
}

export async function removeFromTableCart(
  tableId: string,
  sectionId: string,
  cartItemId: string,
): Promise<void> {
  const res = await fetch(
    `${getBaseUrl()}/restaurant/tables/${tableId}/cart/items/${cartItemId}`,
    {
      method: "DELETE",
      headers: tableHeaders(sectionId, false),
    },
  );
  if (res.status === 404 || res.status === 410) {
    throw new TableSectionError(res.status);
  }
  if (res.status === 429) {
    throw new RateLimitError();
  }
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Failed to remove item");
  }
}

export async function placeTableOrder(
  tableId: string,
  sectionId: string,
  body?: {
    email?: string;
    phoneNumber?: string;
    customerName?: string;
  },
): Promise<ApiTableOrder> {
  const idempotencyKey = `order-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const res = await fetch(
    `${getBaseUrl()}/restaurant/tables/${tableId}/orders`,
    {
      method: "POST",
      headers: {
        "X-Section-Id": sectionId,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(body ?? {}),
    },
  );
  if (res.status === 404 || res.status === 410) {
    throw new TableSectionError(res.status);
  }
  if (res.status === 429) {
    throw new RateLimitError();
  }
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Failed to place order");
  }
  const json: ApiResponse<{ order: ApiTableOrder }> = await res.json();
  if (json.status !== "success" || !json.data?.order) {
    throw new Error(json.message || "Failed to place order");
  }
  return json.data.order;
}

export async function fetchTableOrder(
  tableId: string,
  sectionId: string,
  orderId: string,
): Promise<ApiTableOrder> {
  const res = await fetch(
    `${getBaseUrl()}/restaurant/tables/${tableId}/orders/${orderId}`,
    { headers: tableHeaders(sectionId, false) },
  );
  if (res.status === 404 || res.status === 410) {
    throw new TableSectionError(res.status);
  }
  if (res.status === 429) {
    throw new RateLimitError();
  }
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || "Failed to fetch order");
  }
  const json: ApiResponse<{ order: ApiTableOrder }> = await res.json();
  if (json.status !== "success" || !json.data?.order) {
    throw new Error(json.message || "Failed to fetch order");
  }
  return json.data.order;
}

// ─── Error types ─────────────────────────────────────────────────────────────

export class TableSectionError extends Error {
  constructor(public status: number) {
    super(
      status === 410
        ? "This QR code has expired. Please ask staff for a new one."
        : "Invalid table or section. Please scan the QR code again.",
    );
    this.name = "TableSectionError";
  }
}

export class RateLimitError extends Error {
  constructor() {
    super("Too many requests. Please wait a moment.");
    this.name = "RateLimitError";
  }
}
