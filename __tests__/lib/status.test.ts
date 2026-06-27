import { deriveStatus, actionForStatus, STATUS_META } from "@/lib/status";
import { WEEKLY_TARGET_HOURS } from "@/lib/types";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

// ─── deriveStatus ────────────────────────────────────────────────────────────

describe("deriveStatus", () => {
  describe("missing — zero or negative hours", () => {
    it("returns 'missing' for exactly 0 hours", () => {
      expect(deriveStatus(0)).toBe("missing");
    });

    it("returns 'missing' for negative hours", () => {
      expect(deriveStatus(-5)).toBe("missing");
    });
  });

  describe("incomplete — 1 to 39 hours", () => {
    it("returns 'incomplete' for 1 hour (minimum logged)", () => {
      expect(deriveStatus(1)).toBe("incomplete");
    });

    it("returns 'incomplete' for a midpoint value", () => {
      expect(deriveStatus(20)).toBe("incomplete");
    });

    it("returns 'incomplete' for 39 hours (one below the weekly target)", () => {
      expect(deriveStatus(WEEKLY_TARGET_HOURS - 1)).toBe("incomplete");
    });
  });

  describe("completed — at or above the weekly target", () => {
    it("returns 'completed' at exactly the weekly target (40 hrs)", () => {
      expect(deriveStatus(WEEKLY_TARGET_HOURS)).toBe("completed");
    });

    it("returns 'completed' for hours above the target", () => {
      expect(deriveStatus(50)).toBe("completed");
    });
  });
});

// ─── STATUS_META ─────────────────────────────────────────────────────────────

describe("STATUS_META", () => {
  it("has an entry for every TimesheetStatus", () => {
    expect(STATUS_META).toHaveProperty("completed");
    expect(STATUS_META).toHaveProperty("incomplete");
    expect(STATUS_META).toHaveProperty("missing");
  });

  it("maps status labels to the correct TEXT constants", () => {
    expect(STATUS_META.completed.label).toBe(TEXT.status.completed);
    expect(STATUS_META.incomplete.label).toBe(TEXT.status.incomplete);
    expect(STATUS_META.missing.label).toBe(TEXT.status.missing);
  });

  it("provides a non-empty className for every status", () => {
    for (const meta of Object.values(STATUS_META)) {
      expect(meta.className.length).toBeGreaterThan(0);
    }
  });
});

// ─── actionForStatus ─────────────────────────────────────────────────────────

describe("actionForStatus", () => {
  it("returns the 'View' action for completed timesheets", () => {
    expect(actionForStatus("completed")).toBe(TEXT.actions.view);
  });

  it("returns the 'Update' action for incomplete timesheets", () => {
    expect(actionForStatus("incomplete")).toBe(TEXT.actions.update);
  });

  it("returns the 'Create' action for missing timesheets", () => {
    expect(actionForStatus("missing")).toBe(TEXT.actions.create);
  });
});
