import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Ocurrió un error",
  message = "No se pudo cargar la información.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
      <AlertCircle className="size-6 text-destructive" />

      <div className="space-y-1">
        <h3 className="font-medium">{title}</h3>

        <p className="text-sm text-muted-foreground">{message}</p>
      </div>

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="mr-2 size-4" />
          Reintentar
        </Button>
      )}
    </div>
  );
}
