import { api } from "@/lib/http/api-client";
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "../model/auth.types";

const authUrl = "/auth";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> =>
    (await api.post<LoginResponse>(`${authUrl}/login`, credentials)).data,
  getCurrentUser: async (): Promise<AuthUser> =>
    (await api.get<{ user: AuthUser }>(`${authUrl}/me`)).data.user,
  logout: async (): Promise<void> => {
    await api.post(`${authUrl}/logout`);
  },
};
