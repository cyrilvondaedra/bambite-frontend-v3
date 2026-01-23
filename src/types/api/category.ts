export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
}

export interface CategoryCount {
  products: number;
}

export interface Category {
  id: string;
  name: string;
  status: "active" | "inactive";
  createdAt: string; 
  updatedAt: string; 
  _count: CategoryCount;
}

export type CategoryListResponse = ApiResponse<Category[]>;
