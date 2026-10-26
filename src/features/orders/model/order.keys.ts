import type { WorkOrderFilters } from "./order.types";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: WorkOrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (idOrCode: number | string) =>
    [...orderKeys.details(), String(idOrCode)] as const,
};
