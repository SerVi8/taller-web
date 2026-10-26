import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productKeys, stockKeys } from "../model/inventory.keys";
import type { StockEntryInput } from "../model/stock.types";
import { stockApi } from "../api/stock.api";

export function useCreateEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StockEntryInput) => stockApi.entry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stockKeys.movements() });
    },
  });
}
