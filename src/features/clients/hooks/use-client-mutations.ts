import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "../api/client.api";
import { clientKeys } from "../model/client.keys";
import type { ClientInput } from "../model/client.types";

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClientInput) => clientApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: clientKeys.lists() }),
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ClientInput }) =>
      clientApi.update(id, data),
    onSuccess: async (_client, { id }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: clientKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: clientKeys.lists() }),
      ]);
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => clientApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: clientKeys.lists() }),
  });
}
