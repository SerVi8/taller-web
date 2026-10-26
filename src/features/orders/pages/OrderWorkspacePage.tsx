import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
   Ban,
  CheckCircle2,
  FileText,
  Pencil,
  Play,
  Plus,
  Printer,
  Save,
  Trash2,
  X,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import { LoadingState } from "@/components/common/LoadingState/LoadingState";
import { ErrorState } from "@/components/common/ErrorState/ErrorState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ProductPicker } from "@/features/inventory/components/ProductPicker";
import { formatMoney } from "@/lib/utils";
import { getApiErrorMessage } from "@/lib/http/get-api-error-message";
import { useOrder } from "../hooks/use-order-queries";
import { useOrderCommands } from "../hooks/use-order-commands";
import type {
  WorkOrderProductItem,
  WorkOrderServiceItem,
} from "../model/order.types";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import {
  OrderReportContent,
  OrderReportModal,
} from "../components/OrderReportModal";
import {
  CancelOrderModal,
  CompleteOrderModal,
} from "../components/OrderStatusModals";

export const OrderWorkspacePage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const orderQuery = useOrder(code);
  const commands = useOrderCommands();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Estado para formulario de notas / descuento de la orden
  const [complaint, setComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [observations, setObservations] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [discount, setDiscount] = useState("0");

  // Estado para agregar nuevo servicio
  const [srvTitle, setSrvTitle] = useState("");
  const [srvDesc, setSrvDesc] = useState("");
  const [srvPrice, setSrvPrice] = useState("");

  // Estado para editar servicio existente
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editSrvTitle, setEditSrvTitle] = useState("");
  const [editSrvDesc, setEditSrvDesc] = useState("");
  const [editSrvPrice, setEditSrvPrice] = useState("");

  // Estado para agregar nuevo ítem/repuesto
  const [newItemProductId, setNewItemProductId] = useState<number | undefined>();
  const [newItemQty, setNewItemQty] = useState("1");
  const [newItemPrice, setNewItemPrice] = useState("");

  // Estado para editar ítem existente
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editItemQty, setEditItemQty] = useState("");
  const [editItemPrice, setEditItemPrice] = useState("");

  const order = orderQuery.data;

  useEffect(() => {
    if (order) {
      setComplaint(order.complaint ?? "");
      setDiagnosis(order.diagnosis ?? "");
      setObservations(order.observations ?? "");
      setRecommendations(order.recommendations ?? "");
      setDiscount(String(Number(order.discount ?? 0)));
    }
  }, [order]);

  if (orderQuery.isLoading) {
    return <LoadingState message="Cargando orden de trabajo..." />;
  }

  if (orderQuery.isError || !order) {
    return (
      <ErrorState
        title="No se pudo cargar la orden de trabajo"
        message={getApiErrorMessage(
          orderQuery.error,
          "La orden solicitada no existe o no se pudo cargar.",
        )}
        onRetry={() => orderQuery.refetch()}
      />
    );
  }

  const isClosed =
    order.status === "completed" || order.status === "cancelled";

  const services = order.services ?? [];
  const items = order.items ?? [];

  const handleSaveOrderDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    await commands.updateOrder(order.id, {
      complaint: complaint.trim(),
      diagnosis: diagnosis.trim() || null,
      observations: observations.trim() || null,
      recommendations: recommendations.trim() || null,
      discount: Number(discount) || 0,
    });
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvDesc.trim()) return;
    const ok = await commands.addService(order.id, {
      title: srvTitle.trim() || null,
      description: srvDesc.trim(),
      price: Number(srvPrice) || 0,
      complete: false,
    });
    if (ok) {
      setSrvTitle("");
      setSrvDesc("");
      setSrvPrice("");
    }
  };

  const startEditService = (srv: WorkOrderServiceItem) => {
    setEditingServiceId(srv.id);
    setEditSrvTitle(srv.title ?? "");
    setEditSrvDesc(srv.description);
    setEditSrvPrice(String(Number(srv.price)));
  };

  const handleSaveEditService = async (serviceId: number) => {
    if (!editSrvDesc.trim()) return;
    const ok = await commands.updateService(order.id, serviceId, {
      title: editSrvTitle.trim() || null,
      description: editSrvDesc.trim(),
      price: Number(editSrvPrice) || 0,
    });
    if (ok) setEditingServiceId(null);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemProductId) return;
    const qty = Number(newItemQty);
    if (!qty || qty <= 0) return;

    const ok = await commands.addItem(order.id, {
      productId: newItemProductId,
      quantity: qty,
      ...(newItemPrice !== "" && { unitPrice: Number(newItemPrice) }),
    });
    if (ok) {
      setNewItemProductId(undefined);
      setNewItemQty("1");
      setNewItemPrice("");
    }
  };

  const startEditItem = (item: WorkOrderProductItem) => {
    setEditingItemId(item.id);
    setEditItemQty(String(Number(item.quantity)));
    setEditItemPrice(String(Number(item.unitPrice)));
  };

  const handleSaveEditItem = async (itemId: number) => {
    const qty = Number(editItemQty);
    if (!qty || qty <= 0) return;
    const ok = await commands.updateItem(order.id, itemId, {
      quantity: qty,
      unitPrice: Number(editItemPrice) || 0,
    });
    if (ok) setEditingItemId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Orden ${order.code}`}
        description={`${order.vehicle?.plate ?? ""} · ${order.client?.name ?? ""}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/orders")}
            >
              <ArrowLeft className="size-4" /> Volver
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsReportModalOpen(true)}
            >
              <FileText className="size-4" /> Vista informe
            </Button>

            {(order.status === "open" || order.status === "price") && (
              <Button
                variant="secondary"
                disabled={commands.isStarting}
                onClick={() => commands.startOrder(order.id)}
              >
                <Play className="size-4" /> Iniciar trabajo
              </Button>
            )}

            {(order.status === "open" || order.status === "in_progress") && (
              <Button onClick={() => setIsCompleteModalOpen(true)}>
                <CheckCircle2 className="size-4" /> Completar orden
              </Button>
            )}

            {!isClosed && (
              <Button
                variant="destructive"
                onClick={() => setIsCancelModalOpen(true)}
              >
                <Ban className="size-4" /> Cancelar
              </Button>
            )}
          </div>
        }
      />

      {/* Si la orden ya está cerrada o cancelada, se muestra directamente en formato Informe */}
      {isClosed ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Informe de Orden Cerrada</CardTitle>
              <CardDescription>
                Esta orden ya fue {order.status === "completed" ? "completada" : "cancelada"} y no admite modificaciones.
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" /> Imprimir informe
            </Button>
          </CardHeader>
          <CardContent>
            <OrderReportContent order={order} />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Resumen superior del vehículo, cliente y estado */}
          <Card size="sm">
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Estado: </span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div>
                  <span className="text-muted-foreground">Cliente: </span>
                  <span className="font-medium">
                    {order.client?.name} ({order.client?.phone})
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Vehículo: </span>
                  <span className="font-mono font-semibold">
                    {order.vehicle?.plate}
                  </span>{" "}
                  <span>
                    {[order.vehicle?.model, order.vehicle?.year]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Km ingreso: </span>
                  <span className="font-medium">
                    {order.mileageIn.toLocaleString("es-BO")} km
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">
                  Total acumulado
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatMoney(order.total)}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Columna izquierda: Servicios e Ítems */}
            <div className="space-y-6 lg:col-span-7">
              {/* Tarjeta de Servicios */}
              <Card>
                <CardHeader>
                  <CardTitle>Servicios y Mano de Obra</CardTitle>
                  <CardDescription>
                    Agrega, marca como completados o edita los trabajos realizados.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form
                    onSubmit={handleAddService}
                    className="grid grid-cols-12 items-end gap-2 rounded-lg border bg-muted/20 p-3"
                  >
                    <div className="col-span-12 sm:col-span-3">
                      <Field>
                        <FieldLabel>Título</FieldLabel>
                        <Input
                          value={srvTitle}
                          onChange={(e) => setSrvTitle(e.target.value)}
                          placeholder="Opcional"
                        />
                      </Field>
                    </div>
                    <div className="col-span-12 sm:col-span-5">
                      <Field>
                        <FieldLabel>Descripción *</FieldLabel>
                        <Input
                          value={srvDesc}
                          onChange={(e) => setSrvDesc(e.target.value)}
                          placeholder="Descripción del servicio..."
                          required
                        />
                      </Field>
                    </div>
                    <div className="col-span-8 sm:col-span-3">
                      <Field>
                        <FieldLabel>Precio (Bs.)</FieldLabel>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={srvPrice}
                          onChange={(e) => setSrvPrice(e.target.value)}
                          placeholder="0.00"
                        />
                      </Field>
                    </div>
                    <div className="col-span-4 sm:col-span-1 flex justify-end">
                      <Button
                        type="submit"
                        size="icon"
                        disabled={commands.isAddingService}
                        title="Agregar servicio"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </form>

                  {services.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Sin servicios registrados en esta orden.
                    </p>
                  ) : (
                    <div className="divide-y rounded-lg border">
                      {services.map((srv) => {
                        const isEditing = editingServiceId === srv.id;
                        return (
                          <div
                            key={srv.id}
                            className="flex flex-wrap items-center justify-between gap-3 p-3"
                          >
                            {isEditing ? (
                              <div className="grid w-full grid-cols-12 items-center gap-2">
                                <div className="col-span-12 sm:col-span-3">
                                  <Input
                                    value={editSrvTitle}
                                    onChange={(e) =>
                                      setEditSrvTitle(e.target.value)
                                    }
                                    placeholder="Título"
                                  />
                                </div>
                                <div className="col-span-12 sm:col-span-5">
                                  <Input
                                    value={editSrvDesc}
                                    onChange={(e) =>
                                      setEditSrvDesc(e.target.value)
                                    }
                                    placeholder="Descripción"
                                  />
                                </div>
                                <div className="col-span-8 sm:col-span-2">
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={editSrvPrice}
                                    onChange={(e) =>
                                      setEditSrvPrice(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-span-4 sm:col-span-2 flex justify-end gap-1">
                                  <Button
                                    type="button"
                                    size="icon"
                                    onClick={() =>
                                      handleSaveEditService(srv.id)
                                    }
                                    disabled={commands.isUpdatingService}
                                  >
                                    <Save className="size-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setEditingServiceId(null)}
                                  >
                                    <X className="size-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    checked={srv.complete}
                                    onCheckedChange={(checked) =>
                                      commands.updateService(order.id, srv.id, {
                                        complete: Boolean(checked),
                                      })
                                    }
                                    className="mt-1"
                                  />
                                  <div>
                                    {srv.title && (
                                      <p className="font-medium leading-tight">
                                        {srv.title}
                                      </p>
                                    )}
                                    <p
                                      className={
                                        srv.complete
                                          ? "text-sm line-through text-muted-foreground"
                                          : "text-sm"
                                      }
                                    >
                                      {srv.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {formatMoney(srv.price)}
                                  </span>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => startEditService(srv)}
                                  >
                                    <Pencil className="size-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    disabled={commands.isRemovingService}
                                    onClick={() =>
                                      commands.removeService(order.id, srv.id)
                                    }
                                  >
                                    <Trash2 className="size-4 text-destructive" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tarjeta de Repuestos / Ítems */}
              <Card>
                <CardHeader>
                  <CardTitle>Repuestos e Insumos (Inventario)</CardTitle>
                  <CardDescription>
                    Al agregar, editar o eliminar productos se registra el movimiento de stock automáticamente.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form
                    onSubmit={handleAddItem}
                    className="grid grid-cols-12 items-end gap-2 rounded-lg border bg-muted/20 p-3"
                  >
                    <div className="col-span-12 sm:col-span-6">
                      <Field>
                        <FieldLabel>Producto *</FieldLabel>
                        <ProductPicker
                          value={newItemProductId}
                          onChange={(prod) => {
                            setNewItemProductId(prod.id);
                            setNewItemPrice(String(Number(prod.salePrice)));
                          }}
                        />
                      </Field>
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Field>
                        <FieldLabel>Cant.</FieldLabel>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          value={newItemQty}
                          onChange={(e) => setNewItemQty(e.target.value)}
                          required
                        />
                      </Field>
                    </div>
                    <div className="col-span-5 sm:col-span-3">
                      <Field>
                        <FieldLabel>P. Unit. (Bs.)</FieldLabel>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                          placeholder="0.00"
                        />
                      </Field>
                    </div>
                    <div className="col-span-3 sm:col-span-1 flex justify-end">
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!newItemProductId || commands.isAddingItem}
                        title="Agregar producto"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </form>

                  {items.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Sin repuestos asignados a esta orden.
                    </p>
                  ) : (
                    <div className="divide-y rounded-lg border">
                      {items.map((item) => {
                        const isEditing = editingItemId === item.id;
                        const lineSubtotal =
                          Number(item.quantity ?? 0) *
                          Number(item.unitPrice ?? 0);

                        return (
                          <div
                            key={item.id}
                            className="flex flex-wrap items-center justify-between gap-3 p-3"
                          >
                            <div className="min-w-44 flex-1">
                              <p className="font-medium">
                                {item.product?.name ??
                                  `Producto #${item.productId}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.product?.sku
                                  ? `SKU: ${item.product.sku} · `
                                  : ""}
                                {Number(item.quantity)}{" "}
                                {item.product?.unit ?? "unid."} ×{" "}
                                {formatMoney(item.unitPrice)}
                              </p>
                            </div>

                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  min="1"
                                  step="1"
                                  value={editItemQty}
                                  onChange={(e) =>
                                    setEditItemQty(e.target.value)
                                  }
                                  className="w-20"
                                  title="Cantidad"
                                />
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={editItemPrice}
                                  onChange={(e) =>
                                    setEditItemPrice(e.target.value)
                                  }
                                  className="w-28"
                                  title="Precio unitario"
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  disabled={commands.isUpdatingItem}
                                  onClick={() => handleSaveEditItem(item.id)}
                                >
                                  <Save className="size-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditingItemId(null)}
                                >
                                  <X className="size-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {formatMoney(lineSubtotal)}
                                </span>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => startEditItem(item)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  disabled={commands.isRemovingItem}
                                  onClick={() =>
                                    commands.removeItem(order.id, item.id)
                                  }
                                >
                                  <Trash2 className="size-4 text-destructive" />
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Columna derecha: Diagnóstico, Observaciones, Recomendaciones y Descuento */}
            <div className="space-y-6 lg:col-span-5">
              <Card>
                <CardHeader>
                  <CardTitle>Diagnóstico y Notas Técnicas</CardTitle>
                  <CardDescription>
                    Actualiza el diagnóstico, observaciones, recomendaciones y descuento de la orden.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleSaveOrderDetails}
                    className="space-y-4"
                  >
                    <Field>
                      <FieldLabel>Motivo de ingreso / Falla *</FieldLabel>
                      <Textarea
                        rows={2}
                        value={complaint}
                        onChange={(e) => setComplaint(e.target.value)}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Diagnóstico técnico</FieldLabel>
                      <Textarea
                        rows={3}
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="Describe el diagnóstico encontrado..."
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Observaciones</FieldLabel>
                      <Textarea
                        rows={3}
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        placeholder="Observaciones adicionales durante el trabajo..."
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Recomendaciones al cliente</FieldLabel>
                      <Textarea
                        rows={2}
                        value={recommendations}
                        onChange={(e) => setRecommendations(e.target.value)}
                        placeholder="Próximos mantenimientos o cuidados sugeridos..."
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Descuento (Bs.)</FieldLabel>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                      />
                    </Field>

                    <Separator />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={commands.isUpdating}>
                        <Save className="size-4" />{" "}
                        {commands.isUpdating
                          ? "Guardando..."
                          : "Guardar cambios"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Modal de Informe Técnico */}
      <OrderReportModal
        open={isReportModalOpen}
        order={order}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* Modal para Completar Orden */}
      <CompleteOrderModal
        open={isCompleteModalOpen}
        mileageIn={order.mileageIn}
        isSubmitting={commands.isCompleting}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={async (mileageOut) => {
          if (await commands.completeOrder(order.id, mileageOut)) {
            setIsCompleteModalOpen(false);
          }
        }}
      />

      {/* Modal para Cancelar Orden */}
      <CancelOrderModal
        open={isCancelModalOpen}
        isSubmitting={commands.isCancelling}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={async (reason) => {
          if (await commands.cancelOrder(order.id, reason)) {
            setIsCancelModalOpen(false);
          }
        }}
      />
    </div>
  );
};
