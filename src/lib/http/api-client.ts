import axios, { AxiosError } from "axios";
import { ApiError, type ApiErrorDetails } from "./api-error";

type ErrorResponse = {
  error?: {
    code?: string;
    message?: string;
    details?: ApiErrorDetails;
  };
  // Compatibilidad temporal con respuestas anteriores del API.
  message?: string;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (!error.response) {
      return Promise.reject(
        new ApiError("No se pudo conectar con el servidor."),
      );
    }

    const apiError = error.response.data?.error;
    return Promise.reject(
      new ApiError(
        apiError?.message ?? error.response.data?.message ?? "Error inesperado.",
        error.response.status,
        apiError?.code,
        apiError?.details,
      ),
    );
  },
);
