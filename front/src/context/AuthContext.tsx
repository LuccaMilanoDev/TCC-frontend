"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { setProblemUser, setPerformanceUser, setVisualUser } from "@/lib/flags";

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
    if (password === "password") {
      // locked_out_user: should not authenticate and must return a clear error
      if (username === "locked_out_user") {
        return { ok: false as const, error: "Desculpe esse usuario foi bloqueado 🙂" };
      }
      if (username === "standard_user") {
        setIsAuthenticated(true);
        try { localStorage.setItem(AUTH_KEY, "true"); } catch {}
        try { setProblemUser(false); } catch {}
        try { setPerformanceUser(false); } catch {}
        return { ok: true as const };
      }
      if (username === "problem_user") {
        setIsAuthenticated(true);
        try { localStorage.setItem(AUTH_KEY, "true"); } catch {}
        try { setProblemUser(true); } catch {}
        try { setPerformanceUser(false); } catch {}
        return { ok: true as const };
      }
      if (username === "performance_user") {
        setIsAuthenticated(true);
        try { localStorage.setItem(AUTH_KEY, "true"); } catch {}
        try { setProblemUser(false); } catch {}
        try { setPerformanceUser(true); } catch {}
        return { ok: true as const };
      }
      if (username === "visual_user") {
        setIsAuthenticated(true);
        try { localStorage.setItem(AUTH_KEY, "true"); } catch {}
        try { setProblemUser(false); } catch {}
        try { setPerformanceUser(false); } catch {}
        try { setVisualUser(true); } catch {}
        return { ok: true as const };
      }
    }
    return { ok: false as const, error: "Credenciais inválidas" };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try { localStorage.removeItem(AUTH_KEY); } catch {}
    try { setProblemUser(false); } catch {}
    try { setPerformanceUser(false); } catch {}
    try { setVisualUser(false); } catch {}
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
