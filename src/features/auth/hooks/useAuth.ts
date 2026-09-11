import { login as loginService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import type { LoginCredentials } from "../types/auth.types";


export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  const login = async (credentials: LoginCredentials) => {
    const response = await loginService(credentials);
    loginStore(response.user);
    return response.user;
  };

  const logout = () => {
    logoutStore();
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
  };
}