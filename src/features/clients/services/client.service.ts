import { api } from "@/lib/api";

import type {
  Cliente,
  ClienteFilters,
  ClientesResponse,
  CreateClienteDTO,
  UpdateClienteDTO,
} from "../types/client.types";

const apiURL = "/clientes"

export const clienteService = {

  getAll: async (
    filters: ClienteFilters
  ): Promise<ClientesResponse> => {
    const response = await api.get<ClientesResponse>(apiURL, {params: filters});

    return response.data;
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await api.get<Cliente>(`${apiURL}/${id}`);

    return response.data;
  },

  create: async (data: CreateClienteDTO): Promise<Cliente> => {
    const response = await api.post<Cliente>(apiURL, data);

    return response.data;
  },

  update: async (
    id: number,
    data: UpdateClienteDTO,
  ): Promise<Cliente> => {
    const response = await api.put<Cliente>(
      `${apiURL}/${id}`,
      data,
    );

    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${apiURL}/${id}`);
  },
};