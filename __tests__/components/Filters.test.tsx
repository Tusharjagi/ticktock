import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Filters } from "@/components/timesheets/Filters";

function renderFilters(overrides?: Partial<Parameters<typeof Filters>[0]>) {
  const defaults = {
    rangeId: "all",
    status: "all" as const,
    onRangeChange: jest.fn(),
    onStatusChange: jest.fn(),
  };
  return { ...render(<Filters {...defaults} {...overrides} />), ...defaults, ...overrides };
}

describe("Filters — rendering", () => {
  it("renders a date range select", () => {
    renderFilters();
    expect(screen.getByRole("combobox", { name: /date range/i })).toBeInTheDocument();
  });

  it("renders a status select", () => {
    renderFilters();
    expect(screen.getByRole("combobox", { name: /status/i })).toBeInTheDocument();
  });

  it("selects the current rangeId", () => {
    renderFilters({ rangeId: "jan" });
    const select = screen.getByRole("combobox", { name: /date range/i }) as HTMLSelectElement;
    expect(select.value).toBe("jan");
  });

  it("selects the current status", () => {
    renderFilters({ status: "completed" });
    const select = screen.getByRole("combobox", { name: /status/i }) as HTMLSelectElement;
    expect(select.value).toBe("completed");
  });

  it("shows all date range options", () => {
    renderFilters();
    const select = screen.getByRole("combobox", { name: /date range/i });
    const options = Array.from(select.querySelectorAll("option")).map((o) => o.value);
    expect(options).toContain("all");
    expect(options).toContain("jan");
    expect(options).toContain("feb");
    expect(options).toContain("mar");
    expect(options).toContain("q1");
  });

  it("shows all status options", () => {
    renderFilters();
    const select = screen.getByRole("combobox", { name: /status/i });
    const options = Array.from(select.querySelectorAll("option")).map((o) => o.value);
    expect(options).toContain("all");
    expect(options).toContain("completed");
    expect(options).toContain("incomplete");
    expect(options).toContain("missing");
  });
});

describe("Filters — interactions", () => {
  it("calls onRangeChange with the selected value", async () => {
    const user = userEvent.setup();
    const onRangeChange = jest.fn();
    renderFilters({ onRangeChange });
    await user.selectOptions(screen.getByRole("combobox", { name: /date range/i }), "jan");
    expect(onRangeChange).toHaveBeenCalledWith("jan");
  });

  it("calls onStatusChange with the selected value", async () => {
    const user = userEvent.setup();
    const onStatusChange = jest.fn();
    renderFilters({ onStatusChange });
    await user.selectOptions(screen.getByRole("combobox", { name: /status/i }), "completed");
    expect(onStatusChange).toHaveBeenCalledWith("completed");
  });

  it("calls onRangeChange only once per selection", async () => {
    const user = userEvent.setup();
    const onRangeChange = jest.fn();
    renderFilters({ onRangeChange });
    await user.selectOptions(screen.getByRole("combobox", { name: /date range/i }), "feb");
    expect(onRangeChange).toHaveBeenCalledTimes(1);
  });
});
