import { useListFilters } from "@/hooks/useListFilters";
import { useCrudDialogs } from "@/hooks/use-crud-dialogs";
import { useStockCommands } from "./use-stock-commands";
import type { StockEntryFormValues } from "../model/stock.schema";
import type { StockMovementFilters, StockMovent } from "../model/stock.types";
import { useStockMovements } from "./use-stock-queries";

export function useStockMovementPage() {
  const list = useListFilters<StockMovementFilters>();

  const dialog = useCrudDialogs<StockMovent>();

  const movementsQuery = useStockMovements(list.filters);

  //detalles de Movimiento
  /* const detailQuery = useProduct(
    dialog.isViewOpen ? dialog.item?.id : undefined,
  ); */

  const { saveStockEntry, isSaving } = useStockCommands();

  const handleSubmit = async (data: StockEntryFormValues) => {
    if (await saveStockEntry(data)) dialog.close();
  };

  return {
    list,
    dialog,
    movementsQuery,
    isSaving,
    handleSubmit,
  };
}
