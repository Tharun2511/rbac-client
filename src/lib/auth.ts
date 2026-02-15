import { IUser } from "./types";
import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";
const ORG_KEY = "active_org_id";
const PROJECT_KEY = "active_project_id";

// --- Token & User ---

export function saveAuth(token: string, refreshToken: string, user: IUser) {
  Cookies.set(TOKEN_KEY, token, {
    expires: 30 / (60 * 24), // ~30 minutes
    sameSite: "strict",
    secure: true,
  });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    expires: 7, // 7 days
    sameSite: "strict",
    secure: true,
  });
  Cookies.set(USER_KEY, JSON.stringify(user), {
    expires: 7,
    sameSite: "strict",
    secure: true,
  });
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function getAuthUser(): IUser | null {
  const raw = Cookies.get(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearAuth() {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(USER_KEY);
  // Also clear context from localStorage
  localStorage.removeItem(ORG_KEY);
  localStorage.removeItem(PROJECT_KEY);
}

// --- Active Context Persistence (localStorage) ---

export function saveActiveOrg(orgId: string) {
  localStorage.setItem(ORG_KEY, orgId);
}

export function getActiveOrg(): string | undefined {
  return localStorage.getItem(ORG_KEY) || undefined;
}

export function saveActiveProject(projectId: string) {
  localStorage.setItem(PROJECT_KEY, projectId);
}

export function getActiveProject(): string | undefined {
  return localStorage.getItem(PROJECT_KEY) || undefined;
}

export function clearActiveProject() {
  localStorage.removeItem(PROJECT_KEY);
}
