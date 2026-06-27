import { User } from "@/services/api/types";
import { EntryInput } from "./types";
import { TEXT } from "@/constants/TEXT_CONSTANTS";
import { MOCK_USERS } from "./mock/constants";

export function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

export function apiError(message: string, status = 400): Response {
  return Response.json({ error: message }, { status });
}

export function delay(ms = 120): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const TOKEN_PREFIX = "mock.";

export function makeToken(userId: string): string {
  return `${TOKEN_PREFIX}${userId}`;
}

function userFromToken(token: string | null): User | null {
  if (!token || !token.startsWith(TOKEN_PREFIX)) return null;
  const id = token.slice(TOKEN_PREFIX.length);
  const match = MOCK_USERS.find((u) => u.id === id);
  if (!match) return null;
  return {
    id: match.id,
    name: match.name,
    email: match.email,
    initials: match.initials,
  };
}

export function requireAuth(request: Request): User | null {
  const header = request.headers.get("authorization") ?? "";
  const token = header.toLowerCase().startsWith("bearer ")
    ? header.slice(7).trim()
    : null;
  return userFromToken(token);
}

type ValidationResult =
  | { ok: true; value: EntryInput }
  | { ok: false; error: string };

export function validateEntryInput(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: TEXT.api.bodyMustBeObject };
  }
  const b = body as Record<string, unknown>;

  const date = b.date;
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: TEXT.api.dateRequired };
  }
  if (typeof b.projectId !== "string" || b.projectId.length === 0) {
    return { ok: false, error: TEXT.api.projectRequired };
  }
  if (typeof b.workTypeId !== "string" || b.workTypeId.length === 0) {
    return { ok: false, error: TEXT.api.workTypeRequired };
  }
  if (typeof b.description !== "string" || b.description.trim().length === 0) {
    return { ok: false, error: TEXT.api.descriptionRequired };
  }
  const hours = Number(b.hours);
  if (!Number.isFinite(hours) || hours <= 0 || hours > 24) {
    return { ok: false, error: TEXT.api.hoursRange };
  }

  return {
    ok: true,
    value: {
      date,
      projectId: b.projectId,
      workTypeId: b.workTypeId,
      description: b.description.trim(),
      hours,
    },
  };
}
