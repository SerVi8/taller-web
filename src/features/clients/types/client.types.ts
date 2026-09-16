import type { PaginatedResponse } from "@/types/api.types";

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  email: string | null;
  direccion: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClienteDTO {
  nombre: string;
  telefono: string;
  email?: string;
  direccion?: string;
}

export interface UpdateClienteDTO {
  nombre: string;
  telefono: string;
  email?: string;
  direccion?: string;
}

export interface ClienteFilters {
  search: string;
  page: number;
  limit: number;
}

export type ClientesResponse = PaginatedResponse<Cliente>;