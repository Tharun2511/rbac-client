import { env } from "@/app/config/env";
import {
  clearAuth,
  getActiveOrg,
  getActiveProject,
  getRefreshToken,
  getToken,
  saveAuth,
} from "./auth";

interface ApiOptions extends RequestInit {
  auth?: boolean;
  skipAuthRetry?: boolean;
}

export async function api(
  endpoint: string,
  options: ApiOptions,
): Promise<Response> {
  const headers = new Headers(options.headers || {});

  if (options.auth !== false) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Automatically attach context headers
  const orgId = getActiveOrg();
  const projectId = getActiveProject();
  if (orgId) headers.set("x-org-id", orgId);
  if (projectId) headers.set("x-project-id", projectId);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${env.API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return res;
}

export async function refreshTokenRequest() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${env.API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;
  return res.json();
}

export const apiClient = async <T>(
  url: string,
  options: ApiOptions = {},
): Promise<T> => {
  const res = await api(url, options);

  if (res.status !== 401) {
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(
        errorBody.message || `Request failed with status ${res.status}`,
      );
    }
    return res.json();
  }

  if (options.skipAuthRetry) {
    throw new Error("Please enter valid email and password!");
  }

  const newToken = await refreshTokenRequest();

  if (!newToken) {
    clearAuth();
    window.location.href = "/login";
    return undefined as unknown as T;
  }

  saveAuth(newToken.token, newToken.refreshToken, newToken.user);

  const retryRes = await api(url, options);
  if (!retryRes.ok) {
    const errorBody = await retryRes.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Request failed with status ${retryRes.status}`,
    );
  }
  return retryRes.json();
};
