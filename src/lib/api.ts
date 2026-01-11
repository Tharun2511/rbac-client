import { env } from "@/app/config/env";
import { getToken } from "./auth";

interface ApiOptions extends RequestInit {
  auth?: boolean;
}

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
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

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "API error");
  }

  return res.json();
}
