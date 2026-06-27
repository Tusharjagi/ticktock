import { formatDayLabel, addDaysIso, enumerateDays } from "@/lib/date";

describe("formatDayLabel", () => {
  it("formats a January date", () => {
    expect(formatDayLabel("2026-01-05")).toBe("Jan 5");
  });

  it("formats a December date", () => {
    expect(formatDayLabel("2026-12-31")).toBe("Dec 31");
  });

  it("formats all 12 months correctly", () => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    months.forEach((m, i) => {
      const mm = String(i + 1).padStart(2, "0");
      expect(formatDayLabel(`2026-${mm}-15`)).toBe(`${m} 15`);
    });
  });

  it("strips leading zero from day", () => {
    expect(formatDayLabel("2026-03-03")).toBe("Mar 3");
  });
});

describe("addDaysIso", () => {
  it("adds days within the same month", () => {
    expect(addDaysIso("2026-01-05", 4)).toBe("2026-01-09");
  });

  it("rolls over to the next month", () => {
    expect(addDaysIso("2026-01-31", 1)).toBe("2026-02-01");
  });

  it("rolls over to the next year", () => {
    expect(addDaysIso("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("adding 0 days returns the same date", () => {
    expect(addDaysIso("2026-06-15", 0)).toBe("2026-06-15");
  });

  it("handles February non-leap year correctly", () => {
    // 2026 is not a leap year
    expect(addDaysIso("2026-02-28", 1)).toBe("2026-03-01");
  });

  it("handles February leap year correctly", () => {
    // 2028 is a leap year
    expect(addDaysIso("2028-02-28", 1)).toBe("2028-02-29");
  });
});

describe("enumerateDays", () => {
  it("returns a single day when start equals end", () => {
    expect(enumerateDays("2026-01-05", "2026-01-05")).toEqual(["2026-01-05"]);
  });

  it("returns all 5 days of a Mon–Fri work week", () => {
    expect(enumerateDays("2026-01-05", "2026-01-09")).toEqual([
      "2026-01-05",
      "2026-01-06",
      "2026-01-07",
      "2026-01-08",
      "2026-01-09",
    ]);
  });

  it("returns the correct count of days", () => {
    const days = enumerateDays("2026-01-01", "2026-01-31");
    expect(days).toHaveLength(31);
  });

  it("first element is start, last is end", () => {
    const days = enumerateDays("2026-03-02", "2026-03-06");
    expect(days[0]).toBe("2026-03-02");
    expect(days[days.length - 1]).toBe("2026-03-06");
  });

  it("returns empty array when end is before start", () => {
    expect(enumerateDays("2026-01-10", "2026-01-05")).toEqual([]);
  });
});
