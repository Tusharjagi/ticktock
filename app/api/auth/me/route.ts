import { apiError, json, requireAuth } from "@/lib/server-helpers";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

/** GET /api/auth/me — return the current user for a valid token. */
export async function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) return apiError(TEXT.api.unauthorized, 401);
  return json({ user });
}
