import { User } from "@/services/api/types";
import { MOCK_USERS } from "./constants";

export function findUserByCredentials(
  email: string,
  password: string,
): User | null {
  const match = MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!match) return null;
  return {
    id: match.id,
    name: match.name,
    email: match.email,
    initials: match.initials,
  };
}
