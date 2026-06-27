import { addDays, formatDayLabel, enumerateDays } from "@/utils/DatesFormatter";

// ─── addDays ────────────────────────────────────────────────────────────────

describe("addDays", () => {
  describe("with returnIso = true (default)", () => {
    it("adds a positive offset to an ISO date string", () => {
      expect(addDays("2026-01-01", 7)).toBe("2026-01-08");
    });

    it("crosses a month boundary correctly", () => {
      expect(addDays("2026-01-28", 5)).toBe("2026-02-02");
    });

    it("crosses a year boundary correctly", () => {
      expect(addDays("2025-12-30", 3)).toBe("2026-01-02");
    });

    it("returns the same date when offset is 0", () => {
      expect(addDays("2026-06-15", 0)).toBe("2026-06-15");
    });

    it("subtracts days when given a negative offset", () => {
      expect(addDays("2026-01-07", -7)).toBe("2025-12-31");
    });

    it("accepts a Date object as input", () => {
      const date = new Date("2026-03-01T00:00:00Z");
      expect(addDays(date, 3)).toBe("2026-03-04");
    });
  });

  describe("with returnIso = false", () => {
    it("returns a Date object", () => {
      const result = addDays("2026-01-01", 1, false);
      expect(result).toBeInstanceOf(Date);
    });

    it("returns the correct UTC date value", () => {
      const result = addDays("2026-01-01", 1, false) as Date;
      expect(result.toISOString().slice(0, 10)).toBe("2026-01-02");
    });
  });
});

// ─── formatDayLabel ──────────────────────────────────────────────────────────

describe("formatDayLabel", () => {
  it("formats January 1st correctly", () => {
    expect(formatDayLabel("2026-01-01")).toBe("Jan 1");
  });

  it("formats December 31st correctly", () => {
    expect(formatDayLabel("2026-12-31")).toBe("Dec 31");
  });

  it("strips leading zero from single-digit days", () => {
    expect(formatDayLabel("2026-03-05")).toBe("Mar 5");
  });

  it("formats a mid-year double-digit date correctly", () => {
    expect(formatDayLabel("2026-06-15")).toBe("Jun 15");
  });
});

// ─── enumerateDays ───────────────────────────────────────────────────────────

describe("enumerateDays", () => {
  it("returns a single-element array when start equals end", () => {
    expect(enumerateDays("2026-01-05", "2026-01-05")).toEqual(["2026-01-05"]);
  });

  it("returns every day in a 7-day range", () => {
    expect(enumerateDays("2026-01-05", "2026-01-11")).toEqual([
      "2026-01-05",
      "2026-01-06",
      "2026-01-07",
      "2026-01-08",
      "2026-01-09",
      "2026-01-10",
      "2026-01-11",
    ]);
  });

  it("spans a month boundary correctly", () => {
    expect(enumerateDays("2026-01-30", "2026-02-02")).toEqual([
      "2026-01-30",
      "2026-01-31",
      "2026-02-01",
      "2026-02-02",
    ]);
  });

  it("returns an empty array when end is before start", () => {
    expect(enumerateDays("2026-01-10", "2026-01-05")).toEqual([]);
  });
});
