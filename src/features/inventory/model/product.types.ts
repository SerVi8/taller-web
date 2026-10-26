import type { Pagination } from "@/types/api.types";

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  unit: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInput {
  sku: string;
  name: string;
  description: string | null;
  unit: string;
  costPrice: number | null;
  salePrice: number | null;
  minStock: number | null;
  initialStock: number | null;
  active: boolean;
}

export interface ProductFilters {
  q?: string;
  status: "active" | "inactive" | "all";
  page: number;
  limit: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: Pagination;
}
