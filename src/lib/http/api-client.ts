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

const AUTH_TOKEN_KEY = "lubrillantas_access_token";

export const authTokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string): void => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch {
      // Ignorar errores de almacenamiento (ej. modo privado estricto)
    }
  },
  clear: (): void => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      // Ignorar errores de almacenamiento
    }
  },
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = authTokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (!error.response) {
      return Promise.reject(
        new ApiError("No se pudo conectar con el servidor."),
      );
    }

    if (error.response.status === 401) {
      authTokenStorage.clear();
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
