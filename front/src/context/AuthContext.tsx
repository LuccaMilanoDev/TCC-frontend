"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "auth_standard_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      setIsAuthenticated(stored === "true");
    } catch {}
    setHydrated(true);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    if (username === "standard_user" && password === "password") {
      setIsAuthenticated(true);
      try { localStorage.setItem(AUTH_KEY, "true"); } catch {}
      return { ok: true as const };
    }
    return { ok: false as const, error: "Credenciais inválidas" };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try { localStorage.removeItem(AUTH_KEY); } catch {}
  }, []);

  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated, login, logout]);

  if (!hydrated) {
    return null; // avoid SSR/client mismatch
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
