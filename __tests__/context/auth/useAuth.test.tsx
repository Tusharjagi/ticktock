import { render, screen } from "@testing-library/react";
import { AuthProvider } from "@/context/auth/AuthProvider";
import { useAuth } from "@/context/auth/useAuth";

// ─── Test helper component ────────────────────────────────────────────────────

function AuthConsumer() {
  const { isAuthenticated, loading, user } = useAuth();
  return (
    <div>
      <span data-testid="isAuthenticated">{String(isAuthenticated)}</span>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user?.name ?? "none"}</span>
    </div>
  );
}

// ─── useAuth ─────────────────────────────────────────────────────────────────

describe("useAuth", () => {
  beforeEach(() => localStorage.clear());

  it("throws when used outside an AuthProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<AuthConsumer />)).toThrow(
      "useAuth must be used within an AuthProvider",
    );

    spy.mockRestore();
  });

  it("returns isAuthenticated=false when no session exists", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
  });

  it("returns user=null when no session exists", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user").textContent).toBe("none");
  });

  it("provides the login and logout functions", () => {
    let authValue: ReturnType<typeof useAuth> | null = null;

    function CaptureFunctions() {
      authValue = useAuth();
      return null;
    }

    render(
      <AuthProvider>
        <CaptureFunctions />
      </AuthProvider>,
    );

    expect(typeof authValue!.login).toBe("function");
    expect(typeof authValue!.logout).toBe("function");
  });
});
