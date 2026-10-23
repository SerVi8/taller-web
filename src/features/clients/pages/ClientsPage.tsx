import PageHeader from "@/components/common/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import { ErrorState } from "@/components/common/ErrorState/ErrorState";
import { LoadingState } from "@/components/common/LoadingState/LoadingState";
import { Pagination } from "@/components/common/DataTable/Pagination";
import { Plus } from "lucide-react";
import { ClientsFilter } from "../components/ClientsFilter";
import { ClientsTable } from "../components/ClientsTable";
import { ClientDetailsModal } from "../components/ClientDetailsModal";
import { ClientModal } from "../components/ClientModal";
import { useClientsPage } from "../hooks/useClientsPage";
import { getApiErrorMessage } from "@/lib/http/get-api-error-message";

export const ClientsPage = () => {
  const page = useClientsPage();
  const { clientsQuery } = page;

  if (clientsQuery.isLoading)
    return <LoadingState message="Cargando clientes..." />;
  if (clientsQuery.isError)
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

  const clients = clientsQuery.data!;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gestiona los clientes registrados en el taller."
        action={
          <Button onClick={page.handleCreate}>
            <Plus /> Nuevo cliente
          </Button>
        }
      />
      <ClientsFilter
        search={page.search}
        onSearchChange={page.handleSearchChange}
      />
      {clients.data.length === 0 ? (
        <EmptyState
          title={
            page.search
              ? "No se encontraron clientes"
              : "No hay clientes registrados"
          }
          action={
            !page.search && (
              <Button onClick={page.handleCreate}>
                <Plus /> Registrar cliente
              </Button>
            )
          }
        />
      ) : (
        <>
          <ClientsTable
            clientes={clients.data}
            onView={page.handleView}
            onEdit={page.handleEdit}
            onDelete={page.handleDeleteRequest}
          />
          <Pagination
            page={clients.meta.page}
            totalPages={clients.meta.totalPages}
            onPageChange={page.handlePageChange}
          />
        </>
      )}

      <ClientModal
        open={page.modalOpen}
        onOpenChange={page.closeForm}
        client={page.selectedClient ? page.detailQuery.data : undefined}
        isLoadingClient={Boolean(
          page.selectedClient && page.detailQuery.isLoading,
        )}
        onSubmit={page.handleSubmit}
        isSubmitting={page.isSaving}
      />
      <ClientDetailsModal
        open={page.detailsOpen}
        onOpenChange={page.closeDetails}
        client={page.detailQuery.data}
        isLoading={page.detailQuery.isLoading}
        onEdit={page.editFromDetails}
      />
      <ConfirmDialog
        open={page.deleteOpen}
        onOpenChange={page.setDeleteOpen}
        title="¿Eliminar cliente?"
        description={
          page.clientToDelete
            ? `Se desactivará a ${page.clientToDelete.name}.`
            : undefined
        }
        confirmText="Eliminar"
        onConfirm={page.handleDelete}
        loading={page.isDeleting}
      />
    </div>
  );
};
