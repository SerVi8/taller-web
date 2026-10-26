import type { Pagination } from "@/types/api.types";
import type { Client, Vehicle } from "@/features/clients/model/client.types";
import type { Product } from "@/features/inventory/model/product.types";

export const WORK_ORDER_STATUSES = [
  "price",
  "open",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[number];

export const WORK_ORDER_STATUS_LABELS: Record<WorkOrderStatus, string> = {
  price: "Cotización",
  open: "Abierta",
  in_progress: "En progreso",
  completed: "Completada",
  cancelled: "Cancelada",
};

export interface WorkOrderServiceItem {
  id: number;
  workOrderId: number;
  title: string | null;
  description: string;
  price: number | string;
  complete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderProductItem {
  id: number;
  workOrderId: number;
  productId: number;
  quantity: number | string;
  unitCost: number | string;
  unitPrice: number | string;
  product?: Pick<Product, "id" | "sku" | "name" | "unit" | "salePrice">;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrder {
  id: number;
  code: string;
  vehicleId: number;
  clientId: number;
  status: WorkOrderStatus;
  mileageIn: number;
  mileageOut: number | null;
  complaint: string;
  diagnosis: string | null;
  observations: string | null;
  recommendations: string | null;
  discount: number | string;
  total: number | string;
  openedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  client?: Client;
  vehicle?: Vehicle;
  services?: WorkOrderServiceItem[];
  items?: WorkOrderProductItem[];
}

export interface WorkOrderFilters {
  page: number;
  limit: number;
  q?: string;
  status?: WorkOrderStatus | "all";
  clientId?: number;
  vehicleId?: number;
}

export interface WorkOrdersResponse {
  data: WorkOrder[];
  meta: Pagination;
}

export interface CreateOrderServiceInput {
  title?: string | null;
  description: string;
  price: number;
  complete?: boolean;
}

export interface UpdateOrderServiceInput {
  title?: string | null;
  description?: string;
  price?: number;
  complete?: boolean;
}

export interface CreateOrderItemInput {
  productId: number;
  quantity: number;
  unitPrice?: number;
}

export interface UpdateOrderItemInput {
  quantity: number;
  unitPrice?: number;
}

export interface CreateWorkOrderInput {
  vehicleId: number;
  status?: WorkOrderStatus;
  mileageIn: number;
  complaint: string;
  diagnosis?: string | null;
  observations?: string | null;
  recommendations?: string | null;
  discount?: number;
  services?: CreateOrderServiceInput[];
  items?: CreateOrderItemInput[];
}

export interface UpdateWorkOrderInput {
  complaint?: string;
  diagnosis?: string | null;
  observations?: string | null;
  recommendations?: string | null;
  discount?: number;
}
