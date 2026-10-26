import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "@/components/ui/field";
import { FormActions } from "@/components/forms/FormAction";
import { Button } from "@/components/ui/button";
import {
  getEntryFormDeafaults,
  stockEntryFormSchema,
  type StockEntryFormValues,
} from "../model/stock.schema";
import { StockEntryItemsFields } from "./StockEntryItemFields";

type StockEntryProps = {
  onSubmit: (data: StockEntryFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const StockEntryForm: FC<StockEntryProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const form = useForm<StockEntryFormValues>({
    resolver: zodResolver(stockEntryFormSchema),
    defaultValues: getEntryFormDeafaults(),
  });
  useEffect(() => {
    form.reset(getEntryFormDeafaults());
  }, [form]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-[75vh] overflow-y-auto px-1"
      >
        <FieldGroup>
          <StockEntryItemsFields />
          <FormActions>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Registrar"}
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
