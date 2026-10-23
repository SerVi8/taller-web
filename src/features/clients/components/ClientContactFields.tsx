import { useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ClientFormValues } from "../model/client.schema";

type ClientContactFieldsProps = {
  showActive: boolean;
};

const fields = [
  {
    name: "name",
    label: "Nombre completo",
    placeholder: "Nombre del cliente",
    type: "text",
  },
  {
    name: "phone",
    label: "Teléfono",
    placeholder: "Ej. 78945612",
    type: "text",
  },
  {
    name: "email",
    label: "Correo electrónico",
    placeholder: "cliente@correo.com",
    type: "email",
  },
] as const;

export function ClientContactFields({ showActive }: ClientContactFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ClientFormValues>();

  return (
    <>
      {fields.map(({ name, label, placeholder, type }) => (
        <Field key={name}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            aria-invalid={Boolean(errors[name])}
            {...register(name)}
          />
          <FieldError errors={[errors[name]]} />
        </Field>
      ))}
      {showActive && (
        <Field orientation="horizontal">
          <input
            id="active"
            type="checkbox"
            className="size-4 accent-primary"
            {...register("active")}
          />
          <FieldLabel htmlFor="active">Cliente activo</FieldLabel>
        </Field>
      )}
    </>
  );
}
