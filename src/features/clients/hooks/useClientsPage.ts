import { useState } from "react";
import type { Client, ClientFilters } from "../model/client.types";
import type { ClientFormValues } from "../model/client.schema";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useClientCommands } from "./use-client-commands";
import { useClient, useClients } from "./use-client-queries";

export function useClientsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [pagination, setPagination] = useState<Omit<ClientFilters, "q">>({
    status: "active",
    page: 1,
    limit: 10,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client>();
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Keep the API query behind a debounce while the input remains controlled immediately.
  const filters: ClientFilters = { ...pagination, q: debouncedSearch };
  const clientsQuery = useClients(filters);
  const detailQuery = useClient(selectedClient?.id);
  const { saveClient, removeClient, isSaving, isDeleting } = useClientCommands();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPagination((current) => ({ ...current, page: 1 }));
  };
  const handlePageChange = (page: number) =>
    setPagination((current) => ({ ...current, page }));
  const handleCreate = () => {
    setSelectedClient(undefined);
    setModalOpen(true);
  };
  const handleView = (client: Client) => {
    setSelectedClient(client);
    setDetailsOpen(true);
  };
  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };
  const handleDeleteRequest = (client: Client) => {
    setClientToDelete(client);
    setDeleteOpen(true);
  };

  const handleSubmit = async (data: ClientFormValues) => {
    if (await saveClient(selectedClient, data)) {
      setModalOpen(false);
      setSelectedClient(undefined);
    }
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;
    if (await removeClient(clientToDelete)) {
      setClientToDelete(null);
      setDeleteOpen(false);
    }
  };

  const closeForm = (open: boolean) => {
    setModalOpen(open);
    if (!open) setSelectedClient(undefined);
  };
  const closeDetails = (open: boolean) => {
    setDetailsOpen(open);
    if (!open) setSelectedClient(undefined);
  };
  const editFromDetails = () => {
    setDetailsOpen(false);
    setModalOpen(true);
  };

  return {
    search,
    filters,
    clientsQuery,
    detailQuery,
    selectedClient,
    clientToDelete,
    modalOpen,
    detailsOpen,
    deleteOpen,
    isSaving,
    isDeleting,
    setDeleteOpen,
    handleSearchChange,
    handlePageChange,
    handleCreate,
    handleView,
    handleEdit,
    handleDeleteRequest,
    handleSubmit,
    handleDelete,
    closeForm,
    closeDetails,
    editFromDetails,
  };
}
