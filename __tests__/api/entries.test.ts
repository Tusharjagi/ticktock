/**
 * @jest-environment node
 *
 * Integration tests for the entries API endpoints:
 *   POST   /api/timesheets/:weekId/entries
 *   PATCH  /api/entries/:id
 *   DELETE /api/entries/:id
 */

jest.mock("@/lib/server-helpers", () => ({
  ...jest.requireActual("@/lib/server-helpers"),
  delay: () => Promise.resolve(),
}));

import { GET, POST } from "@/app/api/timesheets/[weekId]/entries/route";
import { PATCH, DELETE } from "@/app/api/entries/[id]/route";

const AUTH = "Bearer mock.u_1";
const WEEK_CTX = (weekId: string) => ({ params: Promise.resolve({ weekId }) });
const ID_CTX = (id: string) => ({ params: Promise.resolve({ id }) });

const VALID_ENTRY = {
  date: "2026-01-05",
  projectId: "p_1",
  workTypeId: "w_1",
  description: "Test task",
  hours: 4,
};

function postRequest(weekId: string, body: unknown): Request {
  return new Request(`http://localhost/api/timesheets/${weekId}/entries`, {
    method: "POST",
    headers: { Authorization: AUTH, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─── GET /api/timesheets/:weekId/entries ──────────────────────────────────────

describe("GET /api/timesheets/:weekId/entries", () => {
  it("returns 401 without auth", async () => {
    const req = new Request("http://localhost/api/timesheets/w1/entries");
    const res = await GET(req, WEEK_CTX("w1"));
    expect(res.status).toBe(401);
  });

  it("returns 404 for an unknown weekId", async () => {
    const req = new Request("http://localhost/api/timesheets/nonexistent/entries", {
      headers: { Authorization: AUTH },
    });
    const res = await GET(req, WEEK_CTX("nonexistent"));
    expect(res.status).toBe(404);
  });

  it("returns week + entries for a valid weekId", async () => {
    const req = new Request("http://localhost/api/timesheets/w1/entries", {
      headers: { Authorization: AUTH },
    });
    const res = await GET(req, WEEK_CTX("w1"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.week).toBeDefined();
    expect(Array.isArray(body.entries)).toBe(true);
  });

  it("returns entries only for the requested week", async () => {
    const req = new Request("http://localhost/api/timesheets/w2/entries", {
      headers: { Authorization: AUTH },
    });
    const res = await GET(req, WEEK_CTX("w2"));
    const body = await res.json();
    for (const e of body.entries) {
      expect(e.weekId).toBe("w2");
    }
  });
});

// ─── POST /api/timesheets/:weekId/entries ─────────────────────────────────────

describe("POST /api/timesheets/:weekId/entries", () => {
  it("returns 401 without auth", async () => {
    const req = new Request("http://localhost/api/timesheets/w5/entries", {
      method: "POST",
      body: JSON.stringify(VALID_ENTRY),
    });
    const res = await POST(req, WEEK_CTX("w5"));
    expect(res.status).toBe(401);
  });

  it("returns 404 for an unknown weekId", async () => {
    const res = await POST(postRequest("unknown", VALID_ENTRY), WEEK_CTX("unknown"));
    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("http://localhost/api/timesheets/w5/entries", {
      method: "POST",
      headers: { Authorization: AUTH, "Content-Type": "application/json" },
      body: "not json {{{",
    });
    const res = await POST(req, WEEK_CTX("w5"));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid entry data (missing description)", async () => {
    const res = await POST(
      postRequest("w5", { ...VALID_ENTRY, description: "" }),
      WEEK_CTX("w5"),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for hours > 24", async () => {
    const res = await POST(postRequest("w5", { ...VALID_ENTRY, hours: 25 }), WEEK_CTX("w5"));
    expect(res.status).toBe(400);
  });

  it("creates an entry and returns 201 with the new entry", async () => {
    const res = await POST(postRequest("w5", VALID_ENTRY), WEEK_CTX("w5"));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.entry).toBeDefined();
    expect(body.entry.weekId).toBe("w5");
    expect(body.entry.description).toBe("Test task");
  });

  it("new entry is retrievable via GET afterwards", async () => {
    const postRes = await POST(postRequest("w5", VALID_ENTRY), WEEK_CTX("w5"));
    const { entry } = await postRes.json();

    const getReq = new Request("http://localhost/api/timesheets/w5/entries", {
      headers: { Authorization: AUTH },
    });
    const getRes = await GET(getReq, WEEK_CTX("w5"));
    const { entries } = await getRes.json();
    expect(entries.some((e: { id: string }) => e.id === entry.id)).toBe(true);
  });
});

// ─── PATCH /api/entries/:id ───────────────────────────────────────────────────

describe("PATCH /api/entries/:id", () => {
  async function createEntry() {
    const res = await POST(postRequest("w5", VALID_ENTRY), WEEK_CTX("w5"));
    const body = await res.json();
    return body.entry as { id: string };
  }

  it("returns 401 without auth", async () => {
    const req = new Request("http://localhost/api/entries/some_id", {
      method: "PATCH",
      body: JSON.stringify(VALID_ENTRY),
    });
    const res = await PATCH(req, ID_CTX("some_id"));
    expect(res.status).toBe(401);
  });

  it("returns 404 for a nonexistent entry id", async () => {
    const req = new Request("http://localhost/api/entries/no_such_id", {
      method: "PATCH",
      headers: { Authorization: AUTH, "Content-Type": "application/json" },
      body: JSON.stringify(VALID_ENTRY),
    });
    const res = await PATCH(req, ID_CTX("no_such_id"));
    expect(res.status).toBe(404);
  });

  it("updates and returns the modified entry", async () => {
    const { id } = await createEntry();
    const req = new Request(`http://localhost/api/entries/${id}`, {
      method: "PATCH",
      headers: { Authorization: AUTH, "Content-Type": "application/json" },
      body: JSON.stringify({ ...VALID_ENTRY, description: "Updated desc", hours: 6 }),
    });
    const res = await PATCH(req, ID_CTX(id));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.entry.description).toBe("Updated desc");
    expect(body.entry.hours).toBe(6);
  });
});

// ─── DELETE /api/entries/:id ──────────────────────────────────────────────────

describe("DELETE /api/entries/:id", () => {
  async function createEntry() {
    const res = await POST(postRequest("w5", VALID_ENTRY), WEEK_CTX("w5"));
    const body = await res.json();
    return body.entry as { id: string };
  }

  it("returns 401 without auth", async () => {
    const req = new Request("http://localhost/api/entries/some_id", { method: "DELETE" });
    const res = await DELETE(req, ID_CTX("some_id"));
    expect(res.status).toBe(401);
  });

  it("returns 404 for a nonexistent entry id", async () => {
    const req = new Request("http://localhost/api/entries/no_such_id", {
      method: "DELETE",
      headers: { Authorization: AUTH },
    });
    const res = await DELETE(req, ID_CTX("no_such_id"));
    expect(res.status).toBe(404);
  });

  it("deletes the entry and returns { ok: true }", async () => {
    const { id } = await createEntry();
    const req = new Request(`http://localhost/api/entries/${id}`, {
      method: "DELETE",
      headers: { Authorization: AUTH },
    });
    const res = await DELETE(req, ID_CTX(id));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it("entry is no longer visible after deletion", async () => {
    const { id } = await createEntry();
    const deleteReq = new Request(`http://localhost/api/entries/${id}`, {
      method: "DELETE",
      headers: { Authorization: AUTH },
    });
    await DELETE(deleteReq, ID_CTX(id));

    const getReq = new Request("http://localhost/api/timesheets/w5/entries", {
      headers: { Authorization: AUTH },
    });
    const getRes = await GET(getReq, WEEK_CTX("w5"));
    const { entries } = await getRes.json();
    expect(entries.some((e: { id: string }) => e.id === id)).toBe(false);
  });
});
