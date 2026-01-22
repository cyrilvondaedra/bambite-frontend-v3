export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface MenuItem {
  id: string;
  name: string;
  thaiName: string;
  description: string;
  categoryId: string;
  ingredients: string;
  price: string; 
  stockQuantity: number;
  imageUrls: string[];
  createdAt: string; 
  updatedAt: string; 
  category: Category;
  productOptions: MenuItemOption[];
}

// Category
export interface Category {
  id: string;
  name: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}


export interface MenuItemOption {
  id: string;
  productId: string;
  optionId: string;
  createdAt: string;
  option: Option;
}


export interface Option {
  id: string;
  name: string;
  displayName: string;
  optionLists: string[];
  createdAt: string;
  updatedAt: string;
}

export type MenuItemListResponse = ApiResponse<MenuItem[]>;
