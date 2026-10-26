import { getApiErrorMessage } from "@/lib/http/get-api-error-message";
import { toastError, toastSuccess } from "@/lib/feedback/toast";
import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "./use-product-mutations";
import type { Product } from "../model/product.types";
import type { ProductFormValues } from "../model/product.schema";

export function useProductCommands() {
  const createClient = useCreateProduct();
  const updateClient = useUpdateProduct();
  const deleteClient = useDeleteProduct();

  const saveProduct = async (
    product: Product | undefined,
    values: ProductFormValues,
  ) => {
    try {
      if (product) {
        await updateClient.mutateAsync({ id: product.id, data: values });
        toastSuccess("Producto actualizado correctamente.");
      } else {
        await createClient.mutateAsync(values);
        toastSuccess("Producto registrado correctamente.");
      }
      return true;
    } catch (error) {
      toastError(
        getApiErrorMessage(
          error,
          product
            ? "No se pudo actualizar el producto."
            : "No se pudo registrar el producto.",
        ),
      );
      return false;
    }
  };

  const removeProduct = async (product: Product) => {
    try {
      await deleteClient.mutateAsync(product.id);
      toastSuccess("Producto eliminado correctamente.");
      return true;
    } catch (error) {
      toastError(getApiErrorMessage(error, "No se pudo eliminar el Producto."));
      return false;
    }
  };

  return {
    saveProduct,
    removeProduct,
    isSaving: createClient.isPending || updateClient.isPending,
    isDeleting: deleteClient.isPending,
  };
}
