import type {
  LoginCredentials,
  LoginResponse,
} from "../types/auth.types";

const MOCK_USER = {
  id: "1",
  username: "admin",
  password: "123456",
  name: "Administrador",
  role: "admin" as const,
};

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const username = credentials.username.trim();

  if (
    username !== MOCK_USER.username ||
    credentials.password !== MOCK_USER.password
  ) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  return {
    user: {
      id: MOCK_USER.id,
      username: MOCK_USER.username,
      name: MOCK_USER.name,
      role: MOCK_USER.role,
    },
  };
}