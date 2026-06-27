import { cn } from "@/utils/cn";

describe("cn", () => {
  it("joins multiple truthy class strings with spaces", () => {
    expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
  });

  it("filters out false values", () => {
    expect(cn("foo", false, "bar")).toBe("foo bar");
  });

  it("filters out null and undefined values", () => {
    expect(cn("foo", null, undefined, "bar")).toBe("foo bar");
  });

  it("returns an empty string when all arguments are falsy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });

  it("returns a single class when only one truthy value is given", () => {
    expect(cn("solo")).toBe("solo");
  });

  it("returns an empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });
});
