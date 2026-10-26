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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/forms/FormAction";

interface CompleteOrderModalProps {
  open: boolean;
  mileageIn: number;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (mileageOut: number) => Promise<void>;
}

export const CompleteOrderModal: FC<CompleteOrderModalProps> = ({
  open,
  mileageIn,
  isSubmitting = false,
  onClose,
  onConfirm,
}) => {
  const [mileageOut, setMileageOut] = useState(String(mileageIn));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(mileageOut);
    if (!Number.isInteger(numeric) || numeric < mileageIn) {
      setError(
        `El kilometraje de salida no puede ser menor al de ingreso (${mileageIn} km).`,
      );
      return;
    }
    setError(null);
    await onConfirm(numeric);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isSubmitting ? undefined : (o) => !o && onClose()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Completar orden de trabajo</DialogTitle>
          <DialogDescription>
            Registra el kilometraje de salida del vehículo para cerrar la orden.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field data-invalid={Boolean(error)}>
            <FieldLabel>
              Kilometraje de salida (ingreso: {mileageIn.toLocaleString("es-BO")} km)
            </FieldLabel>
            <Input
              type="number"
              min={mileageIn}
              value={mileageOut}
              onChange={(e) => setMileageOut(e.target.value)}
              placeholder={String(mileageIn)}
            />
            {error && <FieldError errors={[{ message: error }]} />}
          </Field>
          <FormActions>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Completando..." : "Confirmar y completar"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </FormActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface CancelOrderModalProps {
  open: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export const CancelOrderModal: FC<CancelOrderModalProps> = ({
  open,
  isSubmitting = false,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) {
      setError("Ingresa el motivo de la cancelación.");
      return;
    }
    setError(null);
    await onConfirm(trimmed);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isSubmitting ? undefined : (o) => !o && onClose()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancelar orden de trabajo</DialogTitle>
          <DialogDescription>
            Al cancelar la orden, cualquier repuesto asignado será devuelto automáticamente al stock.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field data-invalid={Boolean(error)}>
            <FieldLabel>Motivo de cancelación *</FieldLabel>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej. El cliente decidió postergar la reparación..."
              rows={3}
            />
            {error && <FieldError errors={[{ message: error }]} />}
          </Field>
          <FormActions>
            <Button
              type="submit"
              variant="destructive"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cancelando..." : "Confirmar cancelación"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Volver
            </Button>
          </FormActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
