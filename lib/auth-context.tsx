"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { User } from "./types";
import { login as loginRequest } from "./api/auth";
import {
  clearSession,
  getStoredUser,
  getToken,
  storeSession,
} from "./api/client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  /** True until the session has been read from storage on the client. */
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Module-level subscription so login/logout re-render every consumer.
const sessionListeners = new Set<() => void>();

function notifySessionChange(): void {
  for (const listener of sessionListeners) listener();
}

function subscribeSession(listener: () => void): () => void {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

// Cache the snapshot so it stays referentially stable between renders
// (useSyncExternalStore requires getSnapshot to return a stable value).
let cachedKey: string | null = null;
let cachedUser: User | null = null;

function getUserSnapshot(): User | null {
  const token = getToken();
  const user = token ? getStoredUser() : null;
  const key = user ? `${token}:${user.id}` : null;
  if (key !== cachedKey) {
    cachedKey = key;
    cachedUser = user;
  }
  return cachedUser;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Server + first client render see `null` / not-hydrated, matching the SSR
  // HTML; React then re-reads the real values after hydration — no mismatch.
  const user = useSyncExternalStore(subscribeSession, getUserSnapshot, () => null);
  const hydrated = useSyncExternalStore(
    subscribeSession,
    () => true,
    () => false,
  );

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: authedUser } = await loginRequest(email, password);
    storeSession(token, authedUser);
    notifySessionChange();
  }, []);

  const logout = useCallback(() => {
    clearSession();
    notifySessionChange();
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

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
