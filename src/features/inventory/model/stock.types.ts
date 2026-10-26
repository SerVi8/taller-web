import type { Pagination } from "@/types/api.types";

export const MOVEMENT_REASON = [
  "purchase",
  "work_order",
  "return",
  "adjustment",
] as const;

export type MovementReason = (typeof MOVEMENT_REASON)[number];

export const MOVEMENT_REASON_LABELS: Record<MovementReason, string> = {
  work_order: "Orden de Tabajo",
  purchase: "Compra",
  return: "Devolucion",
  adjustment: "Ajuste",
};

export interface StockMovent {
  id: number;
  productId: number;
  quantity: string;
  reason: MovementReason;
  workOrderId: number | null;
  workOrder: {
    id: number;
    code: string;
  } | null;
  //  userId: ForeignKey<number>;
  unitCost: string | null;
  notes: string | null;

  createdAt: Date;

  product: {
    id: number;
    name: string;
    sku: string;
    unit: string;
  };
}

export interface ItemInput {
  productId: number;
  quantity: number;
  unitCost: number;
}

export interface StockEntryInput {
  notes: string | null;
  items: ItemInput[];
}

export interface StockMovementFilters {
  q?: string;
  from?: string;
  to?: string;
  reason?: MovementReason;
  page: number;
  limit: number;
}

export interface StockMoventsResponce {
  data: StockMovent[];
  meta: Pagination;
}
