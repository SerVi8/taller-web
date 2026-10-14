import { api } from "@/lib/api";
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from "../types/auth.types";

const apiURL = "/auth"

export const authService = {
  login: async (credentials:LoginCredentials): Promise<LoginResponse> =>{
    const response = await api.post<LoginResponse>(apiURL + "/login", credentials )
    return response.data
  },
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await api.get<{user:AuthUser}>(apiURL + "/me")
    return response.data.user
  },
  logout: async (): Promise<void> =>{
    await api.post(apiURL + "/logout")
  },
}