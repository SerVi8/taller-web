import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { AUTH_QUERY_KEY } from "../model/auth.keys";
import { ApiError } from "@/lib/http/api-error";


export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        return await authApi.getCurrentUser();
      } catch (error) {
        // 401 = simplemente no hay sesión, no es un error de la app
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}


export function useLogin () {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({user}) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user)
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({
        predicate: (q) => q.queryKey[0] !== "auth", // limpia datos de la sesión anterior
      });
    },
  });
}

// Hook de lectura para componentes: ¿quién soy?
export function useAuth() {
  const { data: user, isLoading } = useCurrentUser();
  return { user: user ?? null, isAuthenticated: !!user, isLoading };
}
