import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "@/components/timesheets/Pagination";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

function renderPagination(
  overrides: Partial<{
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isPending: boolean;
  }> = {},
) {
  const props = {
    page: 1,
    totalPages: 5,
    onPageChange: jest.fn(),
    isPending: false,
    ...overrides,
  };
  return { onPageChange: props.onPageChange, ...render(<Pagination {...props} />) };
}

describe("Pagination", () => {
  it("renders nothing when totalPages is 1", () => {
    const { container } = renderPagination({ totalPages: 1 });
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when totalPages is 0", () => {
    const { container } = renderPagination({ totalPages: 0 });
    expect(container).toBeEmptyDOMElement();
  });

  it("renders Previous and Next buttons", () => {
    renderPagination();
    expect(
      screen.getByRole("button", { name: TEXT.pagination.previous }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: TEXT.pagination.next }),
    ).toBeInTheDocument();
  });

  it("disables the Previous button on the first page", () => {
    renderPagination({ page: 1 });
    expect(
      screen.getByRole("button", { name: TEXT.pagination.previous }),
    ).toBeDisabled();
  });

  it("disables the Next button on the last page", () => {
    renderPagination({ page: 5, totalPages: 5 });
    expect(
      screen.getByRole("button", { name: TEXT.pagination.next }),
    ).toBeDisabled();
  });

  it("marks the current page button with aria-current='page'", () => {
    renderPagination({ page: 3, totalPages: 5 });
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("calls onPageChange with page - 1 when Previous is clicked", async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 3 });

    await user.click(
      screen.getByRole("button", { name: TEXT.pagination.previous }),
    );

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with page + 1 when Next is clicked", async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 3, totalPages: 5 });

    await user.click(
      screen.getByRole("button", { name: TEXT.pagination.next }),
    );

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("calls onPageChange with the selected page number when a page button is clicked", async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 1, totalPages: 5 });

    await user.click(screen.getByRole("button", { name: "4" }));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("disables all buttons while isPending=true", () => {
    renderPagination({ isPending: true });
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it("renders an ellipsis for large page counts", () => {
    renderPagination({ page: 5, totalPages: 10 });
    const ellipses = screen.getAllByText(TEXT.pagination.ellipsis);
    expect(ellipses.length).toBeGreaterThan(0);
  });
});
