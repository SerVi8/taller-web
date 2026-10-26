import type { FC } from "react";
import { format } from "date-fns";
import { Eye, Wrench } from "lucide-react";
import { DataTable } from "@/components/common/DataTable/DataTable";
import type { DataTableColumn } from "@/components/common/DataTable/types";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import type { WorkOrder } from "../model/order.types";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrdersTableProps {
  orders: WorkOrder[];
  onViewReport: (order: WorkOrder) => void;
  onOpenWorkspace: (order: WorkOrder) => void;
}

export const OrdersTable: FC<OrdersTableProps> = ({
  orders,
  onViewReport,
  onOpenWorkspace,
}) => {
  const columns: DataTableColumn<WorkOrder>[] = [
    {
      key: "code",
      header: "Código",
      render: (order) => (
        <button
          type="button"
          onClick={() => onOpenWorkspace(order)}
          className="font-mono font-semibold text-primary hover:underline"
        >
          {order.code}
        </button>
      ),
    },
    {
      key: "vehicle",
      header: "Vehículo",
      render: (order) => (
        <div className="flex flex-col">
          <span className="font-medium">{order.vehicle?.plate ?? "—"}</span>
          <span className="text-xs text-muted-foreground">
            {[order.vehicle?.model, order.vehicle?.year, order.vehicle?.color]
              .filter(Boolean)
              .join(" · ") || "Sin modelo"}
          </span>
        </div>
      ),
    },
    {
      key: "client",
      header: "Cliente",
      render: (order) => (
        <div className="flex flex-col">
          <span>{order.client?.name ?? "—"}</span>
          <span className="text-xs text-muted-foreground">
            {order.client?.phone ?? ""}
          </span>
        </div>
      ),
    },
    {
      key: "complaint",
      header: "Motivo / Falla",
      render: (order) => (
        <span className="line-clamp-1 max-w-xs text-sm" title={order.complaint}>
          {order.complaint}
        </span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (order) => <OrderStatusBadge status={order.status} />,
    },
    {
      key: "openedAt",
      header: "Fecha",
      render: (order) => format(new Date(order.openedAt), "dd/MM/yyyy"),
    },
    {
      key: "total",
      header: "Total",
      render: (order) => (
        <span className="font-medium">{formatMoney(order.total)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24 text-right",
      render: (order) => {
        const isClosed =
          order.status === "completed" || order.status === "cancelled";
        return (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              title="Ver informe detallado"
              onClick={() => onViewReport(order)}
            >
              <Eye className="size-4" />
            </Button>
            <Button
              size="icon"
              variant={isClosed ? "outline" : "secondary"}
              title={
                isClosed ? "Abrir vista completa" : "Gestionar orden de trabajo"
              }
              onClick={() => onOpenWorkspace(order)}
            >
              <Wrench className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      getRowKey={(order) => order.id}
    />
  );
};
