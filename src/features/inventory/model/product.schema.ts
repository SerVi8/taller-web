import z from "zod";
import type { Product } from "./product.types";

export const productFormSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(2, "El codigo del producto debe tener al menos 2 caracteres")
    .max(50, "El codigo no puede superar los 50 caracteres"),
  name: z
    .string()
    .trim()
    .min(2, "Ingrese el nombre del producto")
    .max(150, "El nombre no puede superar los 150 caracteres"),
  description: z.string().max(200).nullable(),
  unit: z.string().trim().min(2, "Ingrese la unida del producto").max(20),
  costPrice: z.number().nullable(),
  salePrice: z.number().nullable(),
  minStock: z.number().nullable(),
  active: z.boolean(),

  initialStock: z
    .number()
    .min(0, "La cantidad inicial debe ser mayor a 0")
    .nullable(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export const getProductFormDefaults = (
  product?: Product,
): ProductFormValues => ({
  sku: product?.sku ?? "",
  name: product?.name ?? "",
  description: product?.description ?? "",
  unit: product?.unit ?? "",
  costPrice: product?.costPrice ?? null,
  salePrice: product?.salePrice ?? null,
  minStock: product?.minStock ?? null,
  active: product?.active ?? true,
  initialStock: null,
});
