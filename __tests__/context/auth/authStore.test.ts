import {
  getUserSnapshot,
  loginSession,
  logoutSession,
  notifySessionChange,
  subscribeSession,
} from "@/context/auth/authStore";
import type { User } from "@/services/api/types";

const MOCK_USER: User = {
  id: "user-1",
  name: "Tushar Jagi",
  email: "tushar@dev",
  initials: "TJ",
};

// ─── getUserSnapshot ──────────────────────────────────────────────────────────

describe("getUserSnapshot", () => {
  beforeEach(() => localStorage.clear());

  it("returns null when no session is stored", () => {
    expect(getUserSnapshot()).toBeNull();
  });

  it("returns the stored user when both token and user exist", () => {
    localStorage.setItem("ticktock.token", "test-token");
    localStorage.setItem("ticktock.user", JSON.stringify(MOCK_USER));
    expect(getUserSnapshot()).toEqual(MOCK_USER);
  });

  it("returns null when a token is present but the user is absent", () => {
    localStorage.setItem("ticktock.token", "test-token");
    expect(getUserSnapshot()).toBeNull();
  });

  it("returns null when user data exists but no token is present", () => {
    localStorage.setItem("ticktock.user", JSON.stringify(MOCK_USER));
    expect(getUserSnapshot()).toBeNull();
  });
});

// ─── loginSession ─────────────────────────────────────────────────────────────

describe("loginSession", () => {
  beforeEach(() => localStorage.clear());

  it("persists the token to localStorage", () => {
    loginSession("my-token", MOCK_USER);
    expect(localStorage.getItem("ticktock.token")).toBe("my-token");
  });

  it("persists the user to localStorage", () => {
    loginSession("my-token", MOCK_USER);
    expect(JSON.parse(localStorage.getItem("ticktock.user")!)).toEqual(
      MOCK_USER,
    );
  });

  it("notifies all subscribed listeners", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeSession(listener);

    loginSession("my-token", MOCK_USER);

    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});

// ─── logoutSession ────────────────────────────────────────────────────────────

describe("logoutSession", () => {
  beforeEach(() => {
    localStorage.clear();
    loginSession("my-token", MOCK_USER);
  });

  it("removes the token from localStorage", () => {
    logoutSession();
    expect(localStorage.getItem("ticktock.token")).toBeNull();
  });

  it("removes the user from localStorage", () => {
    logoutSession();
    expect(localStorage.getItem("ticktock.user")).toBeNull();
  });

  it("notifies all subscribed listeners", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeSession(listener);

    logoutSession();

    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});

// ─── subscribeSession ─────────────────────────────────────────────────────────

describe("subscribeSession", () => {
  it("invokes the listener when notifySessionChange is called", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeSession(listener);

    notifySessionChange();

    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it("stops invoking the listener after unsubscribing", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeSession(listener);
    unsubscribe();

    notifySessionChange();

    expect(listener).not.toHaveBeenCalled();
  });

  it("supports multiple concurrent listeners", () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    const unsubscribeA = subscribeSession(listenerA);
    const unsubscribeB = subscribeSession(listenerB);

    notifySessionChange();

    expect(listenerA).toHaveBeenCalledTimes(1);
    expect(listenerB).toHaveBeenCalledTimes(1);
    unsubscribeA();
    unsubscribeB();
  });
});
