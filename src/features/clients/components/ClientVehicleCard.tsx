import { Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ClientFormValues } from "../model/client.schema";

type ClientVehicleCardProps = {
  index: number;
  onRemove: () => void;
};

export function ClientVehicleCard({ index, onRemove }: ClientVehicleCardProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ClientFormValues>();
  const vehicleErrors = errors.vehicles?.[index];

  return (
    <div className="space-y-3 rounded-md bg-muted/40 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Vehículo {index + 1}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Quitar vehículo"
          onClick={onRemove}
        >
          <Trash2 />
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field>
          <FieldLabel>Placa</FieldLabel>
          <Input
            {...register(`vehicles.${index}.plate`)}
            placeholder="ABC-123"
            aria-invalid={Boolean(vehicleErrors?.plate)}
          />
          <FieldError errors={[vehicleErrors?.plate]} />
        </Field>
        <Field>
          <FieldLabel>Marca / modelo</FieldLabel>
          <Input
            {...register(`vehicles.${index}.model`, {
              setValueAs: (value: string) => (value === "" ? null : value),
            })}
            placeholder="Toyota Corolla"
          />
        </Field>
        <Field>
          <FieldLabel>Año</FieldLabel>
          <Input
            type="number"
            min="1886"
            max={new Date().getFullYear() + 1}
            {...register(`vehicles.${index}.year`, {
              setValueAs: (value: string) =>
                value === "" ? null : Number(value),
            })}
            placeholder="2020"
          />
        </Field>
        <Field>
          <FieldLabel>Color</FieldLabel>
          <Input
            {...register(`vehicles.${index}.color`, {
              setValueAs: (value: string) => (value === "" ? null : value),
            })}
            placeholder="Blanco"
          />
        </Field>
      </div>
    </div>
  );
}
