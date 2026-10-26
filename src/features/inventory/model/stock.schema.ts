import z from "zod";

export const stockEntryFormSchema = z.object({
  notes: z.string().trim().max(255).nullable(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive("Debe seleccionar un producto"),
        quantity: z.number().positive("La cantidad debe ser positiva"),
        unitCost: z.number().min(0, "El costo no debe se menor que 0"),
      }),
    )
    .min(1, "Np hay productos seleccionado")
    .refine(
      (items) => new Set(items.map((i) => i.productId)).size === items.length,
      "Hay productos duplicados, unalos en una sola linea",
    ),
});

export type StockEntryFormValues = z.infer<typeof stockEntryFormSchema>;
export const getEntryFormDeafaults = (): StockEntryFormValues => ({
  notes: "",
  items: [],
});
