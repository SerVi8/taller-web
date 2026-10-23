import { getApiErrorMessage } from "@/lib/http/get-api-error-message";
import { toastError, toastSuccess } from "@/lib/feedback/toast";
import type { ClientFormValues } from "../model/client.schema";
import type { Client } from "../model/client.types";
import {
  useCreateClient,
  useDeleteClient,
  useUpdateClient,
} from "./use-client-mutations";

export function useClientCommands() {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const saveClient = async (
    client: Client | undefined,
    values: ClientFormValues,
  ) => {
    try {
      if (client) {
        await updateClient.mutateAsync({ id: client.id, data: values });
        toastSuccess("Cliente actualizado correctamente.");
      } else {
        await createClient.mutateAsync(values);
        toastSuccess("Cliente registrado correctamente.");
      }
      return true;
    } catch (error) {
      toastError(
        getApiErrorMessage(
          error,
          client
            ? "No se pudo actualizar el cliente."
            : "No se pudo registrar el cliente.",
        ),
      );
      return false;
    }
  };

  const removeClient = async (client: Client) => {
    try {
      await deleteClient.mutateAsync(client.id);
      toastSuccess("Cliente eliminado correctamente.");
      return true;
    } catch (error) {
      toastError(getApiErrorMessage(error, "No se pudo eliminar el cliente."));
      return false;
    }
  };

  return {
    saveClient,
    removeClient,
    isSaving: createClient.isPending || updateClient.isPending,
    isDeleting: deleteClient.isPending,
  };
}
