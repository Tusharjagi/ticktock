import { apiFetch } from "./client";
import type { AuthResponse, User } from "../types";

/** POST /api/auth/login */
export function login(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/** GET /api/auth/me */
export function fetchMe(): Promise<{ user: User }> {
  return apiFetch<{ user: User }>("/api/auth/me");
}
