import { useFormContext } from "react-hook-form";
import { type ProductFormValues } from "../model/product.schema";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ProductInput } from "../model/product.types";
import type { FormFields } from "@/components/forms/form.types";

type ProductFieldsProps = {
  showActive: boolean;
};

const fields: FormFields<ProductInput> = [
  { name: "sku", label: "Código/SKU", placeholder: "ABC123", type: "text" },
  {
    name: "name",
    label: "Nombre",
    placeholder: "Nombre del producto",
    type: "text",
  },
  {
    name: "description",
    label: "Descripción",
    placeholder: "Descripción",
    type: "text",
    className: "col-span-full",
  },
  {
    name: "costPrice",
    label: "Precio de compra",
    placeholder: "0.00",
    type: "number",
    min: "0",
    step: "0.01",
    setValueAs: (value: string) => (value === "" ? null : Number(value)),
  },
  {
    name: "salePrice",
    label: "Precio de venta",
    placeholder: "0.00",
    type: "number",
    min: "0",
    step: "0.01",
    setValueAs: (value: string) => (value === "" ? null : Number(value)),
  },
  {
    name: "minStock",
    label: "Cantidad mínima",
    placeholder: "0",
    type: "number",
    min: "0",
    setValueAs: (value: string) => (value === "" ? null : Number(value)),
  },
  { name: "unit", label: "Unidad", placeholder: "Ej: pza, lt", type: "text" },
];

export function ProductFields({ showActive }: ProductFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  return (
    <>
      {fields.map(
        ({
          name,
          label,
          placeholder,
          type,
          min,
          max,
          step,
          setValueAs,
          className,
        }) => {
          const error = errors[name];

          return (
            <Field key={name} data-invalid={!!error} className={className}>
              <FieldLabel htmlFor={name}>{label}</FieldLabel>
              <Input
                id={name}
                type={type}
                placeholder={placeholder}
                autoComplete="off"
                aria-invalid={!!error}
                {...(min !== undefined && { min })}
                {...(max !== undefined && { max })}
                {...(step !== undefined && { step })}
                {...register(name, setValueAs ? { setValueAs } : {})}
              />
              {error && <FieldError errors={[error]} />}
            </Field>
          );
        },
      )}
      {showActive && (
        <Field orientation="horizontal">
          <input
            id="active"
            type="checkbox"
            className="size-4 accent-primary"
            {...register("active")}
          />
          <FieldLabel htmlFor="active">Producto activo</FieldLabel>
        </Field>
      )}
      {!showActive && (
        <Field key="initialStock" data-invalid={errors["initialStock"]}>
          <FieldLabel htmlFor="initialStock">Cantidad incial</FieldLabel>
          <Input
            id="initialStock"
            type="number"
            placeholder="0"
            autoComplete="off"
            min="0"
            {...register("initialStock", {
              setValueAs: (value: string) =>
                value === "" ? null : Number(value),
            })}
          />
          {errors && <FieldError errors={[errors.initialStock]} />}
        </Field>
      )}
    </>
  );
}
