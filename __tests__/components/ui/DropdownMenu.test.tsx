import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DropdownMenu } from "@/components/ui/DropdownMenu/DropdownMenu";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

const ITEMS = [
  { label: "Edit", onSelect: jest.fn() },
  { label: "Delete", onSelect: jest.fn(), danger: true },
];

function renderDropdown(items = ITEMS) {
  return render(<DropdownMenu items={items} />);
}

describe("DropdownMenu", () => {
  beforeEach(() => {
    ITEMS.forEach((item) => item.onSelect.mockClear());
  });

  it("hides the menu initially", () => {
    renderDropdown();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("shows the menu after clicking the trigger button", async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(
      screen.getByRole("button", { name: TEXT.task.actionsAria }),
    );

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("renders all provided menu items", async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(
      screen.getByRole("button", { name: TEXT.task.actionsAria }),
    );

    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Delete" }),
    ).toBeInTheDocument();
  });

  it("calls onSelect and closes the menu when an item is clicked", async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(
      screen.getByRole("button", { name: TEXT.task.actionsAria }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));

    expect(ITEMS[0].onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes the menu when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(
      screen.getByRole("button", { name: TEXT.task.actionsAria }),
    );
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes the menu when clicking outside the component", async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(
      screen.getByRole("button", { name: TEXT.task.actionsAria }),
    );
    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
