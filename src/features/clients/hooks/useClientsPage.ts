import type { Client } from "../model/client.types";
import type { ClientFormValues } from "../model/client.schema";
import { useClientCommands } from "./use-client-commands";
import { useClient, useClients } from "./use-client-queries";
import { useListFilters } from "@/hooks/useListFilters";
import { useCrudDialogs } from "@/hooks/use-crud-dialogs";

export function useClientsPage() {
  const list = useListFilters();
  const dialogs = useCrudDialogs<Client>();

  // Keep the API query behind a debounce while the input remains controlled immediately.
  const clientsQuery = useClients(list.filters);
  const needsDetail = dialogs.isViewOpen || dialogs.dialog.type === "edit";
  const detailQuery = useClient(needsDetail ? dialogs.item?.id : undefined);
  const { saveClient, removeClient, isSaving, isDeleting } =
    useClientCommands();

  const handleSubmit = async (data: ClientFormValues) => {
    const editing =
      dialogs.dialog.type === "edit" ? dialogs.dialog.item : undefined;
    if (await saveClient(editing, data)) dialogs.close();
  };

  const handleDelete = async () => {
    if (dialogs.dialog.type !== "delete") return;
    if (await removeClient(dialogs.dialog.item)) dialogs.close();
  };

  return {
    list,
    dialogs,
    clientsQuery,
    detailQuery,
    isSaving,
    isDeleting,
    handleSubmit,
    handleDelete,
  };
}
