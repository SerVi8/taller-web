import { api } from "@/lib/http/api-client";
import type {
  Product,
  ProductFilters,
  ProductInput,
  ProductsResponse,
} from "../model/product.types";

const productsUrl = "/product";

export const productApi = {
  list: async (filters: ProductFilters): Promise<ProductsResponse> =>
    (await api.get<ProductsResponse>(productsUrl, { params: filters })).data,

  getById: async (id: number): Promise<Product> =>
    (await api.get<Product>(`${productsUrl}/${id}`)).data,

  create: async (data: ProductInput): Promise<Product> =>
    (await api.post<Product>(productsUrl, data)).data,

  update: async (id: number, data: ProductInput): Promise<Product> =>
    (await api.patch<Product>(`${productsUrl}/${id}`, data)).data,

  remove: async (id: number): Promise<void> => {
    await api.delete(`${productsUrl}/${id}`);
  },
};
