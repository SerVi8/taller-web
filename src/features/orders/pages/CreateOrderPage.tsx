import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Car, Plus, Trash2, UserPlus } from "lucide-react";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { ClientModal } from "@/features/clients/components/ClientModal";
import { useClient } from "@/features/clients/hooks/use-client-queries";
import { useCreateClient } from "@/features/clients/hooks/use-client-mutations";
import type { ClientFormValues } from "@/features/clients/model/client.schema";
import { ProductPicker } from "@/features/inventory/components/ProductPicker";
import { formatMoney } from "@/lib/utils";
import { toastError, toastSuccess } from "@/lib/feedback/toast";
import { getApiErrorMessage } from "@/lib/http/get-api-error-message";
import {
  createOrderFormSchema,
  getCreateOrderDefaults,
  type CreateOrderFormValues,
} from "../model/order.schema";
import { useOrderCommands } from "../hooks/use-order-commands";
import { ClientPicker } from "../components/ClientPicker";
import { QuickAddVehicleModal } from "../components/QuickAddVehicleModal";

export const CreateOrderPage = () => {
  const navigate = useNavigate();
  const { createOrder, isCreating } = useOrderCommands();
  const createClientMutation = useCreateClient();

  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [selectedClientLabel, setSelectedClientLabel] = useState<
    string | undefined
  >();

  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderFormSchema),
    defaultValues: getCreateOrderDefaults(),
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const clientId = useWatch({ control, name: "clientId" });
  const vehicleId = useWatch({ control, name: "vehicleId" });
  const services = useWatch({ control, name: "services" }) ?? [];
  const items = useWatch({ control, name: "items" }) ?? [];
  const discount = Number(useWatch({ control, name: "discount" }) || 0);

  const clientDetailQuery = useClient(clientId > 0 ? clientId : undefined);
  const vehicles = clientDetailQuery.data?.vehicles ?? [];
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId);

  const servicesArray = useFieldArray({ control, name: "services" });
  const itemsArray = useFieldArray({ control, name: "items" });

  const servicesSubtotal = services.reduce(
    (sum, s) => sum + (Number(s?.price) || 0),
    0,
  );
  const itemsSubtotal = items.reduce(
    (sum, i) => sum + (Number(i?.quantity) || 0) * (Number(i?.unitPrice) || 0),
    0,
  );
  const subtotal = servicesSubtotal + itemsSubtotal;
  const total = Math.max(0, subtotal - discount);

  const handleCreateNewClient = async (data: ClientFormValues) => {
    try {
      const createdClient = await createClientMutation.mutateAsync(data);
      toastSuccess("Cliente registrado correctamente.");
      setIsNewClientModalOpen(false);
      setSelectedClientLabel(`${createdClient.name} · ${createdClient.phone}`);
      setValue("clientId", createdClient.id, { shouldValidate: true });

      const firstVehicle = createdClient.vehicles?.[0];
      setValue("vehicleId", firstVehicle ? firstVehicle.id : 0, {
        shouldValidate: Boolean(firstVehicle),
      });
    } catch (error) {
      toastError(
        getApiErrorMessage(error, "No se pudo registrar el cliente."),
      );
    }
  };

  const onSubmit = async (values: CreateOrderFormValues) => {
    const parsed = createOrderFormSchema.parse(values);
    const created = await createOrder({
      vehicleId: parsed.vehicleId,
      status: parsed.status,
      mileageIn: parsed.mileageIn,
      complaint: parsed.complaint,
      diagnosis: parsed.diagnosis,
      observations: parsed.observations,
      recommendations: parsed.recommendations,
      discount: parsed.discount,
      services: parsed.services,
      items: parsed.items,
    });

    if (created) {
      navigate(`/admin/orders/${created.code}`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nueva orden de trabajo"
        description="Selecciona el cliente y su vehículo, registra los datos de ingreso y opcionalmente los servicios o repuestos iniciales."
        action={
          <Button variant="outline" onClick={() => navigate("/admin/orders")}>
            <ArrowLeft className="size-4" /> Volver al listado
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 1. Selección de Cliente y Vehículo */}
        <Card>
          <CardHeader>
            <CardTitle>1. Cliente y Vehículo</CardTitle>
            <CardDescription>
              Busca un cliente existente o registra uno nuevo con su vehículo sin salir de esta pantalla.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field data-invalid={Boolean(errors.clientId)}>
              <div className="flex items-center justify-between">
                <FieldLabel>Cliente *</FieldLabel>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => setIsNewClientModalOpen(true)}
                >
                  <UserPlus className="size-3.5" /> Nuevo cliente
                </Button>
              </div>
              <ClientPicker
                value={clientId > 0 ? clientId : undefined}
                selectedLabel={selectedClientLabel}
                onChange={(client) => {
                  if (client) {
                    setSelectedClientLabel(`${client.name} · ${client.phone}`);
                    setValue("clientId", client.id, { shouldValidate: true });
                    setValue("vehicleId", 0);
                  } else {
                    setSelectedClientLabel(undefined);
                    setValue("clientId", 0);
                    setValue("vehicleId", 0);
                  }
                }}
              />
              {errors.clientId && <FieldError errors={[errors.clientId]} />}
            </Field>

            <Field data-invalid={Boolean(errors.vehicleId)}>
              <div className="flex items-center justify-between">
                <FieldLabel>Vehículo *</FieldLabel>
                {clientId > 0 && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => setIsAddVehicleModalOpen(true)}
                  >
                    <Car className="size-3.5" /> Agregar vehículo al cliente
                  </Button>
                )}
              </div>

              <Select
                disabled={clientId <= 0 || clientDetailQuery.isLoading}
                value={vehicleId > 0 ? String(vehicleId) : ""}
                onValueChange={(val) =>
                  setValue("vehicleId", Number(val), { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      clientId <= 0
                        ? "Primero selecciona un cliente"
                        : clientDetailQuery.isLoading
                          ? "Cargando vehículos..."
                          : vehicles.length === 0
                            ? "Sin vehículos — haz clic en 'Agregar vehículo'"
                            : "Selecciona un vehículo"
                    }
                  >
                    {selectedVehicle
                      ? `${selectedVehicle.plate} · ${[selectedVehicle.model, selectedVehicle.year, selectedVehicle.color].filter(Boolean).join(" ") || "Sin modelo"}`
                      : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={String(v.id)}>
                      {v.plate} ·{" "}
                      {[v.model, v.year, v.color].filter(Boolean).join(" ") ||
                        "Sin detalles"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleId && <FieldError errors={[errors.vehicleId]} />}
            </Field>

            <Field data-invalid={Boolean(errors.mileageIn)}>
              <FieldLabel>Kilometraje de ingreso (km) *</FieldLabel>
              <Input
                type="number"
                min={0}
                placeholder="Ej. 85000"
                {...register("mileageIn", { valueAsNumber: true })}
              />
              {errors.mileageIn && <FieldError errors={[errors.mileageIn]} />}
            </Field>

            <Field data-invalid={Boolean(errors.status)}>
              <FieldLabel>Estado inicial</FieldLabel>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {field.value === "price"
                          ? "Cotización"
                          : field.value === "in_progress"
                            ? "En progreso"
                            : "Abierta"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Abierta (Recepción)</SelectItem>
                      <SelectItem value="in_progress">En progreso</SelectItem>
                      <SelectItem value="price">Cotización</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <FieldError errors={[errors.status]} />}
            </Field>
          </CardContent>
        </Card>

        {/* 2. Motivo, Diagnóstico, Observaciones y Recomendaciones */}
        <Card>
          <CardHeader>
            <CardTitle>2. Recepción e Informe Inicial</CardTitle>
            <CardDescription>
              Describe el problema reportado por el cliente y las notas iniciales de inspección.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field
              className="md:col-span-2"
              data-invalid={Boolean(errors.complaint)}
            >
              <FieldLabel>Motivo de ingreso / Falla reportada *</FieldLabel>
              <Textarea
                rows={2}
                placeholder="Describe el motivo por el que ingresa el vehículo..."
                {...register("complaint")}
              />
              {errors.complaint && <FieldError errors={[errors.complaint]} />}
            </Field>

            <Field data-invalid={Boolean(errors.diagnosis)}>
              <FieldLabel>Diagnóstico técnico (opcional)</FieldLabel>
              <Textarea
                rows={3}
                placeholder="Diagnóstico preliminar del mecánico..."
                {...register("diagnosis")}
              />
              {errors.diagnosis && <FieldError errors={[errors.diagnosis]} />}
            </Field>

            <Field data-invalid={Boolean(errors.observations)}>
              <FieldLabel>Observaciones de recepción (opcional)</FieldLabel>
              <Textarea
                rows={3}
                placeholder="Estado de carrocería, nivel de combustible, objetos de valor..."
                {...register("observations")}
              />
              {errors.observations && (
                <FieldError errors={[errors.observations]} />
              )}
            </Field>

            <Field
              className="md:col-span-2"
              data-invalid={Boolean(errors.recommendations)}
            >
              <FieldLabel>Recomendaciones (opcional)</FieldLabel>
              <Textarea
                rows={2}
                placeholder="Recomendaciones para próximos mantenimientos..."
                {...register("recommendations")}
              />
              {errors.recommendations && (
                <FieldError errors={[errors.recommendations]} />
              )}
            </Field>
          </CardContent>
        </Card>

        {/* 3. Servicios Iniciales (Opcional) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>3. Servicios / Mano de Obra (Opcional)</CardTitle>
              <CardDescription>
                Puedes agregarlos ahora o más adelante desde la vista de trabajo de la orden.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                servicesArray.append({
                  title: "",
                  description: "",
                  price: 0,
                  complete: false,
                })
              }
            >
              <Plus className="size-4" /> Agregar servicio
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {servicesArray.fields.length === 0 ? (
              <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                No se han añadido servicios iniciales.
              </p>
            ) : (
              servicesArray.fields.map((field, index) => {
                const lineError = errors.services?.[index];
                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="col-span-12 md:col-span-3">
                      <Field>
                        <FieldLabel>Título (opcional)</FieldLabel>
                        <Input
                          placeholder="Ej. Cambio de aceite"
                          {...register(`services.${index}.title`)}
                        />
                      </Field>
                    </div>
                    <div className="col-span-12 md:col-span-5">
                      <Field data-invalid={Boolean(lineError?.description)}>
                        <FieldLabel>Descripción *</FieldLabel>
                        <Input
                          placeholder="Detalle del trabajo a realizar"
                          {...register(`services.${index}.description`)}
                        />
                        {lineError?.description && (
                          <FieldError errors={[lineError.description]} />
                        )}
                      </Field>
                    </div>
                    <div className="col-span-10 md:col-span-3">
                      <Field data-invalid={Boolean(lineError?.price)}>
                        <FieldLabel>Precio</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(`services.${index}.price`, {
                              valueAsNumber: true,
                            })}
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupText>Bs.</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {lineError?.price && (
                          <FieldError errors={[lineError.price]} />
                        )}
                      </Field>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex justify-end pt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => servicesArray.remove(index)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* 4. Repuestos / Productos Iniciales (Opcional) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>4. Repuestos e Insumos (Opcional)</CardTitle>
              <CardDescription>
                Los productos agregados aquí se descontarán automáticamente del inventario al crear la orden.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                itemsArray.append({
                  productId: 0,
                  quantity: 1,
                  unitPrice: 0,
                })
              }
            >
              <Plus className="size-4" /> Agregar producto
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {itemsArray.fields.length === 0 ? (
              <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                No se han añadido productos iniciales.
              </p>
            ) : (
              itemsArray.fields.map((field, index) => {
                const lineError = errors.items?.[index];
                const lineSubtotal =
                  (Number(items[index]?.quantity) || 0) *
                  (Number(items[index]?.unitPrice) || 0);

                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="col-span-12 md:col-span-5">
                      <Controller
                        control={control}
                        name={`items.${index}.productId`}
                        render={({ field: f, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Producto *</FieldLabel>
                            <ProductPicker
                              value={f.value || undefined}
                              onChange={(product) => {
                                f.onChange(product.id);
                                setValue(
                                  `items.${index}.unitPrice`,
                                  Number(product.salePrice),
                                );
                              }}
                            />
                            {fieldState.error && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Field data-invalid={Boolean(lineError?.quantity)}>
                        <FieldLabel>Cantidad</FieldLabel>
                        <Input
                          type="number"
                          min={1}
                          step={1}
                          {...register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                        />
                        {lineError?.quantity && (
                          <FieldError errors={[lineError.quantity]} />
                        )}
                      </Field>
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <Field data-invalid={Boolean(lineError?.unitPrice)}>
                        <FieldLabel>Precio unit.</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            type="number"
                            min="0"
                            step="0.01"
                            {...register(`items.${index}.unitPrice`, {
                              valueAsNumber: true,
                            })}
                          />
                          <InputGroupAddon align="inline-end">
                            <InputGroupText>Bs.</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {lineError?.unitPrice && (
                          <FieldError errors={[lineError.unitPrice]} />
                        )}
                      </Field>
                    </div>
                    <div className="col-span-10 md:col-span-2">
                      <p className="text-xs text-muted-foreground">Subtotal</p>
                      <p className="pt-2 text-sm font-medium">
                        {formatMoney(lineSubtotal)}
                      </p>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex justify-end pt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => itemsArray.remove(index)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
            <FieldError errors={[errors.items?.root ?? errors.items]} />
          </CardContent>
        </Card>

        {/* Resumen y Acciones */}
        <Card>
          <CardContent className="flex flex-col items-end justify-between gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:w-64">
              <Field data-invalid={Boolean(errors.discount)}>
                <FieldLabel>Descuento (Bs.)</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  {...register("discount", { valueAsNumber: true })}
                />
                {errors.discount && <FieldError errors={[errors.discount]} />}
              </Field>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="text-sm text-muted-foreground">
                Subtotal: {formatMoney(subtotal)}
                {discount > 0 && ` · Descuento: -${formatMoney(discount)}`}
              </div>
              <div className="text-lg font-bold">
                Total estimado: {formatMoney(total)}
              </div>
              <Separator className="my-2" />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/orders")}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creando orden..." : "Crear orden de trabajo"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Modal para crear un Cliente + Vehículo nuevo directamente */}
      <ClientModal
        open={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onSubmit={handleCreateNewClient}
        isSubmitting={createClientMutation.isPending}
      />

      {/* Modal para agregar un vehículo nuevo al cliente seleccionado */}
      <QuickAddVehicleModal
        open={isAddVehicleModalOpen}
        client={clientDetailQuery.data}
        onClose={() => setIsAddVehicleModalOpen(false)}
        onVehicleCreated={(newVehicle) => {
          setValue("vehicleId", newVehicle.id, { shouldValidate: true });
        }}
      />
    </div>
  );
};
