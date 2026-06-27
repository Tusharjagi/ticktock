import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskCard } from "@/components/list/TaskCard";
import { TEXT } from "@/constants/TEXT_CONSTANTS";
import type { TimesheetEntry } from "@/lib/types";

const MOCK_ENTRY: TimesheetEntry = {
  id: "entry-1",
  weekId: "2026-W01",
  date: "2026-01-05",
  projectId: "proj-1",
  projectName: "Alpha Project",
  workTypeId: "dev",
  workTypeLabel: "Development",
  description: "Built the login page",
  hours: 4,
};

function renderTaskCard(
  overrides: Partial<{
    onEdit: (entry: TimesheetEntry) => void;
    onDelete: (entry: TimesheetEntry) => void;
  }> = {},
) {
  const props = {
    entry: MOCK_ENTRY,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    ...overrides,
  };
  return { ...props, ...render(<TaskCard {...props} />) };
}

describe("TaskCard", () => {
  it("renders the entry description", () => {
    renderTaskCard();
    expect(screen.getByText(MOCK_ENTRY.description)).toBeInTheDocument();
  });

  it("renders the hours with the correct unit suffix", () => {
    renderTaskCard();
    expect(
      screen.getByText(`${MOCK_ENTRY.hours} ${TEXT.units.hours}`),
    ).toBeInTheDocument();
  });

  it("renders the project name as a tag", () => {
    renderTaskCard();
    expect(screen.getByText(MOCK_ENTRY.projectName)).toBeInTheDocument();
  });

  it("calls onEdit with the entry when Edit is selected from the menu", async () => {
    const user = userEvent.setup();
    const { onEdit } = renderTaskCard();

    await user.click(
      screen.getByRole("button", { name: TEXT.task.actionsAria }),
    );
    await user.click(screen.getByRole("menuitem", { name: TEXT.task.edit }));

    expect(onEdit).toHaveBeenCalledWith(MOCK_ENTRY);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete with the entry when Delete is selected from the menu", async () => {
    const user = userEvent.setup();
    const { onDelete } = renderTaskCard();

    await user.click(
      screen.getByRole("button", { name: TEXT.task.actionsAria }),
    );
    await user.click(screen.getByRole("menuitem", { name: TEXT.task.delete }));

    expect(onDelete).toHaveBeenCalledWith(MOCK_ENTRY);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
