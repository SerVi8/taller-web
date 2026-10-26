import { LoadingState } from "@/components/common/LoadingState/LoadingState";
import { ErrorState } from "@/components/common/ErrorState/ErrorState";
import { getApiErrorMessage } from "@/lib/http/get-api-error-message";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { PackagePlus, Plus } from "lucide-react";
import { Pagination } from "@/components/common/DataTable/Pagination";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import { ProductFilter } from "../components/ProductFilters";
import { StockEntryModal } from "../components/StockEntryModal";
import { useStockMovementPage } from "../hooks/useStockMovementsPage";
import { StockMovementsTable } from "../components/StockMoventsTable";

export const StockMovementsPage = () => {
  const page = useStockMovementPage();
  const { list, dialog, movementsQuery } = page;

  if (movementsQuery.isLoading)
    return <LoadingState message="Cargando movimientos..." />;

  if (movementsQuery.isError)
    return (
      <ErrorState
        title="No se pudo cargar los movimientos"
        message={getApiErrorMessage(
          movementsQuery.error,
          "Ocurrió un error al cargar los movimientos.",
        )}
        onRetry={() => movementsQuery.refetch()}
      />
    );

  const movements = movementsQuery.data!;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Moviminetos de Stock"
        description="Visualiza todos los movimientos de productos del taller."
        action={
          <div className="space-x-2">
            <Button onClick={dialog.openCreate} variant="secondary">
              <PackagePlus /> Registrar entrada
            </Button>
          </div>
        }
      />

      <ProductFilter list={list} />

      {movements.data.length === 0 ? (
        <EmptyState
          title={
            list.search
              ? "No se encontraron movientos relacionados"
              : "No hay movimientos de Stock"
          }
          action={
            !list.search && (
              <Button onClick={dialog.openCreate}>
                <Plus /> Registrar entrada de Stock
              </Button>
            )
          }
        />
      ) : (
        <>
          <StockMovementsTable
            movements={movements.data}
            onView={dialog.openView}
          />
          <Pagination
            page={movements.meta.page}
            totalPages={movements.meta.totalPages}
            onPageChange={list.setPage}
          />
        </>
      )}

      <StockEntryModal
        open={dialog.isFormOpen}
        onClose={dialog.close}
        onSubmit={page.handleSubmit}
        isSubmitting={page.isSaving}
      />
    </div>
  );
};
