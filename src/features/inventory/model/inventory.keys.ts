import type { ProductFilters } from "./product.types";
import type { StockMovementFilters } from "./stock.types";

export const productKeys = {
  all: ["product"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "details"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

export const stockKeys = {
  all: ["stock"] as const,
  movements: () => [...stockKeys.all, "movement"] as const,
  movement: (filters: StockMovementFilters) =>
    [...stockKeys.movements(), filters] as const,
};
