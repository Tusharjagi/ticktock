import { apiError, json, requireAuth } from "@/lib/server-helpers";
import { PROJECTS, WORK_TYPES } from "@/lib/mock/projects";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

/** GET /api/projects — dropdown options for the Add/Edit entry modal. */
export async function GET(request: Request) {
  if (!requireAuth(request)) return apiError(TEXT.api.unauthorized, 401);
  return json({ projects: PROJECTS, workTypes: WORK_TYPES });
}
