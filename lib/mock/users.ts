import { User } from "../types";

interface MockUser extends User {
  password: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "u_1",
    name: "John Doe",
    email: "john@ticktock.dev",
    initials: "JD",
    password: "password123",
  },
];

export const DEMO_CREDENTIALS = {
  email: "john@ticktock.dev",
  password: "password123",
};

export function findUserByCredentials(
  email: string,
  password: string,
): User | null {
  const match = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!match) return null;
  return {
    id: match.id,
    name: match.name,
    email: match.email,
    initials: match.initials,
  };
}
