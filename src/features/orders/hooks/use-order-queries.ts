import { useQuery } from "@tanstack/react-query";
import { orderApi } from "../api/order.api";
import { orderKeys } from "../model/order.keys";
import type { WorkOrderFilters } from "../model/order.types";

export function useOrders(filters: WorkOrderFilters) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => orderApi.list(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useOrder(idOrCode: number | string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(idOrCode ?? ""),
    queryFn: () => orderApi.getById(idOrCode!),
    enabled: idOrCode !== undefined && String(idOrCode).trim() !== "",
  });
}
