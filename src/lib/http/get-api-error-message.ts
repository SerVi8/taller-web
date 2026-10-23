import { ApiError } from "./api-error";

export function getApiErrorMessage(
  error: unknown,
  defaultMessage = "Ocurrió un error inesperado.",
): string {
  if (error instanceof ApiError) {
    if (error.status !== undefined && error.status >= 500) {
      return "Ocurrió un error en el servidor. Intenta nuevamente.";
    }

    return error.message || defaultMessage;
  }

  return defaultMessage;
}
