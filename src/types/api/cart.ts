export interface FetchCartResponse {
  items: CartItemFromBackend[];
}

export interface CartItemFromBackend {
  id: string;
  productId: string;

  name: string;
  description: string | null;

  category: Category;
  imageUrls: string[];

  price: string;
  quantity: number;
  stockQuantity: number;

  selectedOptions: Record<string, string | number>;
  thaiName?: string;
  productOptions: ProductOption[];
  selectedOptionsDisplay: SelectedOptionDisplay[];

  subtotal: number;
}

export interface Category {
  id: string;
  name: string;
  status: "active" | "inactive" | string;
}

export interface ProductOption {
  id: string;
  name: string;
  displayName: string;
  optionLists: string[];
}

export interface SelectedOptionDisplay {
  id?: string;
  displayName: string;
  value: string;
}

export interface CartItem {
  id: string;
  productId: string;

  title: string;
  description: string;
  thaiName: string;

  image: string;
  price: string;
  quantity: number;
  subtotal?: number;

  selectedOptions: Record<string, string | number>;
  selectedOptionsDisplay: SelectedOptionDisplay[] | null;
}
