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
  const { list, dialogs, clientsQuery } = page;

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
          <Button onClick={dialogs.openCreate}>
            <Plus /> Nuevo cliente
          </Button>
        }
      />
      <ClientsFilter search={list.search} onSearchChange={list.setSearch} />
      {clients.data.length === 0 ? (
        <EmptyState
          title={
            list.search
              ? "No se encontraron clientes"
              : "No hay clientes registrados"
          }
          action={
            !list.search && (
              <Button onClick={dialogs.openCreate}>
                <Plus /> Registrar producto
              </Button>
            )
          }
        />
      ) : (
        <>
          <ClientsTable
            clientes={clients.data}
            onView={dialogs.openView}
            onEdit={dialogs.openEdit}
            onDelete={dialogs.openDelete}
          />
          <Pagination
            page={clients.meta.page}
            totalPages={clients.meta.totalPages}
            onPageChange={list.setPage}
          />
        </>
      )}

      <ClientModal
        open={dialogs.isFormOpen}
        client={
          dialogs.dialog.type === "edit" ? page.detailQuery.data : undefined
        }
        isLoadingClient={Boolean(dialogs.item && page.detailQuery.isLoading)}
        onSubmit={page.handleSubmit}
        isSubmitting={page.isSaving}
        onClose={dialogs.close}
      />
      <ClientDetailsModal
        open={dialogs.isViewOpen}
        client={page.detailQuery.data}
        isLoading={page.detailQuery.isLoading}
        onEdit={() => {
          dialogs.close();
        }}
        onClose={dialogs.close}
      />
      <ConfirmDialog
        open={dialogs.isDeleteOpen}
        title="¿Eliminar cliente?"
        description={
          dialogs.item ? `Se desactivará a ${dialogs.item.name}.` : undefined
        }
        confirmText="Eliminar"
        onConfirm={page.handleDelete}
        loading={page.isDeleting}
        onClose={dialogs.close}
      />
    </div>
  );
};
