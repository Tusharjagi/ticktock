import { AuthState } from "@/lib/types";
import { createContext } from "react";

export const AuthContext = createContext<AuthState | null>(null);
