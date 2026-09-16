import { z } from "zod";

export const clienteSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 caracteres")
    .max(20, "El teléfono no puede superar los 20 caracteres"),

  email: z
    .string()
    .email("Ingresa un correo electrónico válido")
    .optional()
    .or(z.literal("")),

  direccion: z
    .string()
    .max(200, "La dirección no puede superar los 200 caracteres")
    .optional()
    .or(z.literal("")),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;