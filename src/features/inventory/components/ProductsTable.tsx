import type { FC } from "react";
import type { DataTableColumn } from "@/components/common/DataTable/types";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/common/DataTable/DataTable";
import type { Product } from "../model/product.types";
import { formatMoney } from "@/lib/utils";

type ProductTableProps = {
  products: Product[];
  onView: (cliente: Product) => void;
  onEdit: (cliente: Product) => void;
  onDelete: (cliente: Product) => void;
};
export const ProductsTable: FC<ProductTableProps> = ({
  products,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns: DataTableColumn<Product>[] = [
    {
      key: "sku",
      header: "CODIGO",
    },
    {
      key: "name",
      header: "Nombre",
    },
    {
      key: "unit",
      header: "Unidad",
    },
    {
      key: "costPrice",
      header: "Precio compra",
      render: (product) => formatMoney(product.costPrice),
    },
    {
      key: "salePrice",
      header: "Precio venta",
      render: (product) => formatMoney(product.salePrice),
    },
    {
      key: "stock",
      header: "Cantidad",
    },
    {
      key: "acciones",
      header: "",
      className: "w-12 text-right",
      render: (product) => (
        <div className="flex justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            aria-label="Ver detalles"
            className="hidden"
            onClick={() => onView(product)}
          >
            <Eye />
          </Button>
          <Button
            size={"icon"}
            variant={"secondary"}
            onClick={() => onEdit(product)}
          >
            <Pencil />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDelete(product)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <DataTable
      data={products}
      columns={columns}
      getRowKey={(product) => product.id}
    />
  );
};
