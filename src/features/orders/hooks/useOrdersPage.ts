import { useState } from "react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useCrudDialogs } from "@/hooks/use-crud-dialogs";
import { useOrder, useOrders } from "./use-order-queries";
import type { WorkOrder, WorkOrderStatus } from "../model/order.types";

export function useOrdersPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<WorkOrderStatus | "all">("all");
  const [clientId, setClientId] = useState<number | undefined>(undefined);

  const dialogs = useCrudDialogs<WorkOrder>();

  const filters = {
    page,
    limit: 10,
    status,
    ...(clientId && { clientId }),
    ...(debouncedSearch && { q: debouncedSearch }),
  };

  const ordersQuery = useOrders(filters);
  const detailQuery = useOrder(
    dialogs.isViewOpen ? dialogs.item?.code : undefined,
  );

  return {
    search,
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    status,
    setStatus: (value: WorkOrderStatus | "all") => {
      setStatus(value);
      setPage(1);
    },
    clientId,
    setClientId: (value: number | undefined) => {
      setClientId(value);
      setPage(1);
    },
    page,
    setPage,
    dialogs,
    ordersQuery,
    detailQuery,
  };
}
