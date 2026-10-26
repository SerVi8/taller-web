import { useQuery } from "@tanstack/react-query";
import type { ProductFilters } from "../model/product.types";
import { stockKeys } from "../model/inventory.keys";
import { stockApi } from "../api/stock.api";

export function useStockMovements(filters: ProductFilters) {
  return useQuery({
    queryKey: stockKeys.movement(filters),
    queryFn: () => stockApi.listMovements(filters),
    placeholderData: (previousData) => previousData,
  });
}
