import { render, screen } from "@testing-library/react";
import { ProgressBar } from "@/components/list/ProgressBar";
import { WEEKLY_TARGET_HOURS } from "@/lib/types";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

describe("ProgressBar", () => {
  it("displays total/target with the hours unit suffix", () => {
    render(<ProgressBar total={20} target={40} />);
    expect(
      screen.getByText(`20/40 ${TEXT.units.hours}`),
    ).toBeInTheDocument();
  });

  it("uses WEEKLY_TARGET_HOURS as the default target", () => {
    render(<ProgressBar total={10} />);
    expect(
      screen.getByText(`10/${WEEKLY_TARGET_HOURS} ${TEXT.units.hours}`),
    ).toBeInTheDocument();
  });

  it("shows 50% when total is half the target", () => {
    render(<ProgressBar total={20} target={40} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("shows 100% when total equals the target", () => {
    render(<ProgressBar total={40} target={40} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("caps the displayed percentage at 100% when total exceeds target", () => {
    render(<ProgressBar total={50} target={40} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("shows 0% when total is 0", () => {
    render(<ProgressBar total={0} target={40} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
