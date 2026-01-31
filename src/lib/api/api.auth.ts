import { apiClient as api } from "../api";
import { LoginResponse } from "../types";

export async function login(email: string, password: string) {
  return api<LoginResponse>("/auth/login", {
    method: "POST",
    skipAuthRetry: true,
    body: JSON.stringify({ email, password }),
  });
}
