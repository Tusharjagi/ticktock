import {
  ApiError,
  apiFetch,
  clearSession,
  getStoredUser,
  getToken,
  storeSession,
} from "@/services/api/client";
import { TEXT } from "@/constants/TEXT_CONSTANTS";
import type { User } from "@/services/api/types";

// ─── Shared fixtures ─────────────────────────────────────────────────────────

const MOCK_USER: User = {
  id: "user-1",
  name: "Tushar Jagi",
  email: "tushar@dev",
  initials: "TJ",
};

function makeMockResponse(opts: {
  ok: boolean;
  status: number;
  body?: unknown;
  contentType?: string;
}) {
  const contentType = opts.contentType ?? "application/json";
  return {
    ok: opts.ok,
    status: opts.status,
    headers: {
      get: (key: string) => (key === "content-type" ? contentType : null),
    },
    json: () => Promise.resolve(opts.body ?? {}),
  };
}

// ─── ApiError ────────────────────────────────────────────────────────────────

describe("ApiError", () => {
  it("is an instance of Error", () => {
    expect(new ApiError("msg", 404)).toBeInstanceOf(Error);
  });

  it("sets name to 'ApiError'", () => {
    expect(new ApiError("msg", 404).name).toBe("ApiError");
  });

  it("stores the HTTP status code", () => {
    expect(new ApiError("Unauthorized", 401).status).toBe(401);
  });

  it("stores the message string", () => {
    expect(new ApiError("Not found", 404).message).toBe("Not found");
  });
});

// ─── localStorage helpers ────────────────────────────────────────────────────

describe("localStorage session helpers", () => {
  beforeEach(() => localStorage.clear());

  describe("getToken", () => {
    it("returns null when no token has been stored", () => {
      expect(getToken()).toBeNull();
    });

    it("returns the token that was stored", () => {
      localStorage.setItem("ticktock.token", "my-token");
      expect(getToken()).toBe("my-token");
    });
  });

  describe("getStoredUser", () => {
    it("returns null when no user has been stored", () => {
      expect(getStoredUser()).toBeNull();
    });

    it("returns the parsed user from localStorage", () => {
      localStorage.setItem("ticktock.user", JSON.stringify(MOCK_USER));
      expect(getStoredUser()).toEqual(MOCK_USER);
    });

    it("returns null when the stored value is invalid JSON", () => {
      localStorage.setItem("ticktock.user", "not-json{");
      expect(getStoredUser()).toBeNull();
    });
  });

  describe("storeSession", () => {
    it("writes the token to localStorage", () => {
      storeSession("my-token", MOCK_USER);
      expect(localStorage.getItem("ticktock.token")).toBe("my-token");
    });

    it("writes the serialised user to localStorage", () => {
      storeSession("my-token", MOCK_USER);
      expect(JSON.parse(localStorage.getItem("ticktock.user")!)).toEqual(
        MOCK_USER,
      );
    });
  });

  describe("clearSession", () => {
    it("removes both token and user from localStorage", () => {
      storeSession("my-token", MOCK_USER);
      clearSession();
      expect(localStorage.getItem("ticktock.token")).toBeNull();
      expect(localStorage.getItem("ticktock.user")).toBeNull();
    });
  });
});

// ─── apiFetch ────────────────────────────────────────────────────────────────

describe("apiFetch", () => {
  const mockFetch = jest.fn();

  beforeAll(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    mockFetch.mockReset();
    localStorage.clear();
  });

  it("returns the parsed JSON body on a successful response", async () => {
    mockFetch.mockResolvedValueOnce(
      makeMockResponse({ ok: true, status: 200, body: { id: "1" } }),
    );

    const result = await apiFetch<{ id: string }>("/api/test");

    expect(result).toEqual({ id: "1" });
  });

  it("adds the Authorization header when a token is stored", async () => {
    localStorage.setItem("ticktock.token", "my-token");
    mockFetch.mockResolvedValueOnce(
      makeMockResponse({ ok: true, status: 200 }),
    );

    await apiFetch("/api/test");

    const [, init] = mockFetch.mock.calls[0] as [
      string,
      RequestInit & { headers: Headers },
    ];
    expect(init.headers.get("Authorization")).toBe("Bearer my-token");
  });

  it("omits the Authorization header when no token is stored", async () => {
    mockFetch.mockResolvedValueOnce(
      makeMockResponse({ ok: true, status: 200 }),
    );

    await apiFetch("/api/test");

    const [, init] = mockFetch.mock.calls[0] as [
      string,
      RequestInit & { headers: Headers },
    ];
    expect(init.headers.get("Authorization")).toBeNull();
  });

  it("sets Content-Type to application/json when a body is present", async () => {
    mockFetch.mockResolvedValueOnce(
      makeMockResponse({ ok: true, status: 200 }),
    );

    await apiFetch("/api/test", {
      method: "POST",
      body: JSON.stringify({ key: "val" }),
    });

    const [, init] = mockFetch.mock.calls[0] as [
      string,
      RequestInit & { headers: Headers },
    ];
    expect(init.headers.get("Content-Type")).toBe("application/json");
  });

  it("does not set Content-Type when no body is provided", async () => {
    mockFetch.mockResolvedValueOnce(
      makeMockResponse({ ok: true, status: 200 }),
    );

    await apiFetch("/api/test");

    const [, init] = mockFetch.mock.calls[0] as [
      string,
      RequestInit & { headers: Headers },
    ];
    expect(init.headers.get("Content-Type")).toBeNull();
  });

  it("throws ApiError with the server error message on a failed response", async () => {
    mockFetch.mockResolvedValueOnce(
      makeMockResponse({
        ok: false,
        status: 401,
        body: { error: TEXT.api.unauthorized },
      }),
    );

    await expect(apiFetch("/api/protected")).rejects.toMatchObject({
      name: "ApiError",
      status: 401,
      message: TEXT.api.unauthorized,
    });
  });

  it("falls back to a generic message when the error body has no 'error' field", async () => {
    mockFetch.mockResolvedValueOnce(
      makeMockResponse({ ok: false, status: 500, body: {} }),
    );

    await expect(apiFetch("/api/test")).rejects.toMatchObject({
      message: TEXT.api.requestFailed(500),
    });
  });

  it("returns null for non-JSON responses", async () => {
    mockFetch.mockResolvedValueOnce(
      makeMockResponse({
        ok: true,
        status: 200,
        contentType: "text/html",
        body: undefined,
      }),
    );

    const result = await apiFetch("/api/test");

    expect(result).toBeNull();
  });
});
