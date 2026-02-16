"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { IUser, LoginResponse } from "@/lib/types";
import { saveAuth, getToken, getAuthUser, clearAuth } from "@/lib/auth";
import { login as apiLogin } from "@/lib/api/api.auth";

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from cookies on mount to avoid SSR mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      const token = getToken();
      const storedUser = getAuthUser();
      if (token && storedUser) {
        setUser(storedUser);
      }
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResponse> => {
      const data = await apiLogin(email, password);
      saveAuth(data.token, data.refreshToken, data.user);
      setUser(data.user);
      return data;
    },
    [],
  );

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
