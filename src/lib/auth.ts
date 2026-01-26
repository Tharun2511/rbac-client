import { IUser } from "./types";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

import Cookies from "js-cookie";

export function saveAuth(token: string, user: IUser) {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7, // 7 days
    sameSite: "strict",
    secure: true,
  });
  Cookies.set(USER_KEY, JSON.stringify(user), {
    expires: 7, // 7 days
    sameSite: "strict",
    secure: true,
  });
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function getAuthUser(): IUser | null {
  const raw = Cookies.get(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearAuth() {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
}
