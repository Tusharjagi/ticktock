import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button/Button";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("uses 'primary' variant by default", () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-brand");
  });

  it("applies the 'secondary' variant classes when specified", () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-white");
  });

  it("applies the 'ghost' variant classes when specified", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-transparent");
  });

  it("shows the loading spinner when loading=true", () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByLabelText(TEXT.common.loadingAria)).toBeInTheDocument();
  });

  it("is disabled when loading=true", () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when disabled=true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies w-full when fullWidth=true", () => {
    render(<Button fullWidth>Full</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("calls onClick when clicked", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when the button is disabled", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );
    await user.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });
});
