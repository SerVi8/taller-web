import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductInput } from "../model/product.types";
import { productApi } from "../api/product.api";
import { productKeys } from "../model/inventory.keys";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductInput) => productApi.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductInput }) =>
      productApi.update(id, data),
    onSuccess: async (_client, { id }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
      ]);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productApi.remove(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
  });
}
