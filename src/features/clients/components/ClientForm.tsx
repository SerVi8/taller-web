import { useEffect, type FC } from "react";
import type { Cliente } from "../types/client.types";
import { Controller, useForm } from "react-hook-form";
import { clienteSchema, type ClienteFormData } from "../schemas/client.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ClienteFormProps = {
  cliente?: Cliente;
  onSubmit: (data: ClienteFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const ClientForm: FC<ClienteFormProps> = ({
  cliente,
  onCancel,
  onSubmit,
  isSubmitting = false,
}) => {
  const defaultValues: ClienteFormData = {
    nombre: cliente?.nombre ?? "",
    email: cliente?.email ?? "",
    telefono: cliente?.telefono ?? "",
    direccion: cliente?.direccion ?? "",
  };

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cliente, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="nombre"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="nombre">Nombre completo</FieldLabel>
              <Input
                {...field}
                id="nombre"
                aria-invalid={fieldState.invalid}
                placeholder="Nombre del cliente"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="telefono"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
              <Input
                {...field}
                id="telefono"
                type="number"
                aria-invalid={fieldState.invalid}
                placeholder="Ej. 78945612"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="cliente@correo.com"
                type="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="direccion"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="direccion">Dirección</FieldLabel>
              <Input
                {...field}
                id="direccion"
                aria-invalid={fieldState.invalid}
                placeholder="Dirección del cliente"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field orientation="horizontal">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : cliente ? "Actualizar" : "Guardar"}
          </Button>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};
