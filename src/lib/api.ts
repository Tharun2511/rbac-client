import { env } from "@/app/config/env";
import { clearAuth, getToken, saveAuth } from "./auth";

interface ApiOptions extends RequestInit {
  auth?: boolean;
}

export async function api(
  endpoint: string,
  options: ApiOptions,
): Promise<Response> {
  const headers = new Headers(options.headers || {});

  if (options.auth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  headers.set("Content-Type", "application/json");

  const res = await fetch(`${env.API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return res;
}

export async function refreshToken() {
  const res = await fetch(`${env.API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export const apiClient = async <T>(
  url: string,
  options: ApiOptions = {},
): Promise<T> => {
  const res = await api(url, options);

  if (res.status !== 401) {
    return res.json();
  }

  const newToken = await refreshToken();

  if (!newToken) {
    clearAuth();
    window.location.href = "/login";

    // @ts-expect-error T is not assignable to undefined
    return;
  }

  saveAuth(newToken.token, newToken.user);

  return (await api(url, options)).json();
};
