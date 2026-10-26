import { api } from "@/lib/http/api-client";
import type {
  CreateOrderItemInput,
  CreateOrderServiceInput,
  CreateWorkOrderInput,
  UpdateOrderItemInput,
  UpdateOrderServiceInput,
  UpdateWorkOrderInput,
  WorkOrder,
  WorkOrderFilters,
  WorkOrdersResponse,
} from "../model/order.types";

const ordersUrl = "/orders";

export const orderApi = {
  list: async (filters: WorkOrderFilters): Promise<WorkOrdersResponse> =>
    (await api.get<WorkOrdersResponse>(ordersUrl, { params: filters })).data,

  getById: async (idOrCode: number | string): Promise<WorkOrder> =>
    (await api.get<WorkOrder>(`${ordersUrl}/${idOrCode}`)).data,

  create: async (data: CreateWorkOrderInput): Promise<WorkOrder> =>
    (await api.post<WorkOrder>(ordersUrl, data)).data,

  update: async (id: number, data: UpdateWorkOrderInput): Promise<WorkOrder> =>
    (await api.patch<WorkOrder>(`${ordersUrl}/${id}`, data)).data,

  start: async (id: number): Promise<WorkOrder> =>
    (await api.post<WorkOrder>(`${ordersUrl}/${id}/start`)).data,

  complete: async (id: number, mileageOut: number): Promise<WorkOrder> =>
    (
      await api.post<WorkOrder>(`${ordersUrl}/${id}/complete`, {
        mileageOut,
      })
    ).data,

  cancel: async (id: number, reason: string): Promise<WorkOrder> =>
    (await api.post<WorkOrder>(`${ordersUrl}/${id}/cancel`, { reason })).data,

  addService: async (
    orderId: number,
    data: CreateOrderServiceInput,
  ): Promise<WorkOrder> =>
    (await api.post<WorkOrder>(`${ordersUrl}/${orderId}/services`, data)).data,

  updateService: async (
    orderId: number,
    serviceId: number,
    data: UpdateOrderServiceInput,
  ): Promise<WorkOrder> =>
    (
      await api.patch<WorkOrder>(
        `${ordersUrl}/${orderId}/services/${serviceId}`,
        data,
      )
    ).data,

  removeService: async (orderId: number, serviceId: number): Promise<void> => {
    await api.delete(`${ordersUrl}/${orderId}/services/${serviceId}`);
  },

  addItem: async (
    orderId: number,
    data: CreateOrderItemInput,
  ): Promise<WorkOrder> =>
    (await api.post<WorkOrder>(`${ordersUrl}/${orderId}/items`, data)).data,

  updateItem: async (
    orderId: number,
    itemId: number,
    data: UpdateOrderItemInput,
  ): Promise<WorkOrder> =>
    (
      await api.patch<WorkOrder>(
        `${ordersUrl}/${orderId}/items/${itemId}`,
        data,
      )
    ).data,

  removeItem: async (orderId: number, itemId: number): Promise<void> => {
    await api.delete(`${ordersUrl}/${orderId}/items/${itemId}`);
  },
};
