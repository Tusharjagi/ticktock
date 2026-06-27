import { render, screen } from "@testing-library/react";
import { StatusBadge, Tag } from "@/components/ui/Badge";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

// ─── StatusBadge ─────────────────────────────────────────────────────────────

describe("StatusBadge", () => {
  it("renders the COMPLETED label for completed status", () => {
    render(<StatusBadge status="completed" />);
    expect(screen.getByText(TEXT.status.completed)).toBeInTheDocument();
  });

  it("renders the INCOMPLETE label for incomplete status", () => {
    render(<StatusBadge status="incomplete" />);
    expect(screen.getByText(TEXT.status.incomplete)).toBeInTheDocument();
  });

  it("renders the MISSING label for missing status", () => {
    render(<StatusBadge status="missing" />);
    expect(screen.getByText(TEXT.status.missing)).toBeInTheDocument();
  });
});

// ─── Tag ─────────────────────────────────────────────────────────────────────

describe("Tag", () => {
  it("renders its children", () => {
    render(<Tag>My Project</Tag>);
    expect(screen.getByText("My Project")).toBeInTheDocument();
  });

  it("renders React node children", () => {
    render(
      <Tag>
        <span data-testid="inner">inner</span>
      </Tag>,
    );
    expect(screen.getByTestId("inner")).toBeInTheDocument();
  });
});
