import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "@/components/timesheets/Pagination";

describe("Pagination", () => {
  it("renders nothing when totalPages is 1", () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when totalPages is 0", () => {
    const { container } = render(
      <Pagination page={1} totalPages={0} onPageChange={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders Previous and Next buttons", () => {
    render(<Pagination page={2} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: /prev/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("disables Previous on the first page", () => {
    render(<Pagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: /prev/i })).toBeDisabled();
  });

  it("disables Next on the last page", () => {
    render(<Pagination page={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("marks the current page button with aria-current='page'", () => {
    render(<Pagination page={3} totalPages={5} onPageChange={() => {}} />);
    const current = screen.getByRole("button", { name: "3" });
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("other page buttons do not have aria-current", () => {
    render(<Pagination page={3} totalPages={5} onPageChange={() => {}} />);
    const btn2 = screen.getByRole("button", { name: "2" });
    expect(btn2).not.toHaveAttribute("aria-current");
  });

  it("calls onPageChange with the clicked page number", async () => {
    const user = userEvent.setup();
    const handler = jest.fn();
    render(<Pagination page={1} totalPages={5} onPageChange={handler} />);
    await user.click(screen.getByRole("button", { name: "3" }));
    expect(handler).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange(page - 1) when Previous is clicked", async () => {
    const user = userEvent.setup();
    const handler = jest.fn();
    render(<Pagination page={3} totalPages={5} onPageChange={handler} />);
    await user.click(screen.getByRole("button", { name: /prev/i }));
    expect(handler).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange(page + 1) when Next is clicked", async () => {
    const user = userEvent.setup();
    const handler = jest.fn();
    render(<Pagination page={3} totalPages={5} onPageChange={handler} />);
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(handler).toHaveBeenCalledWith(4);
  });

  it("disables all buttons when isPending is true", () => {
    render(<Pagination page={3} totalPages={5} onPageChange={() => {}} isPending />);
    const buttons = screen.getAllByRole("button");
    for (const btn of buttons) {
      expect(btn).toBeDisabled();
    }
  });

  it("shows ellipsis for large page counts", () => {
    render(<Pagination page={5} totalPages={20} onPageChange={() => {}} />);
    // Ellipsis characters should be present
    expect(screen.getAllByText("…").length).toBeGreaterThan(0);
  });

  it("always shows the first and last page buttons", () => {
    render(<Pagination page={10} totalPages={20} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "20" })).toBeInTheDocument();
  });
});
