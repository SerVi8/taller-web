import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import { ErrorState } from "@/components/common/ErrorState/ErrorState";
import { LoadingState } from "@/components/common/LoadingState/LoadingState";
import { Pagination } from "@/components/common/DataTable/Pagination";
import { getApiErrorMessage } from "@/lib/http/get-api-error-message";
import { useOrdersPage } from "../hooks/useOrdersPage";
import { OrdersFilter } from "../components/OrdersFilter";
import { OrdersTable } from "../components/OrdersTable";
import { OrderReportModal } from "../components/OrderReportModal";

export const OrdersPage = () => {
  const navigate = useNavigate();
  const pageState = useOrdersPage();
  const { dialogs, ordersQuery, detailQuery } = pageState;

  if (ordersQuery.isLoading) {
    return <LoadingState message="Cargando órdenes de trabajo..." />;
  }

  if (ordersQuery.isError) {
    return (
      <ErrorState
        title="No se pudieron cargar las órdenes de trabajo"
        message={getApiErrorMessage(
          ordersQuery.error,
          "Ocurrió un error al cargar las órdenes.",
        )}
        onRetry={() => ordersQuery.refetch()}
      />
    );
  }

  const orders = ordersQuery.data!;
  const hasActiveFilters =
    Boolean(pageState.search) ||
    pageState.status !== "all" ||
    Boolean(pageState.clientId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Órdenes de trabajo"
        description="Gestiona las recepciones de vehículos, servicios, repuestos y estados."
        action={
          <Button onClick={() => navigate("/admin/orders/new")}>
            <Plus className="size-4" /> Nueva orden
          </Button>
        }
      />

      <OrdersFilter
        search={pageState.search}
        onSearchChange={pageState.setSearch}
        status={pageState.status}
        onStatusChange={pageState.setStatus}
        clientId={pageState.clientId}
        onClientChange={pageState.setClientId}
      />

      {orders.data.length === 0 ? (
        <EmptyState
          title={
            hasActiveFilters
              ? "No se encontraron órdenes con esos filtros"
              : "Aún no hay órdenes de trabajo registradas"
          }
          action={
            !hasActiveFilters && (
              <Button onClick={() => navigate("/admin/orders/new")}>
                <Plus className="size-4" /> Crear primera orden
              </Button>
            )
          }
        />
      ) : (
        <>
          <OrdersTable
            orders={orders.data}
            onViewReport={(order) => dialogs.openView(order)}
            onOpenWorkspace={(order) => navigate(`/admin/orders/${order.code}`)}
          />
          <Pagination
            page={orders.meta.page}
            totalPages={orders.meta.totalPages}
            onPageChange={pageState.setPage}
          />
        </>
      )}

      <OrderReportModal
        open={dialogs.isViewOpen}
        order={detailQuery.data}
        isLoading={detailQuery.isLoading}
        onClose={dialogs.close}
        onOpenWorkspace={(order) => navigate(`/admin/orders/${order.code}`)}
      />
    </div>
  );
};
