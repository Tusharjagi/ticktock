import { apiError, delay, json, makeToken } from "@/lib/server-helpers";
import { findUserByCredentials } from "@/lib/mock/users";
import { TEXT } from "@/constants/TEXT_CONSTANTS";
import { AuthResponse } from "@/services/api/types";

/** POST /api/auth/login — validate credentials, return a mock token + user. */
export async function POST(request: Request) {
  await delay();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError(TEXT.api.invalidBody, 400);
  }

  const { email, password } = (body ?? {}) as {
    email?: unknown;
    password?: unknown;
  };

  if (typeof email !== "string" || typeof password !== "string") {
    return apiError(TEXT.api.emailPasswordRequired, 400);
  }

  const user = findUserByCredentials(email, password);
  if (!user) {
    return apiError(TEXT.api.invalidCredentials, 401);
  }

  const payload: AuthResponse = { token: makeToken(user.id), user };
  return json(payload);
}
