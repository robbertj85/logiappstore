"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Vehicle } from "@logiappstore/shared";

export type AuthRole = "CONSUMER" | "SUPPLIER" | "SUPPLIER_NEW" | "ADMIN";
export type OnboardingStatus = "NOT_STARTED" | "IN_PROGRESS" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";

export interface SupplierProfile {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  description: string;
  categoryIds: string[];
  logo: string;
  kvkUittreksel: boolean;
  onboardingStep: number; // 0-3
}

export interface FakeUser {
  name: string;
  email: string;
  role: AuthRole;
  organization: string;
  kvkNumber: string;
  niwoNumber?: string;
  vehicles: Vehicle[];
  onboardingStatus?: OnboardingStatus;
  supplierProfile?: SupplierProfile;
}

const DEMO_USERS: Record<string, FakeUser> = {
  CONSUMER: {
    name: "Jan de Vries",
    email: "jan@devriesbv.nl",
    role: "CONSUMER",
    organization: "De Vries Transport BV",
    kvkNumber: "87654321",
    niwoNumber: "",
    vehicles: [
      {
        kenteken: "BZ-VD-78",
        merk: "DAF",
        handelsbenaming: "XF 480",
        voertuigsoort: "Bedrijfsauto",
        eerste_kleur: "WIT",
        toegestane_maximum_massa_voertuig: 40000,
        datum_eerste_toelating: "20210315",
        vervaldatum_apk: "20260315",
        wam_verzekerd: "Ja",
      },
      {
        kenteken: "KL-TR-92",
        merk: "SCANIA",
        handelsbenaming: "R 450",
        voertuigsoort: "Bedrijfsauto",
        eerste_kleur: "BLAUW",
        toegestane_maximum_massa_voertuig: 44000,
        datum_eerste_toelating: "20200610",
        vervaldatum_apk: "20260610",
        wam_verzekerd: "Ja",
      },
      {
        kenteken: "NP-28-GH",
        merk: "VOLVO",
        handelsbenaming: "FH 500",
        voertuigsoort: "Bedrijfsauto",
        eerste_kleur: "WIT",
        toegestane_maximum_massa_voertuig: 40000,
        datum_eerste_toelating: "20220901",
        vervaldatum_apk: "20260901",
        wam_verzekerd: "Ja",
      },
    ],
  },
  SUPPLIER: {
    name: "Lisa van Dijk",
    email: "lisa@transtics.nl",
    role: "SUPPLIER",
    organization: "Transtics",
    kvkNumber: "12345678",
    vehicles: [],
    onboardingStatus: "APPROVED",
    supplierProfile: {
      contactName: "Lisa van Dijk",
      contactEmail: "lisa@transtics.nl",
      contactPhone: "+31 20 123 4567",
      website: "https://transtics.nl",
      description: "Transtics levert innovatieve TMS- en fleet management oplossingen voor de Nederlandse transport- en logistiek sector.",
      categoryIds: ["cat-tms", "cat-fleet"],
      logo: "",
      kvkUittreksel: true,
      onboardingStep: 3,
    },
  },
  SUPPLIER_NEW: {
    name: "Mark Jansen",
    email: "mark@logisoftware.nl",
    role: "SUPPLIER",
    organization: "LogiSoftware BV",
    kvkNumber: "",
    vehicles: [],
    onboardingStatus: "NOT_STARTED",
  },
  ADMIN: {
    name: "Sophie van der Berg",
    email: "sophie@connekt.nl",
    role: "ADMIN",
    organization: "Connekt / Logistiek Digitaal",
    kvkNumber: "41150084",
    vehicles: [],
  },
};

interface AuthContextType {
  user: FakeUser | null;
  login: (role: AuthRole) => void;
  logout: () => void;
  updateUser: (updates: Partial<FakeUser>) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
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

  const updateUser = (updates: Partial<FakeUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("logiappstore_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoggedIn: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
