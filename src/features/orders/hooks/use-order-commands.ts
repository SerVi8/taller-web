import { getApiErrorMessage } from "@/lib/http/get-api-error-message";
import { toastError, toastSuccess } from "@/lib/feedback/toast";
import type {
  CreateOrderItemInput,
  CreateOrderServiceInput,
  CreateWorkOrderInput,
  UpdateOrderItemInput,
  UpdateOrderServiceInput,
  UpdateWorkOrderInput,
  WorkOrder,
} from "../model/order.types";
import {
  useAddOrderItem,
  useAddOrderService,
  useCancelOrder,
  useCompleteOrder,
  useCreateOrder,
  useRemoveOrderItem,
  useRemoveOrderService,
  useStartOrder,
  useUpdateOrder,
  useUpdateOrderItem,
  useUpdateOrderService,
} from "./use-order-mutations";

export function useOrderCommands() {
  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();
  const startMutation = useStartOrder();
  const completeMutation = useCompleteOrder();
  const cancelMutation = useCancelOrder();

  const addServiceMutation = useAddOrderService();
  const updateServiceMutation = useUpdateOrderService();
  const removeServiceMutation = useRemoveOrderService();

  const addItemMutation = useAddOrderItem();
  const updateItemMutation = useUpdateOrderItem();
  const removeItemMutation = useRemoveOrderItem();

  const createOrder = async (
    data: CreateWorkOrderInput,
  ): Promise<WorkOrder | null> => {
    try {
      const created = await createMutation.mutateAsync(data);
      toastSuccess(`Orden ${created.code} creada correctamente.`);
      return created;
    } catch (error) {
      toastError(getApiErrorMessage(error, "No se pudo crear la orden."));
      return null;
    }
  };

  const updateOrder = async (id: number, data: UpdateWorkOrderInput) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toastSuccess("Datos de la orden actualizados.");
      return true;
    } catch (error) {
      toastError(getApiErrorMessage(error, "No se pudo actualizar la orden."));
      return false;
    }
  };

  const startOrder = async (id: number) => {
    try {
      await startMutation.mutateAsync(id);
      toastSuccess("Orden puesta en progreso.");
      return true;
    } catch (error) {
      toastError(getApiErrorMessage(error, "No se pudo iniciar la orden."));
      return false;
    }
  };

  const completeOrder = async (id: number, mileageOut: number) => {
    try {
      await completeMutation.mutateAsync({ id, mileageOut });
      toastSuccess("Orden completada correctamente.");
      return true;
    } catch (error) {
      toastError(getApiErrorMessage(error, "No se pudo completar la orden."));
      return false;
    }
  };

  const cancelOrder = async (id: number, reason: string) => {
    try {
      await cancelMutation.mutateAsync({ id, reason });
      toastSuccess("Orden cancelada y stock devuelto al inventario.");
      return true;
    } catch (error) {
      toastError(getApiErrorMessage(error, "No se pudo cancelar la orden."));
      return false;
    }
  };

  const addService = async (orderId: number, data: CreateOrderServiceInput) => {
    try {
      await addServiceMutation.mutateAsync({ orderId, data });
      toastSuccess("Servicio agregado a la orden.");
      return true;
    } catch (error) {
      toastError(getApiErrorMessage(error, "No se pudo agregar el servicio."));
      return false;
    }
  };

  const updateService = async (
    orderId: number,
    serviceId: number,
    data: UpdateOrderServiceInput,
  ) => {
    try {
      await updateServiceMutation.mutateAsync({ orderId, serviceId, data });
      toastSuccess("Servicio actualizado.");
      return true;
    } catch (error) {
      toastError(
        getApiErrorMessage(error, "No se pudo actualizar el servicio."),
      );
      return false;
    }
  };

  const removeService = async (orderId: number, serviceId: number) => {
    try {
      await removeServiceMutation.mutateAsync({ orderId, serviceId });
      toastSuccess("Servicio eliminado de la orden.");
      return true;
    } catch (error) {
      toastError(getApiErrorMessage(error, "No se pudo eliminar el servicio."));
      return false;
    }
  };

  const addItem = async (orderId: number, data: CreateOrderItemInput) => {
    try {
      await addItemMutation.mutateAsync({ orderId, data });
      toastSuccess("Producto agregado y descontado del stock.");
      return true;
    } catch (error) {
      toastError(getApiErrorMessage(error, "No se pudo agregar el producto."));
      return false;
    }
  };

  const updateItem = async (
    orderId: number,
    itemId: number,
    data: UpdateOrderItemInput,
  ) => {
    try {
      await updateItemMutation.mutateAsync({ orderId, itemId, data });
      toastSuccess("Producto actualizado y stock ajustado.");
      return true;
    } catch (error) {
      toastError(
        getApiErrorMessage(error, "No se pudo actualizar el producto."),
      );
      return false;
    }
  };

  const removeItem = async (orderId: number, itemId: number) => {
    try {
      await removeItemMutation.mutateAsync({ orderId, itemId });
      toastSuccess("Producto eliminado y devuelto al stock.");
      return true;
    } catch (error) {
      toastError(getApiErrorMessage(error, "No se pudo eliminar el producto."));
      return false;
    }
  };

  return {
    createOrder,
    updateOrder,
    startOrder,
    completeOrder,
    cancelOrder,
    addService,
    updateService,
    removeService,
    addItem,
    updateItem,
    removeItem,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isStarting: startMutation.isPending,
    isCompleting: completeMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isAddingService: addServiceMutation.isPending,
    isUpdatingService: updateServiceMutation.isPending,
    isRemovingService: removeServiceMutation.isPending,
    isAddingItem: addItemMutation.isPending,
    isUpdatingItem: updateItemMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
  };
}
