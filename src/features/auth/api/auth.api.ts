import { api, authTokenStorage } from "@/lib/http/api-client";
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "../model/auth.types";

const authUrl = "/auth";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>(
      `${authUrl}/login`,
      credentials,
    );
    if (data.token) {
      authTokenStorage.set(data.token);
    }
    return data;
  },
  getCurrentUser: async (): Promise<AuthUser> =>
    (await api.get<{ user: AuthUser }>(`${authUrl}/me`)).data.user,
  logout: async (): Promise<void> => {
    try {
      await api.post(`${authUrl}/logout`);
    } finally {
      authTokenStorage.clear();
    }
  },
};
