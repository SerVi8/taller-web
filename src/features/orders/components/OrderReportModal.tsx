import type { FC } from "react";
import { format } from "date-fns";
import { CheckCircle2, Clock, Printer, Wrench } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/utils";
import type { WorkOrder } from "../model/order.types";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderReportContentProps {
  order: WorkOrder;
}

export const OrderReportContent: FC<OrderReportContentProps> = ({ order }) => {
  const services = order.services ?? [];
  const items = order.items ?? [];

  const servicesSubtotal = services.reduce(
    (sum, s) => sum + Number(s.price ?? 0),
    0,
  );
  const itemsSubtotal = items.reduce(
    (sum, i) => sum + Number(i.quantity ?? 0) * Number(i.unitPrice ?? 0),
    0,
  );
  const subtotal = servicesSubtotal + itemsSubtotal;
  const discount = Number(order.discount ?? 0);

  return (
    <div className="space-y-6 text-sm">
      {/* Encabezado del informe */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border bg-muted/30 p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-lg font-bold tracking-tight">
              {order.code}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-muted-foreground">
            Ingreso: {format(new Date(order.openedAt), "dd/MM/yyyy HH:mm")}
            {order.completedAt &&
              ` · Cierre: ${format(new Date(order.completedAt), "dd/MM/yyyy HH:mm")}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total de la Orden</p>
          <p className="text-xl font-bold text-primary">
            {formatMoney(order.total)}
          </p>
        </div>
      </div>

      {/* Cliente y Vehículo */}
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-lg border p-3.5 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Datos del Cliente
          </h4>
          <dl className="space-y-1">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Nombre:</dt>
              <dd className="font-medium text-right">
                {order.client?.name ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Teléfono:</dt>
              <dd>{order.client?.phone ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Correo:</dt>
              <dd>{order.client?.email || "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border p-3.5 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Datos del Vehículo
          </h4>
          <dl className="space-y-1">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Placa:</dt>
              <dd className="font-mono font-semibold">
                {order.vehicle?.plate ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Vehículo:</dt>
              <dd className="text-right">
                {[
                  order.vehicle?.model,
                  order.vehicle?.year,
                  order.vehicle?.color,
                ]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Kilometraje:</dt>
              <dd>
                {order.mileageIn.toLocaleString("es-BO")} km
                {order.mileageOut !== null &&
                  ` → ${order.mileageOut.toLocaleString("es-BO")} km`}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Informe Técnico: Motivo, Diagnóstico, Observaciones y Recomendaciones */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-3.5 space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Motivo de Ingreso / Falla Reportada
          </h4>
          <p className="whitespace-pre-wrap text-foreground">
            {order.complaint || "—"}
          </p>
        </div>

        <div className="rounded-lg border p-3.5 space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Diagnóstico Técnico
          </h4>
          <p className="whitespace-pre-wrap text-foreground">
            {order.diagnosis || "Sin diagnóstico registrado."}
          </p>
        </div>

        <div className="rounded-lg border p-3.5 space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Observaciones
          </h4>
          <p className="whitespace-pre-wrap text-foreground">
            {order.observations || "Sin observaciones."}
          </p>
        </div>

        <div className="rounded-lg border p-3.5 space-y-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recomendaciones al Cliente
          </h4>
          <p className="whitespace-pre-wrap text-foreground">
            {order.recommendations || "Sin recomendaciones."}
          </p>
        </div>
      </div>

      {/* Servicios / Mano de Obra */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Servicios y Mano de Obra ({services.length})
        </h4>
        {services.length === 0 ? (
          <p className="rounded-lg border p-3 text-center text-muted-foreground">
            No se registraron servicios en esta orden.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Servicio / Descripción</th>
                  <th className="px-3 py-2 w-28">Estado</th>
                  <th className="px-3 py-2 text-right w-32">Precio</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {services.map((srv) => (
                  <tr key={srv.id}>
                    <td className="px-3 py-2">
                      {srv.title && (
                        <div className="font-medium">{srv.title}</div>
                      )}
                      <div className="text-muted-foreground">
                        {srv.description}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {srv.complete ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="size-3.5" /> Realizado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                          <Clock className="size-3.5" /> Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      {formatMoney(srv.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Repuestos / Productos utilizados */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Repuestos e Insumos ({items.length})
        </h4>
        {items.length === 0 ? (
          <p className="rounded-lg border p-3 text-center text-muted-foreground">
            No se utilizaron productos de inventario en esta orden.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2 text-right w-24">Cant.</th>
                  <th className="px-3 py-2 text-right w-32">P. Unit.</th>
                  <th className="px-3 py-2 text-right w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => {
                  const lineTotal =
                    Number(item.quantity ?? 0) * Number(item.unitPrice ?? 0);
                  return (
                    <tr key={item.id}>
                      <td className="px-3 py-2">
                        <div className="font-medium">
                          {item.product?.name ?? `Producto #${item.productId}`}
                        </div>
                        {item.product?.sku && (
                          <div className="text-xs text-muted-foreground">
                            SKU: {item.product.sku}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {Number(item.quantity)} {item.product?.unit ?? ""}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {formatMoney(item.unitPrice)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        {formatMoney(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Separator />

      {/* Resumen Financiero */}
      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-1.5 rounded-lg border bg-muted/20 p-3.5">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal servicios:</span>
            <span>{formatMoney(servicesSubtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal repuestos:</span>
            <span>{formatMoney(itemsSubtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal:</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-rose-500">
              <span>Descuento:</span>
              <span>- {formatMoney(discount)}</span>
            </div>
          )}
          <Separator className="my-1" />
          <div className="flex justify-between text-base font-bold">
            <span>Total a pagar:</span>
            <span>{formatMoney(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface OrderReportModalProps {
  open: boolean;
  order?: WorkOrder;
  isLoading?: boolean;
  onClose: () => void;
  onOpenWorkspace?: (order: WorkOrder) => void;
}

export const OrderReportModal: FC<OrderReportModalProps> = ({
  open,
  order,
  isLoading = false,
  onClose,
  onOpenWorkspace,
}) => {
  const isEditable =
    order &&
    order.status !== "completed" &&
    order.status !== "cancelled";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {order
              ? `Informe de Orden ${order.code}`
              : "Informe de Orden de Trabajo"}
          </DialogTitle>
          <DialogDescription>
            Resumen técnico de recepción, diagnóstico, servicios y repuestos.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <p className="py-10 text-center text-muted-foreground">
            Cargando detalles de la orden...
          </p>
        )}

        {order && (
          <div className="max-h-[75vh] space-y-5 overflow-y-auto pr-1">
            <OrderReportContent order={order} />

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.print()}
              >
                <Printer className="size-4" /> Imprimir
              </Button>
              {isEditable && onOpenWorkspace && (
                <Button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWorkspace(order);
                  }}
                >
                  <Wrench className="size-4" /> Trabajar en esta orden
                </Button>
              )}
              <Button type="button" variant="secondary" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
