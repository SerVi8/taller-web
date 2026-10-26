import { LoadingState } from "@/components/common/LoadingState/LoadingState";
import { useProductPage } from "../hooks/useProductPage";
import { ErrorState } from "@/components/common/ErrorState/ErrorState";
import { getApiErrorMessage } from "@/lib/http/get-api-error-message";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { PackagePlus, Plus } from "lucide-react";
import { ProductsTable } from "../components/ProductsTable";
import { Pagination } from "@/components/common/DataTable/Pagination";
import { EmptyState } from "@/components/common/EmptyState/EmptyState";
import { ProductModal } from "../components/ProductModal";
import { ProductFilter } from "../components/ProductFilters";
import { ConfirmDialog } from "@/components/common/ConfirmDialog/ConfirmDialog";
import { StockEntryModal } from "../components/StockEntryModal";

export const ProductPage = () => {
  const page = useProductPage();
  const { list, dialogsProducts, productsQuery, dialogsStockMovent } = page;

  if (productsQuery.isLoading)
    return <LoadingState message="Cargando productos..." />;

  if (productsQuery.isError)
    return (
      <ErrorState
        title="No se pudo cargar los productos"
        message={getApiErrorMessage(
          productsQuery.error,
          "Ocurrió un error al cargar los productos.",
        )}
        onRetry={() => productsQuery.refetch()}
      />
    );

  const products = productsQuery.data!;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Productos"
        description="Gestiona los productos del taller."
        action={
          <div className="space-x-2">
            <Button onClick={dialogsProducts.openCreate}>
              <Plus /> Nuevo Producto
            </Button>
            <Button onClick={dialogsStockMovent.openCreate} variant="secondary">
              <PackagePlus /> Registrar entrada
            </Button>
          </div>
        }
      />

      <ProductFilter list={list} />

      {products.data.length === 0 ? (
        <EmptyState
          title={
            list.search
              ? "No se encontraron clientes"
              : "No hay clientes registrados"
          }
          action={
            !list.search && (
              <Button onClick={dialogsProducts.openCreate}>
                <Plus /> Registrar producto
              </Button>
            )
          }
        />
      ) : (
        <>
          <ProductsTable
            products={products.data}
            onView={dialogsProducts.openView}
            onEdit={dialogsProducts.openEdit}
            onDelete={dialogsProducts.openDelete}
          />
          <Pagination
            page={products.meta.page}
            totalPages={products.meta.totalPages}
            onPageChange={list.setPage}
          />
        </>
      )}
      <ProductModal
        open={dialogsProducts.isFormOpen}
        product={
          dialogsProducts.dialog.type === "edit"
            ? page.detailQuery.data
            : undefined
        }
        isLoadingClient={Boolean(
          dialogsProducts.item && page.detailQuery.isLoading,
        )}
        onSubmit={page.handleSubmit}
        isSubmitting={page.isSaving}
        onClose={dialogsProducts.close}
      />

      <StockEntryModal
        open={dialogsStockMovent.isFormOpen}
        onClose={dialogsStockMovent.close}
        onSubmit={page.handleSubmitEntry}
        isSubmitting={page.isSavingEntry}
      />
      <ConfirmDialog
        open={dialogsProducts.isDeleteOpen}
        title="¿Eliminar producto?"
        description={
          dialogsProducts.item
            ? `Se desactivará ${dialogsProducts.item.name} - ${dialogsProducts.item.sku}.`
            : undefined
        }
        confirmText="Eliminar"
        onConfirm={page.handleDelete}
        loading={page.isDeleting}
        onClose={dialogsProducts.close}
      />
    </div>
  );
};
