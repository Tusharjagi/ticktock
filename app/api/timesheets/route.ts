import { apiError, delay, json, requireAuth } from "@/lib/server-helpers";
import { listWeeks } from "@/lib/mock/timesheets";
import { TEXT } from "@/constants/TEXT_CONSTANTS";
import type { Paginated, TimesheetStatus, WeeklyTimesheet } from "@/lib/types";

const VALID_STATUSES: TimesheetStatus[] = [
  "completed",
  "incomplete",
  "missing",
];

/**
 * GET /api/timesheets — paginated weekly timesheets with optional filters.
 *
 */
export async function GET(request: Request) {
  if (!requireAuth(request)) return apiError(TEXT.api.unauthorized, 401);
  await delay();

  const { searchParams } = new URL(request.url);

  let weeks = listWeeks();

  const status = searchParams.get("status");
  if (status && VALID_STATUSES.includes(status as TimesheetStatus)) {
    weeks = weeks.filter((w) => w.status === status);
  }

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (from) weeks = weeks.filter((w) => w.endDate >= from);
  if (to) weeks = weeks.filter((w) => w.startDate <= to);

  const total = weeks.length;
  const perPage = clampInt(searchParams.get("perPage"), 5, 1, 100);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = clampInt(searchParams.get("page"), 1, 1, totalPages);
  const start = (page - 1) * perPage;
  const data = weeks.slice(start, start + perPage);

  const body: Paginated<WeeklyTimesheet> = {
    data,
    page,
    perPage,
    total,
    totalPages,
  };
  return json(body);
}

function clampInt(
  raw: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  if (raw === null || raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}
