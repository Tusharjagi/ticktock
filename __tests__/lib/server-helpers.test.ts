/**
 * @jest-environment node
 */
import { validateEntryInput, requireAuth } from "@/lib/server-helpers";

// ─── validateEntryInput ───────────────────────────────────────────────────────

const VALID_INPUT = {
  date: "2026-01-05",
  projectId: "p_1",
  workTypeId: "w_1",
  description: "Homepage Development",
  hours: 4,
};

describe("validateEntryInput", () => {
  it("accepts a fully valid input", () => {
    const result = validateEntryInput(VALID_INPUT);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.description).toBe("Homepage Development");
      expect(result.value.hours).toBe(4);
    }
  });

  it("trims whitespace from description", () => {
    const result = validateEntryInput({ ...VALID_INPUT, description: "  trimmed  " });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.description).toBe("trimmed");
  });

  it("rejects null", () => {
    expect(validateEntryInput(null).ok).toBe(false);
  });

  it("rejects a non-object primitive", () => {
    expect(validateEntryInput("string").ok).toBe(false);
    expect(validateEntryInput(42).ok).toBe(false);
  });

  it("rejects a missing date", () => {
    const { date: _, ...rest } = VALID_INPUT;
    expect(validateEntryInput(rest).ok).toBe(false);
  });

  it("rejects an invalid date format", () => {
    expect(validateEntryInput({ ...VALID_INPUT, date: "01-05-2026" }).ok).toBe(false);
    expect(validateEntryInput({ ...VALID_INPUT, date: "2026/01/05" }).ok).toBe(false);
  });

  it("rejects a blank description", () => {
    expect(validateEntryInput({ ...VALID_INPUT, description: "   " }).ok).toBe(false);
    expect(validateEntryInput({ ...VALID_INPUT, description: "" }).ok).toBe(false);
  });

  it("rejects hours of 0", () => {
    expect(validateEntryInput({ ...VALID_INPUT, hours: 0 }).ok).toBe(false);
  });

  it("rejects negative hours", () => {
    expect(validateEntryInput({ ...VALID_INPUT, hours: -1 }).ok).toBe(false);
  });

  it("rejects hours greater than 24", () => {
    expect(validateEntryInput({ ...VALID_INPUT, hours: 25 }).ok).toBe(false);
  });

  it("accepts exactly 24 hours", () => {
    expect(validateEntryInput({ ...VALID_INPUT, hours: 24 }).ok).toBe(true);
  });

  it("accepts exactly 1 hour", () => {
    expect(validateEntryInput({ ...VALID_INPUT, hours: 1 }).ok).toBe(true);
  });

  it("rejects a missing projectId", () => {
    const { projectId: _, ...rest } = VALID_INPUT;
    expect(validateEntryInput(rest).ok).toBe(false);
  });

  it("rejects an empty projectId string", () => {
    expect(validateEntryInput({ ...VALID_INPUT, projectId: "" }).ok).toBe(false);
  });

  it("rejects a missing workTypeId", () => {
    const { workTypeId: _, ...rest } = VALID_INPUT;
    expect(validateEntryInput(rest).ok).toBe(false);
  });
});

// ─── requireAuth ─────────────────────────────────────────────────────────────

function makeRequest(authHeader?: string): Request {
  return new Request("http://localhost/api/test", {
    headers: authHeader ? { Authorization: authHeader } : {},
  });
}

describe("requireAuth", () => {
  it("returns a User when the token is valid", () => {
    const user = requireAuth(makeRequest("Bearer mock.u_1"));
    expect(user).not.toBeNull();
    expect(user?.id).toBe("u_1");
  });

  it("is case-insensitive for the Bearer prefix", () => {
    const user = requireAuth(makeRequest("bearer mock.u_1"));
    expect(user).not.toBeNull();
  });

  it("returns null when no Authorization header is present", () => {
    expect(requireAuth(makeRequest())).toBeNull();
  });

  it("returns null for a token that doesn't match any user", () => {
    expect(requireAuth(makeRequest("Bearer mock.nonexistent"))).toBeNull();
  });

  it("returns null for a token missing the mock. prefix", () => {
    expect(requireAuth(makeRequest("Bearer u_1"))).toBeNull();
  });

  it("returns null for an empty Authorization header", () => {
    expect(requireAuth(makeRequest(""))).toBeNull();
  });
});
