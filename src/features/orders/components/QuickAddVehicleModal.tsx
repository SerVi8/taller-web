import { useState, type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/forms/FormAction";
import type { Client, Vehicle } from "@/features/clients/model/client.types";
import { useUpdateClient } from "@/features/clients/hooks/use-client-mutations";
import { toastError, toastSuccess } from "@/lib/feedback/toast";
import { getApiErrorMessage } from "@/lib/http/get-api-error-message";

interface QuickAddVehicleModalProps {
  open: boolean;
  client: Client | undefined;
  onClose: () => void;
  onVehicleCreated: (vehicle: Vehicle, updatedClient: Client) => void;
}

export const QuickAddVehicleModal: FC<QuickAddVehicleModalProps> = ({
  open,
  client,
  onClose,
  onVehicleCreated,
}) => {
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [plateError, setPlateError] = useState<string | null>(null);

  const updateClient = useUpdateClient();

  const resetForm = () => {
    setPlate("");
    setModel("");
    setYear("");
    setColor("");
    setPlateError(null);
  };

  const handleClose = () => {
    if (!updateClient.isPending) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    const cleanPlate = plate.trim().toUpperCase();
    if (!cleanPlate) {
      setPlateError("La placa es obligatoria.");
      return;
    }
    setPlateError(null);

    try {
      const existingVehicles = (client.vehicles ?? []).map((v) => ({
        id: v.id,
        plate: v.plate,
        model: v.model,
        year: v.year,
        color: v.color,
      }));

      const updated = await updateClient.mutateAsync({
        id: client.id,
        data: {
          name: client.name,
          phone: client.phone,
          email: client.email,
          active: client.active,
          vehicles: [
            ...existingVehicles,
            {
              plate: cleanPlate,
              model: model.trim() || null,
              year: year ? Number(year) : null,
              color: color.trim() || null,
            },
          ],
        },
      });

      const createdVehicle =
        updated.vehicles?.find(
          (v) => v.plate.toUpperCase() === cleanPlate,
        ) ?? updated.vehicles?.[updated.vehicles.length - 1];

      toastSuccess(`Vehículo ${cleanPlate} agregado a ${client.name}.`);
      resetForm();
      if (createdVehicle) {
        onVehicleCreated(createdVehicle, updated);
      }
      onClose();
    } catch (error) {
      toastError(
        getApiErrorMessage(error, "No se pudo registrar el vehículo."),
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar vehículo</DialogTitle>
          <DialogDescription>
            {client
              ? `Registra un nuevo vehículo para ${client.name}.`
              : "Registra un nuevo vehículo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field data-invalid={Boolean(plateError)}>
            <FieldLabel>Placa *</FieldLabel>
            <Input
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="Ej. 1234ABC"
              maxLength={15}
            />
            {plateError && (
              <FieldError errors={[{ message: plateError }]} />
            )}
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel>Marca / Modelo</FieldLabel>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ej. Toyota Corolla"
                maxLength={50}
              />
            </Field>
            <Field>
              <FieldLabel>Año</FieldLabel>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ej. 2020"
                min={1900}
                max={new Date().getFullYear() + 1}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel>Color</FieldLabel>
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Ej. Blanco"
              maxLength={30}
            />
          </Field>
          <FormActions>
            <Button type="submit" disabled={updateClient.isPending}>
              {updateClient.isPending ? "Guardando..." : "Guardar vehículo"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          </FormActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
