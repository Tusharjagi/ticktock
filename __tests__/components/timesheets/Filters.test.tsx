import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Filters } from "@/components/timesheets/Filters";
import { TEXT } from "@/constants/TEXT_CONSTANTS";
import type { StatusFilter } from "@/components/timesheets/Filters";

function renderFilters(
  overrides: Partial<{
    rangeId: string;
    status: StatusFilter;
    onRangeChange: (id: string) => void;
    onStatusChange: (status: StatusFilter) => void;
  }> = {},
) {
  const props = {
    rangeId: "all",
    status: "all" as StatusFilter,
    onRangeChange: jest.fn(),
    onStatusChange: jest.fn(),
    ...overrides,
  };
  return { ...props, ...render(<Filters {...props} />) };
}

describe("Filters", () => {
  it("renders the date range selector", () => {
    renderFilters();
    expect(
      screen.getByRole("combobox", { name: TEXT.filters.dateRangeAria }),
    ).toBeInTheDocument();
  });

  it("renders the status selector", () => {
    renderFilters();
    expect(
      screen.getByRole("combobox", { name: TEXT.filters.statusAria }),
    ).toBeInTheDocument();
  });

  it("reflects the current rangeId as the selected option", () => {
    renderFilters({ rangeId: "jan" });
    const select = screen.getByRole("combobox", {
      name: TEXT.filters.dateRangeAria,
    }) as HTMLSelectElement;
    expect(select.value).toBe("jan");
  });

  it("reflects the current status as the selected option", () => {
    renderFilters({ status: "completed" });
    const select = screen.getByRole("combobox", {
      name: TEXT.filters.statusAria,
    }) as HTMLSelectElement;
    expect(select.value).toBe("completed");
  });

  it("calls onRangeChange with the selected range id", async () => {
    const user = userEvent.setup();
    const { onRangeChange } = renderFilters();

    await user.selectOptions(
      screen.getByRole("combobox", { name: TEXT.filters.dateRangeAria }),
      "jan",
    );

    expect(onRangeChange).toHaveBeenCalledWith("jan");
  });

  it("calls onStatusChange with the selected status", async () => {
    const user = userEvent.setup();
    const { onStatusChange } = renderFilters();

    await user.selectOptions(
      screen.getByRole("combobox", { name: TEXT.filters.statusAria }),
      "incomplete",
    );

    expect(onStatusChange).toHaveBeenCalledWith("incomplete");
  });
});
