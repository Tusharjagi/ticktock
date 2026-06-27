import { render, screen } from "@testing-library/react";
import { Spinner } from "@/components/ui/Spinner";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

describe("Spinner", () => {
  it("renders with role='status' for accessibility", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has the Loading accessible label", () => {
    render(<Spinner />);
    expect(screen.getByLabelText(TEXT.common.loadingAria)).toBeInTheDocument();
  });

  it("merges additional className onto the element", () => {
    render(<Spinner className="custom-class" />);
    expect(screen.getByRole("status")).toHaveClass("custom-class");
  });
});
