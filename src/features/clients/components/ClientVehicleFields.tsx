import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import type { ClientFormValues } from "../model/client.schema";
import { ClientVehicleCard } from "./ClientVehicleCard";

export function ClientVehicleFields() {
  const { control, formState } = useFormContext<ClientFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicles",
  });

  return (
    <section className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-medium">Vehículos</h3>
          <p className="text-sm text-muted-foreground">
            Agrega las placas y datos disponibles.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ plate: "", model: null, year: null, color: null })
          }
        >
          <Plus /> Agregar
        </Button>
      </div>
      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Sin vehículos registrados.
        </p>
      )}
      {fields.map((field, index) => (
        <ClientVehicleCard
          key={field.id}
          index={index}
          onRemove={() => remove(index)}
        />
      ))}
      <FieldError errors={[formState.errors.vehicles?.root]} />
    </section>
  );
}
