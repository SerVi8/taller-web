import { useQuery } from "@tanstack/react-query";
import type { ProductFilters } from "../model/product.types";
import { productKeys } from "../model/inventory.keys";
import { productApi } from "../api/product.api";

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productApi.list(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useProduct(id: number | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? 0),
    queryFn: () => productApi.getById(id!),
    enabled: id !== undefined,
  });
}
