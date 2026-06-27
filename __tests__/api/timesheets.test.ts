/**
 * @jest-environment node
 *
 * Integration tests for GET /api/timesheets.
 * Route handlers are called directly — no HTTP server needed.
 */

// Skip the artificial delay so tests run fast.
jest.mock("@/lib/server-helpers", () => ({
  ...jest.requireActual("@/lib/server-helpers"),
  delay: () => Promise.resolve(),
}));

import { GET } from "@/app/api/timesheets/route";

const AUTH = "Bearer mock.u_1";

function makeRequest(search = ""): Request {
  return new Request(`http://localhost/api/timesheets${search}`, {
    headers: { Authorization: AUTH },
  });
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe("GET /api/timesheets — auth", () => {
  it("returns 401 with no Authorization header", async () => {
    const req = new Request("http://localhost/api/timesheets");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 401 for an invalid token", async () => {
    const req = new Request("http://localhost/api/timesheets", {
      headers: { Authorization: "Bearer bad_token" },
    });
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 200 with a valid token", async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
  });
});

// ─── Pagination ───────────────────────────────────────────────────────────────

describe("GET /api/timesheets — pagination", () => {
  it("returns the default page size (5) when no perPage is given", async () => {
    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.perPage).toBe(5);
    expect(body.data.length).toBeLessThanOrEqual(5);
  });

  it("respects a custom perPage value", async () => {
    const res = await GET(makeRequest("?perPage=3"));
    const body = await res.json();
    expect(body.perPage).toBe(3);
    expect(body.data.length).toBeLessThanOrEqual(3);
  });

  it("returns page 1 by default", async () => {
    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.page).toBe(1);
  });

  it("returns the correct slice on page 2", async () => {
    const page1 = await (await GET(makeRequest("?perPage=3&page=1"))).json();
    const page2 = await (await GET(makeRequest("?perPage=3&page=2"))).json();
    // Items on page 2 should not overlap with page 1.
    const ids1 = new Set(page1.data.map((w: { id: string }) => w.id));
    for (const w of page2.data) {
      expect(ids1.has(w.id)).toBe(false);
    }
  });

  it("reports correct totalPages", async () => {
    const res = await GET(makeRequest("?perPage=4"));
    const body = await res.json();
    expect(body.totalPages).toBe(Math.ceil(body.total / 4));
  });

  it("clamps perPage=0 to the minimum (1)", async () => {
    // 0 is a valid number so the fallback (5) is NOT used — it clamps to min=1.
    const res = await GET(makeRequest("?perPage=0"));
    const body = await res.json();
    expect(body.perPage).toBe(1);
  });

  it("uses the fallback perPage (5) when the param is absent", async () => {
    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.perPage).toBe(5);
  });

  it("clamps page beyond totalPages to the last page", async () => {
    const res = await GET(makeRequest("?page=9999&perPage=5"));
    const body = await res.json();
    expect(body.page).toBe(body.totalPages);
  });
});

// ─── Status filter ────────────────────────────────────────────────────────────

describe("GET /api/timesheets — status filter", () => {
  it("returns only completed weeks when status=completed", async () => {
    const res = await GET(makeRequest("?status=completed&perPage=100"));
    const body = await res.json();
    for (const w of body.data) {
      expect(w.status).toBe("completed");
    }
  });

  it("returns only missing weeks when status=missing", async () => {
    const res = await GET(makeRequest("?status=missing&perPage=100"));
    const body = await res.json();
    for (const w of body.data) {
      expect(w.status).toBe("missing");
    }
  });

  it("ignores an invalid status value and returns all weeks", async () => {
    const all = await (await GET(makeRequest("?perPage=100"))).json();
    const bad = await (await GET(makeRequest("?status=invalid&perPage=100"))).json();
    expect(bad.total).toBe(all.total);
  });
});

// ─── Date-range filter ────────────────────────────────────────────────────────

describe("GET /api/timesheets — date-range filter", () => {
  it("returns only January weeks when filtered to January 2026", async () => {
    const res = await GET(makeRequest("?from=2026-01-01&to=2026-01-31&perPage=100"));
    const body = await res.json();
    expect(body.total).toBeGreaterThan(0);
    for (const w of body.data) {
      // Every returned week must overlap [2026-01-01, 2026-01-31]
      expect(w.endDate >= "2026-01-01").toBe(true);
      expect(w.startDate <= "2026-01-31").toBe(true);
    }
  });

  it("returns fewer results with a tighter range than all-time", async () => {
    const all = await (await GET(makeRequest("?perPage=100"))).json();
    const jan = await (await GET(makeRequest("?from=2026-01-01&to=2026-01-31&perPage=100"))).json();
    expect(jan.total).toBeLessThan(all.total);
  });

  it("returns 0 results for a range with no weeks", async () => {
    const res = await GET(makeRequest("?from=2025-01-01&to=2025-12-31"));
    const body = await res.json();
    expect(body.total).toBe(0);
  });

  it("a `from`-only filter excludes weeks that ended before that date", async () => {
    const res = await GET(makeRequest("?from=2026-03-01&perPage=100"));
    const body = await res.json();
    for (const w of body.data) {
      expect(w.endDate >= "2026-03-01").toBe(true);
    }
  });
});
