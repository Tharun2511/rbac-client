import { api } from "../api";
import { LoginResponse } from "../types";

export async function login(email: string, password: string) {
  return api<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
