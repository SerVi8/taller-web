import type { Product } from "../model/product.types";
import { useProduct, useProducts } from "./use-product-queries";
import { useProductCommands } from "./use-product-commands";
import type { ProductFormValues } from "../model/product.schema";
import { useListFilters } from "@/hooks/useListFilters";
import { useCrudDialogs } from "@/hooks/use-crud-dialogs";
import { useStockCommands } from "./use-stock-commands";
import type { StockEntryFormValues } from "../model/stock.schema";
import type { StockMovent } from "../model/stock.types";

export function useProductPage() {
  const list = useListFilters();

  const dialogsProducts = useCrudDialogs<Product>();
  const dialogsStockMovent = useCrudDialogs<StockMovent>();

  const productsQuery = useProducts(list.filters);
  const needsDetais =
    dialogsProducts.isViewOpen || dialogsProducts.dialog.type === "edit";
  const detailQuery = useProduct(
    needsDetais ? dialogsProducts.item?.id : undefined,
  );

  const { saveProduct, removeProduct, isSaving, isDeleting } =
    useProductCommands();

  const { saveStockEntry, isSaving: isSavingEntry } = useStockCommands();

  const handleSubmit = async (data: ProductFormValues) => {
    const editing =
      dialogsProducts.dialog.type === "edit"
        ? dialogsProducts.dialog.item
        : undefined;
    if (await saveProduct(editing, data)) dialogsProducts.close();
  };

  const handleSubmitEntry = async (data: StockEntryFormValues) => {
    if (await saveStockEntry(data)) dialogsStockMovent.close();
  };

  const handleDelete = async () => {
    if (dialogsProducts.dialog.type !== "delete") return;
    if (await removeProduct(dialogsProducts.dialog.item))
      dialogsProducts.close();
  };

  return {
    list,
    dialogsProducts,
    dialogsStockMovent,
    productsQuery,
    detailQuery,
    isSaving,
    isSavingEntry,
    isDeleting,
    handleSubmit,
    handleDelete,
    handleSubmitEntry,
  };
}
