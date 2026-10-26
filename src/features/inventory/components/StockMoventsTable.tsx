import type { FC } from "react";
import type { DataTableColumn } from "@/components/common/DataTable/types";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { DataTable } from "@/components/common/DataTable/DataTable";
import { MOVEMENT_REASON_LABELS, type StockMovent } from "../model/stock.types";
import { useNavigate } from "react-router-dom";

type StockMovementsTableProps = {
  movements: StockMovent[];
  onView: (cliente: StockMovent) => void;
};
export const StockMovementsTable: FC<StockMovementsTableProps> = ({
  movements,
  onView,
}) => {
  const navigate = useNavigate();
  const columns: DataTableColumn<StockMovent>[] = [
    {
      key: "product",
      header: "Producto",
      render: (movement) => (
        <div className="flex flex-col">
          <span>{movement.product.name}</span>
          <span className="text-xs text-muted-foreground">
            {movement.product.sku}
          </span>
        </div>
      ),
    },
    {
      key: "reason",
      header: "Razón",
      render: (movement) => MOVEMENT_REASON_LABELS[movement.reason],
    },
    {
      key: "workOreder",
      header: "Orden de trabajo",
      render: (movements) =>
        movements.workOrder ? (
          <Button
            type="button"
            onClick={() =>
              navigate(`/admin/orders/${movements.workOrder?.code}`)
            }
            variant={"link"}
            className="font-mono font-semibold text-primary"
          >
            {movements.workOrder.code}
          </Button>
        ) : (
          "-"
        ),
    },
    {
      key: "createdAt",
      header: "Fecha",
      render: (movements) =>
        format(new Date(movements.createdAt), "dd/MM/yyyy"),
    },
    {
      key: "quantity",
      header: "Cantidad",
      render: (movements) => {
        const positive = Number(movements.quantity) > 0;
        return (
          <span className={positive ? "text-green-400" : "text-destructive"}>
            {movements.quantity}
          </span>
        );
      },
    },
    {
      key: "acciones",
      header: "",
      className: "w-12 text-right",
      render: (movement) => (
        <div className="flex justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            aria-label="Ver detalles"
            onClick={() => onView(movement)}
          >
            <Eye />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <DataTable
      data={movements}
      columns={columns}
      getRowKey={(movement) => movement.id}
    />
  );
};
