import {
  clearSession,
  getStoredUser,
  getToken,
  storeSession,
} from "@/services/api/client";
import { User } from "@/services/api/types";

const listeners = new Set<() => void>();

let cachedKey: string | null = null;
let cachedUser: User | null = null;

export const notifySessionChange = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeSession = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const getUserSnapshot = (): User | null => {
  const token = getToken();
  const user = token ? getStoredUser() : null;
  const key = user ? `${token}:${user.id}` : null;

  if (cachedKey !== key) {
    cachedKey = key;
    cachedUser = user;
  }

  return cachedUser;
};

export const loginSession = (token: string, user: User) => {
  storeSession(token, user);
  notifySessionChange();
};

export const logoutSession = () => {
  clearSession();
  notifySessionChange();
};
