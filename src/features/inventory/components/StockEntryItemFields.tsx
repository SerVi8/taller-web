import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import type { StockEntryFormValues } from "../model/stock.schema";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ProductPicker } from "./ProductPicker";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

const emptyLine = { productId: 0, quantity: 1, unitCost: 0 };

export function StockEntryItemsFields() {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<StockEntryFormValues>();

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // useWatch (no watch): re-renderiza solo este componente al cambiar las líneas
  const items = useWatch({ control, name: "items" });
  const total = (items ?? []).reduce(
    (sum, i) => sum + (Number(i?.quantity) || 0) * (Number(i?.unitCost) || 0),
    0,
  );

  return (
    <section className="space-y-6">
      <Field>
        <FieldLabel>Nota</FieldLabel>
        <Input
          {...register("notes")}
          placeholder="Obserbaciones del registro"
          aria-invalid={Boolean(errors.notes)}
        />
        <FieldError errors={[errors.notes]} />
      </Field>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-medium">Productos</h3>
          <p className="text-sm text-muted-foreground">
            Agrega los productos que ingresan.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(emptyLine, { shouldFocus: false })}
        >
          <Plus className="size-4" /> Agregar línea
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground text-center p-4 border rounded-2xl">
          Aún no hay productos en este ingreso.
        </p>
      )}

      {fields.map((field, index) => {
        const lineErrors = errors.items?.[index];
        const subtotal =
          (Number(items?.[index]?.quantity) || 0) *
          (Number(items?.[index]?.unitCost) || 0);

        return (
          // key={field.id}, nunca el index: RHF genera un id estable por línea
          <div
            key={field.id}
            className="grid grid-cols-12 items-start gap-4 rounded-md border p-3"
          >
            <div className="col-span-12 md:col-span-5">
              <Controller
                control={control}
                name={`items.${index}.productId`}
                render={({ field: f, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Producto</FieldLabel>
                    <ProductPicker
                      value={f.value || undefined}
                      onChange={(product) => {
                        f.onChange(product.id);
                        // sugerencia: precarga el último costo, sigue siendo editable
                        setValue(
                          `items.${index}.unitCost`,
                          Number(product.costPrice),
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

            <div className="col-span-5 md:col-span-2">
              <Field data-invalid={!!lineErrors?.quantity}>
                <FieldLabel>Cantidad</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  step="0"
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  className="no-spinner"
                  placeholder="0"
                />
                {lineErrors?.quantity && (
                  <FieldError errors={[lineErrors.quantity]} />
                )}
              </Field>
            </div>

            <div className="col-span-5 md:col-span-2">
              <Field data-invalid={!!lineErrors?.unitCost}>
                <FieldLabel>Costo unit.</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...register(`items.${index}.unitCost`, {
                      valueAsNumber: true,
                    })}
                    className="no-spinner"
                  />
                  <InputGroupAddon align={"inline-end"}>
                    <InputGroupText>Bs.</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {lineErrors?.unitCost && (
                  <FieldError errors={[lineErrors.unitCost]} />
                )}
              </Field>
            </div>

            <div className="col-span-10 md:col-span-2">
              <p className="text-xs text-muted-foreground">Subtotal</p>
              <p className="pt-2 text-sm font-medium">{subtotal.toFixed(2)}</p>
            </div>

            <div className="col-span-1 md:col-span-1 flex justify-end pt-6">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                aria-label="Quitar línea"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        );
      })}

      {/* errores de la lista completa: vacía o productos repetidos */}
      <FieldError errors={[errors.items?.root ?? errors.items]} />

      <div className="flex justify-end border-t pt-3">
        <p className="text-sm">
          Total:{" "}
          <span className="text-base font-semibold">{total.toFixed(2)}</span>
        </p>
      </div>
    </section>
  );
}
