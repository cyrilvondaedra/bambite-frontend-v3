/**
 * Types for Restaurant Table Order API (no auth, X-Section-Id header)
 */

export interface ApiProductCategory {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ApiProductOption {
  id: string;
  name: string;
  displayName: string;
  optionLists: string[];
}

export interface ApiProductOptionWrapper {
  option: ApiProductOption;
}

export interface ApiProduct {
  id: string;
  name: string;
  thaiName?: string | null;
  description: string;
  price: string; // Backend returns price as string
  stockQuantity: number;
  imageUrls: string[];
  category: ApiProductCategory;
  productOptions: ApiProductOptionWrapper[];
}

// Product detail type (from GET /api/v1/products/:id)
export interface ApiProductDetail {
  id: string;
  name: string;
  thaiName?: string | null;
  description: string;
  categoryId: string;
  ingredients?: string | null;
  price: string; // Backend returns price as string (same as other endpoints)
  stockQuantity: number;
  imageUrls: string[];
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  productOptions: Array<{
    id: string;
    productId: string;
    optionId: string;
    createdAt: string;
    option: ApiProductOption;
  }>;
}

export interface ApiCategory {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ApiCartItem {
  id: string;
  productId: string;
  name: string;
  description: string | null;
  price: string; // Backend returns price as string
  quantity: number;
  subtotal: string; // Backend returns subtotal as string
  stockQuantity: number;
  category: ApiProductCategory;
  selectedOptions: Record<string, string>;
  selectedOptionsDisplay?: { displayName: string; value: string }[];
  productOptions: ApiProductOption[];
  imageUrls: string[];
}

export interface ApiTableCart {
  items: ApiCartItem[];
  totalItems: number;
  totalPrice: string; // Backend returns as string
}

export interface ApiOrderItem {
  id: string;
  productId: string;
  product: { id: string; name: string; price: string };
  quantity: number;
  priceAtTime: string; // Backend returns as string
  netPrice: string; // Backend returns as string
  selectedOptionsSnapshot?: {
    optionId: string;
    optionName: string;
    selectedValue: string;
  }[];
}

export interface ApiTableOrder {
  id: string;
  tableId: string;
  sectionId: string;
  email: string | null;
  phoneNumber: string | null;
  customerName: string | null;
  status: "PENDING" | "PREPARING" | "SERVED" | "PAID" | "CANCELLED";
  total: string; // Backend returns as string
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  message?: string;
}

export interface ApiProductsMeta {
  page: number;
  limit: number;
  total: number;
}

// Orders list for table section
export interface ApiTableOrdersList {
  id: string;
  tableId: string;
  sectionId: string;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";
  total: string;
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
}
