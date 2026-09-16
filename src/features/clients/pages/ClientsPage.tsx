import { useState } from "react";
import type { Cliente, ClienteFilters } from "../types/client.types";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { ClientsFilter } from "../components/ClientsFilter";
import { ClientsTable } from "../components/ClientsTable";
import { ClientModal } from "../components/ClientModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog/ConfirmDialog";
import {
  useClientes,
  useCreateCliente,
  useDeleteCliente,
  useUpdateCliente,
} from "../hooks/useClients";
import { toastError, toastSuccess } from "@/lib/toast";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ClienteFormData } from "../schemas/client.schema";
import { LoadingState } from "@/components/common/LoadingState/LoadingState";
import { ErrorState } from "@/components/common/ErrorState/ErrorState";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import { Plus } from "lucide-react";
import { Pagination } from "@/components/common/DataTable/Pagination";

export const ClientsPage = () => {
  const [filters, setFilters] = useState<ClienteFilters>({
    search: "",
    page: 1,
    limit: 10,
  });

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedClient, setSelectedClient] = useState<Cliente | undefined>();

  const [clientToDelete, setClientToDelete] = useState<Cliente | null>(null);

  const clientsQuery = useClientes(filters);
  const createClient = useCreateCliente();
  const updateClient = useUpdateCliente();
  const deleteClient = useDeleteCliente();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const isSaving = createClient.isPending || updateClient.isPending;

  const handleSearchChange = (search: string) => {
    setFilters({
      search,
      page: 1,
      limit: filters.limit,
    });
  };

  const handleCreate = () => {
    setSelectedClient(undefined);
    setModalOpen(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedClient(cliente);
    setModalOpen(true);
  };

  const handleSubmit = async (data: ClienteFormData) => {
    try {
      if (selectedClient) {
        await updateClient.mutateAsync({
          id: selectedClient.id,
          data,
        });

        toastSuccess("Cliente actualizado correctamente");
      } else {
        await createClient.mutateAsync(data);
        toastSuccess("Cliente registrado correctamente");
      }

      setModalOpen(false);
      setSelectedClient(undefined);
    } catch (error) {
      toastError(
        getApiErrorMessage(
          error,
          selectedClient
            ? "No se pudo actualizar el cliente."
            : "No se pudo registrar el cliente.",
        ),
      );
    }
  };

  const handleDeleteRequest = (cliente: Cliente) => {
    setClientToDelete(cliente);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!clientToDelete) {
      return;
    }

    try {
      await deleteClient.mutateAsync(clientToDelete.id);

      toastSuccess("Cliente eliminado correctamente");

      setClientToDelete(null);
      setDeleteOpen(false);
    } catch (error) {
      toastError(getApiErrorMessage(error, "No se pudo eliminar el cliente."));
    }
  };

  const handleModalChange = (open: boolean) => {
    setModalOpen(open);

    if (!open) {
      setSelectedClient(undefined);
    }
  };

  if (clientsQuery.isLoading) {
    return <LoadingState message="Cargando clientes..." />;
  }

  if (clientsQuery.isError) {
    return (
      <ErrorState
        title="No se pudieron cargar los clientes"
        message={getApiErrorMessage(
          clientsQuery.error,
          "Ocurrió un error al cargar los clientes.",
        )}
        onRetry={() => clientsQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gestiona los clientes registrados en el taller."
        action={<Button onClick={handleCreate}>Nuevo cliente</Button>}
      />

      <ClientsFilter
        search={filters.search}
        onSearchChange={handleSearchChange}
      />

      {clientsQuery.isSuccess && clientsQuery.data.data.length === 0 && (
        <EmptyState
          title={
            filters.search
              ? "No se encontraron clientes"
              : "No hay clientes registrados"
          }
          action={
            !filters.search && (
              <Button onClick={handleCreate}>
                <Plus />
                Registrar cliente
              </Button>
            )
          }
        />
      )}

      {clientsQuery.isSuccess && clientsQuery.data.data.length > 0 && (
        <>
          <ClientsTable
            clientes={clientsQuery.data.data}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />

          <Pagination
            page={clientsQuery.data.pagination.page}
            totalPages={clientsQuery.data.pagination.totalPages}
            onPageChange={() => {}}
          />
        </>
      )}

      <ClientModal
        open={modalOpen}
        onOpenChange={handleModalChange}
        cliente={selectedClient}
        onSubmit={handleSubmit}
        isSubmitting={isSaving}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="¿Eliminar cliente?"
        description={
          clientToDelete
            ? `Se eliminará a ${clientToDelete.nombre}. Esta acción no se puede deshacer.`
            : undefined
        }
        confirmText="Eliminar"
        onConfirm={handleDelete}
        loading={deleteClient.isPending}
      />
    </div>
  );
};
