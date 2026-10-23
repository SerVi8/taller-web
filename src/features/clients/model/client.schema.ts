import { z } from "zod";
import type { Client } from "./client.types";

export const clientFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150, "El nombre no puede superar los 150 caracteres"),
  phone: z
    .string()
    .trim()
    .min(1, "El teléfono es obligatorio")
    .max(30, "El teléfono no puede superar los 30 caracteres"),
  email: z.union([
    z.literal("").transform(() => null),
    z
      .string()
      .trim()
      .toLowerCase()
      .email("Ingresa un correo electrónico válido")
      .max(150),
  ]).nullable(),
  active: z.boolean(),
  vehicles: z.array(
    z.object({
      id: z.number().optional(),
      plate: z.string().trim().min(1, "La placa es obligatoria").max(15),
      model: z.string().max(50).nullable(),
      year: z.number().int().min(1886).max(new Date().getFullYear() + 1).nullable(),
      color: z.string().max(30).nullable(),
    }),
  ),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export const getClientFormDefaults = (
  client?: Client,
): ClientFormValues => ({
  name: client?.name ?? "",
  phone: client?.phone ?? "",
  email: client?.email ?? "",
  active: client?.active ?? true,
  vehicles: (client?.vehicles ?? []).map(
    ({ id, plate, model, year, color }) => ({ id, plate, model, year, color }),
  ),
});
