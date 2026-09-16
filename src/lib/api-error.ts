import axios from "axios";

export function getApiErrorMessage(
  error: unknown,
  defaultMessage = "Ocurrió un error inesperado",
): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string") {
      return message;
    }

    if (!error.response?.status) {
      return defaultMessage;
    }

    if (error.response?.status === 400) {
      return "Los datos enviados no son válidos.";
    }

    if (error.response?.status === 401) {
      return "No estás autorizado para realizar esta acción.";
    }

    if (error.response?.status === 403) {
      return "No tienes permisos para realizar esta acción.";
    }

    if (error.response?.status === 404) {
      return "No se encontró el recurso solicitado.";
    }

    if (error.response?.status === 409) {
      return "La operación entra en conflicto con los datos existentes.";
    }

    if (error.response?.status >= 500) {
      return "Ocurrió un error en el servidor.";
    }

    if (error.code === "ERR_NETWORK") {
      return "No se pudo conectar con el servidor.";
    }
  }

  return defaultMessage;
}