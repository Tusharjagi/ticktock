"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { AuthContext } from "./AuthContext";
import {
  getUserSnapshot,
  loginSession,
  logoutSession,
  subscribeSession,
} from "./authStore";
import { login as loginRequest } from "@/services/api/auth";
import { AuthState } from "@/lib/types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(
    subscribeSession,
    getUserSnapshot,
    () => null,
  );

  const hydrated = useSyncExternalStore(
    subscribeSession,
    () => true,
    () => false,
  );

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await loginRequest(email, password);
    loginSession(token, user);
  }, []);

  const logout = useCallback(() => {
    logoutSession();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading: !hydrated,
      login,
      logout,
    }),
    [user, hydrated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
