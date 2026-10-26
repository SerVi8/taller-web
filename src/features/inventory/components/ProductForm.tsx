import { useEffect, type FC } from "react";
import {
  getProductFormDefaults,
  productFormSchema,
  type ProductFormValues,
} from "../model/product.schema";
import type { Product } from "../model/product.types";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "@/components/ui/field";
import { ProductFields } from "./ProductFields";
import { FormActions } from "@/components/forms/FormAction";
import { Button } from "@/components/ui/button";

type ProductFormProps = {
  product?: Product;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const ProductForm: FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getProductFormDefaults(product),
  });

  useEffect(() => {
    form.reset(getProductFormDefaults(product));
  }, [product, form]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-[75vh] overflow-y-auto px-1"
      >
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <ProductFields showActive={Boolean(product)} />
          </div>
          <FormActions>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : product
                  ? "Actualizar"
                  : "Guardar"}
            </Button>
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancelar
            </Button>
          </FormActions>
        </FieldGroup>
      </form>
    </FormProvider>
  );
};
