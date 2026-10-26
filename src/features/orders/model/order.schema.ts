import { z } from "zod";
import { WORK_ORDER_STATUSES } from "./order.types";

const emptyToNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

export const orderServiceLineSchema = z.object({
  title: z.string().max(150).transform(emptyToNull).nullable(),
  description: z.string().trim().min(1, "La descripción del servicio es obligatoria"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  complete: z.boolean(),
});

export const orderItemLineSchema = z.object({
  productId: z.number().int().positive("Selecciona un producto"),
  quantity: z.number().int().positive("La cantidad debe ser mayor a 0"),
  unitPrice: z.number().min(0, "El precio no puede ser negativo"),
});

export const createOrderFormSchema = z.object({
  clientId: z.number().int().positive("Selecciona un cliente"),
  vehicleId: z.number().int().positive("Selecciona un vehículo"),
  status: z.enum(WORK_ORDER_STATUSES),
  mileageIn: z
    .number({ message: "Ingresa el kilometraje" })
    .int("Debe ser un número entero")
    .min(0, "El kilometraje no puede ser negativo"),
  complaint: z
    .string()
    .trim()
    .min(1, "El motivo de ingreso o falla reportada es obligatorio"),
  diagnosis: z.string().max(2000).transform(emptyToNull).nullable(),
  observations: z.string().max(2000).transform(emptyToNull).nullable(),
  recommendations: z.string().max(2000).transform(emptyToNull).nullable(),
  discount: z.number().min(0, "El descuento no puede ser negativo"),
  services: z.array(orderServiceLineSchema),
  items: z
    .array(orderItemLineSchema)
    .refine(
      (items) => new Set(items.map((i) => i.productId)).size === items.length,
      "Hay productos repetidos; une las cantidades en una sola línea",
    ),
});

export const updateOrderNotesSchema = z.object({
  complaint: z
    .string()
    .trim()
    .min(1, "El motivo de ingreso o falla reportada es obligatorio"),
  diagnosis: z.string().max(2000).transform(emptyToNull).nullable(),
  observations: z.string().max(2000).transform(emptyToNull).nullable(),
  recommendations: z.string().max(2000).transform(emptyToNull).nullable(),
  discount: z.number().min(0, "El descuento no puede ser negativo"),
});

export type CreateOrderFormValues = z.input<typeof createOrderFormSchema>;
export type UpdateOrderNotesValues = z.input<typeof updateOrderNotesSchema>;

export const getCreateOrderDefaults = (): CreateOrderFormValues => ({
  clientId: 0,
  vehicleId: 0,
  status: "open",
  mileageIn: 0,
  complaint: "",
  diagnosis: "",
  observations: "",
  recommendations: "",
  discount: 0,
  services: [],
  items: [],
});
