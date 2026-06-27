import {
  apiError,
  delay,
  json,
  requireAuth,
  validateEntryInput,
} from "@/lib/server-helpers";
import { deleteEntry, updateEntry } from "@/lib/mock/timesheets";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

type Ctx = { params: Promise<{ id: string }> };

/** PATCH /api/entries/:id — update an existing entry. */
export async function PATCH(request: Request, { params }: Ctx) {
  if (!requireAuth(request)) return apiError(TEXT.api.unauthorized, 401);
  await delay();

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError(TEXT.api.invalidBody, 400);
  }

  const result = validateEntryInput(body);
  if (!result.ok) return apiError(result.error, 400);

  try {
    const entry = updateEntry(id, result.value);
    if (!entry) return apiError(TEXT.api.entryNotFound, 404);
    return json({ entry });
  } catch (err) {
    return apiError(err instanceof Error ? err.message : TEXT.api.couldNotUpdateEntry, 400);
  }
}

/** DELETE /api/entries/:id — remove an entry. */
export async function DELETE(request: Request, { params }: Ctx) {
  if (!requireAuth(request)) return apiError(TEXT.api.unauthorized, 401);
  await delay();

  const { id } = await params;
  const removed = deleteEntry(id);
  if (!removed) return apiError(TEXT.api.entryNotFound, 404);
  return json({ ok: true });
}
