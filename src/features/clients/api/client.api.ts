import { api } from "@/lib/http/api-client";
import type {
  Client,
  ClientFilters,
  ClientInput,
  ClientsResponse,
} from "../model/client.types";

const clientsUrl = "/clients";

export const clientApi = {
  list: async (filters: ClientFilters): Promise<ClientsResponse> =>
    (await api.get<ClientsResponse>(clientsUrl, { params: filters })).data,
  getById: async (id: number): Promise<Client> =>
    (await api.get<Client>(`${clientsUrl}/${id}`)).data,
  create: async (data: ClientInput): Promise<Client> =>
    (await api.post<Client>(clientsUrl, data)).data,
  update: async (id: number, data: ClientInput): Promise<Client> =>
    (await api.patch<Client>(`${clientsUrl}/${id}`, data)).data,
  remove: async (id: number): Promise<void> => {
    await api.delete(`${clientsUrl}/${id}`);
  },
};
