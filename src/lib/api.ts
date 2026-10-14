import { ApiError } from "@/types/api-error";
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (!error.response) {
      return Promise.reject(new ApiError("No se pudo conectar con el servidor"));
    }
    return Promise.reject(
      new ApiError(
        error.response.data?.message ?? "Error inesperado",
        error.response.status,
      ),
    );
  },
);