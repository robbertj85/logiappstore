"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type AuthRole = "CONSUMER" | "SUPPLIER";

export interface FakeUser {
  name: string;
  email: string;
  role: AuthRole;
  organization: string;
  kvkNumber: string;
}

const DEMO_USERS: Record<AuthRole, FakeUser> = {
  CONSUMER: {
    name: "Jan de Vries",
    email: "jan@devriesbv.nl",
    role: "CONSUMER",
    organization: "De Vries Transport BV",
    kvkNumber: "87654321",
  },
  SUPPLIER: {
    name: "Lisa van Dijk",
    email: "lisa@transtics.nl",
    role: "SUPPLIER",
    organization: "Transtics",
    kvkNumber: "12345678",
  },
};

interface AuthContextType {
  user: FakeUser | null;
  login: (role: AuthRole) => void;
  logout: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FakeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("logiappstore_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("logiappstore_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (role: AuthRole) => {
    const demoUser = DEMO_USERS[role];
    setUser(demoUser);
    localStorage.setItem("logiappstore_user", JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("logiappstore_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
