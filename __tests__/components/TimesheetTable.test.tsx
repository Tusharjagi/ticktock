import { render, screen } from "@testing-library/react";
import { TimesheetTable } from "@/components/timesheets/TimesheetTable";
import type { WeeklyTimesheet } from "@/lib/types";

const WEEKS: WeeklyTimesheet[] = [
  {
    id: "w1",
    weekNumber: 1,
    startDate: "2026-01-05",
    endDate: "2026-01-09",
    dateLabel: "5 - 9 January, 2026",
    totalHours: 40,
    status: "completed",
  },
  {
    id: "w3",
    weekNumber: 3,
    startDate: "2026-01-19",
    endDate: "2026-01-23",
    dateLabel: "19 - 23 January, 2026",
    totalHours: 20,
    status: "incomplete",
  },
  {
    id: "w5",
    weekNumber: 5,
    startDate: "2026-02-02",
    endDate: "2026-02-06",
    dateLabel: "2 - 6 February, 2026",
    totalHours: 0,
    status: "missing",
  },
];

describe("TimesheetTable — loading state", () => {
  it("renders skeleton rows when isLoading is true", () => {
    render(<TimesheetTable weeks={[]} isLoading />);
    // Skeleton rows are animated pulse divs — not real data rows.
    const pulseElements = document.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("does not render data rows while loading", () => {
    render(<TimesheetTable weeks={WEEKS} isLoading />);
    expect(screen.queryByText("5 - 9 January, 2026")).not.toBeInTheDocument();
  });
});

describe("TimesheetTable — empty state", () => {
  it("shows an empty message when weeks is empty and not loading", () => {
    render(<TimesheetTable weeks={[]} isLoading={false} />);
    expect(screen.getByText(/no timesheets/i)).toBeInTheDocument();
  });
});

describe("TimesheetTable — data rows", () => {
  it("renders one row per week", () => {
    render(<TimesheetTable weeks={WEEKS} isLoading={false} />);
    expect(screen.getByText("5 - 9 January, 2026")).toBeInTheDocument();
    expect(screen.getByText("19 - 23 January, 2026")).toBeInTheDocument();
    expect(screen.getByText("2 - 6 February, 2026")).toBeInTheDocument();
  });

  it("renders the week number for each row", () => {
    render(<TimesheetTable weeks={WEEKS} isLoading={false} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders a link to the week detail page", () => {
    render(<TimesheetTable weeks={WEEKS} isLoading={false} />);
    const links = screen.getAllByRole("link");
    expect(links.some((l) => l.getAttribute("href") === "/timesheets/w1")).toBe(true);
  });

  it("shows action labels for each status", () => {
    render(<TimesheetTable weeks={WEEKS} isLoading={false} />);
    // Completed → View, Incomplete → Update, Missing → Create
    expect(screen.getByText(/view/i)).toBeInTheDocument();
    expect(screen.getByText(/update/i)).toBeInTheDocument();
    expect(screen.getByText(/create/i)).toBeInTheDocument();
  });
});

describe("TimesheetTable — fetching dim", () => {
  it("applies opacity class when isFetching=true and not loading", () => {
    const { container } = render(
      <TimesheetTable weeks={WEEKS} isLoading={false} isFetching />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toMatch(/opacity-50/);
  });

  it("does NOT apply opacity class when isLoading=true (skeleton already shown)", () => {
    const { container } = render(
      <TimesheetTable weeks={[]} isLoading isFetching />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).not.toMatch(/opacity-50/);
  });

  it("does NOT apply opacity class when isFetching=false", () => {
    const { container } = render(
      <TimesheetTable weeks={WEEKS} isLoading={false} isFetching={false} />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).not.toMatch(/opacity-50/);
  });
});
