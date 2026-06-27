/**
 * Tests for the in-memory mock data layer.
 *
 * Each test that mutates state (add/update/delete) runs in an isolated module
 * registry so the shared entries array is reset between suites.
 */

import {
  listWeeks,
  getWeek,
  getEntriesForWeek,
  addEntry,
  updateEntry,
  deleteEntry,
} from "@/lib/mock/timesheets";

// ─── Read-only queries ────────────────────────────────────────────────────────

describe("listWeeks", () => {
  it("returns exactly 12 seeded weeks", () => {
    expect(listWeeks()).toHaveLength(12);
  });

  it("returns weeks sorted from w1 to w12", () => {
    const ids = listWeeks().map((w) => w.id);
    expect(ids[0]).toBe("w1");
    expect(ids[11]).toBe("w12");
  });

  it("every week has a derived status", () => {
    for (const w of listWeeks()) {
      expect(["completed", "incomplete", "missing"]).toContain(w.status);
    }
  });

  it("every week has a non-zero weekNumber", () => {
    for (const w of listWeeks()) {
      expect(w.weekNumber).toBeGreaterThan(0);
    }
  });

  it("totalHours matches the sum of its entries", () => {
    const w1 = listWeeks().find((w) => w.id === "w1")!;
    const entries = getEntriesForWeek("w1");
    const sum = entries.reduce((acc, e) => acc + e.hours, 0);
    expect(w1.totalHours).toBe(sum);
  });
});

describe("getWeek", () => {
  it("returns the correct week for a valid id", () => {
    const week = getWeek("w3");
    expect(week).toBeDefined();
    expect(week!.id).toBe("w3");
    expect(week!.weekNumber).toBe(3);
  });

  it("returns undefined for an unknown id", () => {
    expect(getWeek("nonexistent")).toBeUndefined();
  });

  it("returns a week with a startDate before endDate", () => {
    const week = getWeek("w1")!;
    expect(week.startDate < week.endDate).toBe(true);
  });
});

describe("getEntriesForWeek", () => {
  it("returns entries only for the requested week", () => {
    const entries = getEntriesForWeek("w2");
    for (const e of entries) {
      expect(e.weekId).toBe("w2");
    }
  });

  it("returns an empty array for a week with 0 hours (w5)", () => {
    expect(getEntriesForWeek("w5")).toHaveLength(0);
  });

  it("returns entries sorted ascending by date", () => {
    const entries = getEntriesForWeek("w1");
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i].date >= entries[i - 1].date).toBe(true);
    }
  });
});

// ─── Mutations ────────────────────────────────────────────────────────────────

const NEW_ENTRY = {
  date: "2026-01-05",
  projectId: "p_1",
  workTypeId: "w_1",
  description: "Test task",
  hours: 4,
};

describe("addEntry", () => {
  it("returns an entry with a generated id", () => {
    const entry = addEntry("w5", NEW_ENTRY);
    expect(entry.id).toBeTruthy();
    expect(entry.weekId).toBe("w5");
    expect(entry.description).toBe("Test task");
  });

  it("resolves project and workType names from the ids", () => {
    const entry = addEntry("w5", NEW_ENTRY);
    expect(entry.projectName).toBeTruthy();
    expect(entry.workTypeLabel).toBeTruthy();
  });

  it("makes the new entry visible via getEntriesForWeek", () => {
    const before = getEntriesForWeek("w5").length;
    addEntry("w5", NEW_ENTRY);
    expect(getEntriesForWeek("w5").length).toBe(before + 1);
  });

  it("throws for an unknown projectId", () => {
    expect(() => addEntry("w5", { ...NEW_ENTRY, projectId: "p_unknown" })).toThrow();
  });

  it("throws for an unknown workTypeId", () => {
    expect(() => addEntry("w5", { ...NEW_ENTRY, workTypeId: "w_unknown" })).toThrow();
  });

  it("increments totalHours on the parent week", () => {
    const before = getWeek("w5")!.totalHours;
    addEntry("w5", { ...NEW_ENTRY, hours: 8 });
    expect(getWeek("w5")!.totalHours).toBe(before + 8);
  });
});

describe("updateEntry", () => {
  it("updates and returns the modified entry", () => {
    const entry = addEntry("w5", NEW_ENTRY);
    const updated = updateEntry(entry.id, { ...NEW_ENTRY, description: "Updated desc", hours: 6 });
    expect(updated).toBeDefined();
    expect(updated!.description).toBe("Updated desc");
    expect(updated!.hours).toBe(6);
  });

  it("returns undefined for an unknown id", () => {
    expect(updateEntry("nonexistent_id", NEW_ENTRY)).toBeUndefined();
  });

  it("reflects the update in subsequent reads", () => {
    const entry = addEntry("w5", NEW_ENTRY);
    updateEntry(entry.id, { ...NEW_ENTRY, hours: 8 });
    const found = getEntriesForWeek("w5").find((e) => e.id === entry.id);
    expect(found!.hours).toBe(8);
  });
});

describe("deleteEntry", () => {
  it("returns true and removes the entry", () => {
    const entry = addEntry("w5", NEW_ENTRY);
    const before = getEntriesForWeek("w5").length;
    expect(deleteEntry(entry.id)).toBe(true);
    expect(getEntriesForWeek("w5").length).toBe(before - 1);
  });

  it("returns false for an unknown id", () => {
    expect(deleteEntry("nonexistent_id")).toBe(false);
  });

  it("reduces totalHours on the parent week", () => {
    const entry = addEntry("w5", { ...NEW_ENTRY, hours: 8 });
    const before = getWeek("w5")!.totalHours;
    deleteEntry(entry.id);
    expect(getWeek("w5")!.totalHours).toBe(before - 8);
  });
});
