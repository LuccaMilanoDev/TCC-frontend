"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setProblemUser, setPerformanceUser, setVisualUser } from "@/lib/flags";

export type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = "auth_standard_user";
const AUTH_EXPIRED_KEY = "auth_expired_user";
const AUTH_EXPIRES_AT = "auth_expired_expires_at"; // epoch ms

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const clearLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    try {
      const standardStored = localStorage.getItem(AUTH_KEY);
      const expiredStored = localStorage.getItem(AUTH_EXPIRED_KEY);
      const expiresAtStr = localStorage.getItem(AUTH_EXPIRES_AT);

      // First priority: standard/performance/problem/visual flows stored under AUTH_KEY
      if (standardStored === "true") {
        setIsAuthenticated(true);
      } else if (expiredStored === "true") {
        const now = Date.now();
        const expiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : 0;
        if (expiresAt && expiresAt > now) {
          setIsAuthenticated(true);
          const remaining = Math.max(0, expiresAt - now);
          clearLogoutTimer();
          logoutTimerRef.current = setTimeout(() => {
            logout();
          }, remaining);
        } else {
          // Expired already; cleanup any stale keys
          try { localStorage.removeItem(AUTH_EXPIRED_KEY); } catch {}
          try { localStorage.removeItem(AUTH_EXPIRES_AT); } catch {}
          setIsAuthenticated(false);
          // ensure redirect away from protected pages
          try { router.push("/"); } catch {}
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch {}
    setHydrated(true);

    return () => {
      clearLogoutTimer();
    };
  }, [clearLogoutTimer, router]);

  const login = useCallback(async (username: string, password: string) => {
    if (password === "password") {
      // locked_out_user: should not authenticate and must return a clear error
      if (username === "locked_out_user") {
        return { ok: false as const, error: "Desculpe esse usuario foi bloqueado 🙂" };
      }
      if (username === "standard_user") {
        setIsAuthenticated(true);
        try { localStorage.setItem(AUTH_KEY, "true"); } catch {}
        // ensure expired-user keys are cleared if they existed from a previous session
        try { localStorage.removeItem(AUTH_EXPIRED_KEY); } catch {}
        try { localStorage.removeItem(AUTH_EXPIRES_AT); } catch {}
        clearLogoutTimer();
        try { setProblemUser(false); } catch {}
        try { setPerformanceUser(false); } catch {}
        return { ok: true as const };
      }
      if (username === "problem_user") {
        setIsAuthenticated(true);
        try { localStorage.setItem(AUTH_KEY, "true"); } catch {}
        try { localStorage.removeItem(AUTH_EXPIRED_KEY); } catch {}
        try { localStorage.removeItem(AUTH_EXPIRES_AT); } catch {}
        clearLogoutTimer();
        try { setProblemUser(true); } catch {}
        try { setPerformanceUser(false); } catch {}
        return { ok: true as const };
      }
      if (username === "performance_user") {
        setIsAuthenticated(true);
        try { localStorage.setItem(AUTH_KEY, "true"); } catch {}
        try { localStorage.removeItem(AUTH_EXPIRED_KEY); } catch {}
        try { localStorage.removeItem(AUTH_EXPIRES_AT); } catch {}
        clearLogoutTimer();
        try { setProblemUser(false); } catch {}
        try { setPerformanceUser(true); } catch {}
        return { ok: true as const };
      }
      if (username === "visual_user") {
        setIsAuthenticated(true);
        try { localStorage.setItem(AUTH_KEY, "true"); } catch {}
        try { localStorage.removeItem(AUTH_EXPIRED_KEY); } catch {}
        try { localStorage.removeItem(AUTH_EXPIRES_AT); } catch {}
        clearLogoutTimer();
        try { setProblemUser(false); } catch {}
        try { setPerformanceUser(false); } catch {}
        try { setVisualUser(true); } catch {}
        return { ok: true as const };
      }
      if (username === "auth_expired_user") {
        // Authenticate but set a 15-second expiry
        setIsAuthenticated(true);
        try {
          // Do NOT set AUTH_KEY to avoid persisting as a normal session
          localStorage.setItem(AUTH_EXPIRED_KEY, "true");
          const expiresAt = Date.now() + 15000; // 15 seconds
          localStorage.setItem(AUTH_EXPIRES_AT, String(expiresAt));
        } catch {}
        try { setProblemUser(false); } catch {}
        try { setPerformanceUser(false); } catch {}
        try { setVisualUser(false); } catch {}
        clearLogoutTimer();
        const now = Date.now();
        const expiresAt = now + 15000;
        const remaining = Math.max(0, expiresAt - now);
        logoutTimerRef.current = setTimeout(() => {
          logout();
        }, remaining);
        return { ok: true as const };
      }
    }
    return { ok: false as const, error: "Credenciais inválidas" };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    clearLogoutTimer();
    try { localStorage.removeItem(AUTH_KEY); } catch {}
    try { localStorage.removeItem(AUTH_EXPIRED_KEY); } catch {}
    try { localStorage.removeItem(AUTH_EXPIRES_AT); } catch {}
    try { setProblemUser(false); } catch {}
    try { setPerformanceUser(false); } catch {}
    try { setVisualUser(false); } catch {}
    try { router.push("/"); } catch {}
  }, [clearLogoutTimer, router]);

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
