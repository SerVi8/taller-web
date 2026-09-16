import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { clienteService } from "../services/client.service";
import type {
  ClienteFilters,
  CreateClienteDTO,
  UpdateClienteDTO,
} from "../types/client.types";

const CLIENTES_QUERY_KEY = ["clientes"];

export function useClientes(
  filters: ClienteFilters
) {
  return useQuery({
    queryKey: [...CLIENTES_QUERY_KEY, filters],
    queryFn: () => clienteService.getAll(filters),
  });
}

export function useCreateCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClienteDTO) =>
      clienteService.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CLIENTES_QUERY_KEY,
      });
    },
  });
}

export function useUpdateCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateClienteDTO;
    }) => clienteService.update(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CLIENTES_QUERY_KEY,
      });
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      clienteService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CLIENTES_QUERY_KEY,
      });
    },
  });
}