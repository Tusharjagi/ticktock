import { TEXT } from "@/constants/TEXT_CONSTANTS";
import { User } from "./types";

const TOKEN_KEY = "ticktock.token";
const USER_KEY = "ticktock.user";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function storeSession(token: string, user: User): void {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(path, { ...options, headers });

  const isJson = res.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = isJson ? await res.json() : null;

  if (!res.ok) {
    const message =
      (payload && typeof payload.error === "string" && payload.error) ||
      TEXT.api.requestFailed(res.status);
    throw new ApiError(message, res.status);
  }

  return payload as T;
}
