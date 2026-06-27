import {
  apiError,
  delay,
  json,
  requireAuth,
  validateEntryInput,
} from "@/lib/server-helpers";
import {
  addEntry,
  getEntriesForWeek,
  getWeek,
} from "@/lib/mock/timesheets";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

type Ctx = { params: Promise<{ weekId: string }> };

/** GET /api/timesheets/:weekId/entries — week summary + its entries. */
export async function GET(request: Request, { params }: Ctx) {
  if (!requireAuth(request)) return apiError(TEXT.api.unauthorized, 401);
  await delay();

  const { weekId } = await params;
  const week = getWeek(weekId);
  if (!week) return apiError(TEXT.api.timesheetNotFound, 404);

  return json({ week, entries: getEntriesForWeek(weekId) });
}

/** POST /api/timesheets/:weekId/entries — create a new entry in the week. */
export async function POST(request: Request, { params }: Ctx) {
  if (!requireAuth(request)) return apiError(TEXT.api.unauthorized, 401);
  await delay();

  const { weekId } = await params;
  if (!getWeek(weekId)) return apiError(TEXT.api.timesheetNotFound, 404);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError(TEXT.api.invalidBody, 400);
  }

  const result = validateEntryInput(body);
  if (!result.ok) return apiError(result.error, 400);

  try {
    const entry = addEntry(weekId, result.value);
    return json({ entry }, 201);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : TEXT.api.couldNotAddEntry, 400);
  }
}
