import { AUTH_QUERY_KEY } from "@/features/auth/hooks/useAuth";
import { ApiError } from "@/types/api-error";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    const client: QueryClient = new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          // Sesión expirada en cualquier petición → limpiar usuario;
          // ProtectedRoute redirige solo a /login
          if (error instanceof ApiError && error.status === 401) {
            client.setQueryData(AUTH_QUERY_KEY, null);
          }
        },
      }),
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          retry: (failureCount, error) => {
            // no reintentar errores de cliente (401, 403, 404...)
            if (
              error instanceof ApiError &&
              error.status &&
              error.status < 500
            ) {
              return false;
            }
            return failureCount < 1;
          },
        },
      },
    });
    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
