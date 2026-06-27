import { deriveStatus, actionForStatus } from "@/lib/status";

describe("deriveStatus", () => {
  it("returns 'missing' for 0 hours", () => {
    expect(deriveStatus(0)).toBe("missing");
  });

  it("returns 'missing' for negative hours", () => {
    expect(deriveStatus(-1)).toBe("missing");
  });

  it("returns 'incomplete' for hours between 1 and 39", () => {
    expect(deriveStatus(1)).toBe("incomplete");
    expect(deriveStatus(20)).toBe("incomplete");
    expect(deriveStatus(39)).toBe("incomplete");
  });

  it("returns 'completed' for exactly 40 hours", () => {
    expect(deriveStatus(40)).toBe("completed");
  });

  it("returns 'completed' for more than 40 hours", () => {
    expect(deriveStatus(41)).toBe("completed");
    expect(deriveStatus(80)).toBe("completed");
  });
});

describe("actionForStatus", () => {
  it("returns view label for completed", () => {
    expect(actionForStatus("completed")).toBeTruthy();
    expect(typeof actionForStatus("completed")).toBe("string");
  });

  it("returns a different label for incomplete vs completed", () => {
    expect(actionForStatus("incomplete")).not.toBe(actionForStatus("completed"));
  });

  it("returns a different label for missing vs incomplete", () => {
    expect(actionForStatus("missing")).not.toBe(actionForStatus("incomplete"));
  });

  it("returns a string for every valid status", () => {
    const statuses = ["completed", "incomplete", "missing"] as const;
    for (const s of statuses) {
      expect(typeof actionForStatus(s)).toBe("string");
      expect(actionForStatus(s).length).toBeGreaterThan(0);
    }
  });
});
