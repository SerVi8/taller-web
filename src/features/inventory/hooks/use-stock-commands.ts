import { getApiErrorMessage } from "@/lib/http/get-api-error-message";
import { toastError, toastSuccess } from "@/lib/feedback/toast";
import { useCreateEntry } from "./use-stock-mutations";
import type { StockEntryFormValues } from "../model/stock.schema";

export function useStockCommands() {
  const createEntry = useCreateEntry();

  const saveStockEntry = async (values: StockEntryFormValues) => {
    try {
      await createEntry.mutateAsync(values);
      toastSuccess("Entrada registrado correctamente.");
      return true;
    } catch (error) {
      toastError(getApiErrorMessage(error, "No se pudo registrar la entrada."));
      return false;
    }
  };

  return {
    saveStockEntry,
    isSaving: createEntry.isPending,
  };
}
