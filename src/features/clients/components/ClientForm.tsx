import { useEffect, type FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { FormActions } from "@/components/forms/FormAction";
import type { Client } from "../model/client.types";
import {
  clientFormSchema,
  getClientFormDefaults,
  type ClientFormValues,
} from "../model/client.schema";
import { ClientContactFields } from "./ClientContactFields";
import { ClientVehicleFields } from "./ClientVehicleFields";

type ClientFormProps = {
  client?: Client;
  onSubmit: (data: ClientFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export const ClientForm: FC<ClientFormProps> = ({
  client,
  onCancel,
  onSubmit,
  isSubmitting = false,
}) => {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: getClientFormDefaults(client),
  });

  useEffect(() => {
    form.reset(getClientFormDefaults(client));
  }, [client, form]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-h-[75vh] overflow-y-auto pr-1"
      >
        <FieldGroup>
          <ClientContactFields showActive={Boolean(client)} />
          <ClientVehicleFields />
          <FormActions>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : client ? "Actualizar" : "Guardar"}
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
