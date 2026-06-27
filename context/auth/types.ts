import { User } from "@/services/api/types";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login(email: string, password: string): Promise<void>;
  logout(): void;
}
