import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../api/order.api";
import { orderKeys } from "../model/order.keys";
import { productKeys, stockKeys } from "@/features/inventory/model/inventory.keys";
import type {
  CreateOrderItemInput,
  CreateOrderServiceInput,
  CreateWorkOrderInput,
  UpdateOrderItemInput,
  UpdateOrderServiceInput,
  UpdateWorkOrderInput,
} from "../model/order.types";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkOrderInput) => orderApi.create(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: stockKeys.movements() }),
      ]);
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateWorkOrderInput }) =>
      orderApi.update(id, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.details() }),
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
      ]);
    },
  });
}

export function useStartOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => orderApi.start(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.details() }),
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
      ]);
    },
  });
}

export function useCompleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, mileageOut }: { id: number; mileageOut: number }) =>
      orderApi.complete(id, mileageOut),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.details() }),
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
      ]);
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      orderApi.cancel(id, reason),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.details() }),
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: stockKeys.movements() }),
      ]);
    },
  });
}

export function useAddOrderService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: number;
      data: CreateOrderServiceInput;
    }) => orderApi.addService(orderId, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.details() }),
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
      ]);
    },
  });
}

export function useUpdateOrderService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      serviceId,
      data,
    }: {
      orderId: number;
      serviceId: number;
      data: UpdateOrderServiceInput;
    }) => orderApi.updateService(orderId, serviceId, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.details() }),
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
      ]);
    },
  });
}

export function useRemoveOrderService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      serviceId,
    }: {
      orderId: number;
      serviceId: number;
    }) => orderApi.removeService(orderId, serviceId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.details() }),
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
      ]);
    },
  });
}

export function useAddOrderItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: number;
      data: CreateOrderItemInput;
    }) => orderApi.addItem(orderId, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.details() }),
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: stockKeys.movements() }),
      ]);
    },
  });
}

export function useUpdateOrderItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      itemId,
      data,
    }: {
      orderId: number;
      itemId: number;
      data: UpdateOrderItemInput;
    }) => orderApi.updateItem(orderId, itemId, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.details() }),
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: stockKeys.movements() }),
      ]);
    },
  });
}

export function useRemoveOrderItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      itemId,
    }: {
      orderId: number;
      itemId: number;
    }) => orderApi.removeItem(orderId, itemId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orderKeys.details() }),
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: stockKeys.movements() }),
      ]);
    },
  });
}
