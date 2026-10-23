import type { Pagination } from "@/types/api.types";

export interface Vehicle {
  id: number;
  clientId: number;
  plate: string;
  model: string | null;
  year: number | null;
  color: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  active: boolean;
  vehicles?: Vehicle[];
  createdAt: string;
  updatedAt: string;
}

export interface VehicleInput {
  id?: number;
  plate: string;
  model: string | null;
  year: number | null;
  color: string | null;
}

export interface ClientInput {
  name: string;
  phone: string;
  email: string | null;
  active: boolean;
  vehicles: VehicleInput[];
}

export interface ClientFilters {
  q: string;
  status: "active" | "inactive" | "all";
  page: number;
  limit: number;
}

export interface ClientsResponse {
  data: Client[];
  meta: Pagination;
}
