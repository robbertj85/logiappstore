"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft, Wallet, Search, Plus, CheckCircle2, Edit2,
  Save, X, Euro, Truck, Building2, AlertCircle,
} from "lucide-react";

interface ConsumerBudget {
  id: string;
  organization: string;
  kvkNumber: string;
  contactName: string;
  contactEmail: string;
  vehicleCount: number;
  fiscalYear: number;
  totalAllocated: number; // cents
  totalSpent: number; // cents
}

// Demo consumer data with budgets
const INITIAL_BUDGETS: ConsumerBudget[] = [
  {
    id: "budget-1",
    organization: "De Vries Transport BV",
    kvkNumber: "87654321",
    contactName: "Jan de Vries",
    contactEmail: "jan@devriesbv.nl",
    vehicleCount: 3,
    fiscalYear: 2026,
    totalAllocated: 1500000,
    totalSpent: 348900,
  },
  {
    id: "budget-2",
    organization: "Bakker Logistics",
    kvkNumber: "11223344",
    contactName: "Petra Bakker",
    contactEmail: "petra@bakkerlogistics.nl",
    vehicleCount: 12,
    fiscalYear: 2026,
    totalAllocated: 3500000,
    totalSpent: 1245000,
  },
  {
    id: "budget-3",
    organization: "El Amrani Transport",
    kvkNumber: "55667788",
    contactName: "Mohammed El Amrani",
    contactEmail: "m.elamrani@elamrani-transport.nl",
    vehicleCount: 8,
    fiscalYear: 2026,
    totalAllocated: 2000000,
    totalSpent: 0,
  },
  {
    id: "budget-4",
    organization: "Mulder & Zn Vervoer",
    kvkNumber: "33445566",
    contactName: "Klaas Mulder",
    contactEmail: "klaas@muldervervoer.nl",
    vehicleCount: 30,
    fiscalYear: 2026,
    totalAllocated: 5000000,
    totalSpent: 2490000,
  },
  {
    id: "budget-5",
    organization: "Hendriks Internationaal Transport",
    kvkNumber: "77889900",
    contactName: "Sandra Hendriks",
    contactEmail: "sandra@hendriks-transport.nl",
    vehicleCount: 45,
    fiscalYear: 2026,
    totalAllocated: 7500000,
    totalSpent: 4120000,
  },
  {
    id: "budget-6",
    organization: "Visser Koeriersdiensten",
    kvkNumber: "99001122",
    contactName: "Henk Visser",
    contactEmail: "henk@visserkoeriersdiensten.nl",
    vehicleCount: 5,
    fiscalYear: 2026,
    totalAllocated: 0,
    totalSpent: 0,
  },
  {
    id: "budget-7",
    organization: "Jansen Transport BV",
    kvkNumber: "44556677",
    contactName: "Annemarie Jansen",
    contactEmail: "annemarie@jansentransport.nl",
    vehicleCount: 15,
    fiscalYear: 2026,
    totalAllocated: 0,
    totalSpent: 0,
  },
];

export default function AdminTerugsluisPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [budgets, setBudgets] = useState<ConsumerBudget[]>(INITIAL_BUDGETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [bulkAmount, setBulkAmount] = useState("");
  const [bulkMode, setBulkMode] = useState<"flat" | "per_vehicle">("per_vehicle");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (isLoading) {
    return <div className="bg-background min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Laden...</div></div>;
  }
  if (!isLoggedIn || !user || user.role !== "ADMIN") {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  const formatEur = (c: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(c / 100);

  const filteredBudgets = searchQuery
    ? budgets.filter(
        (b) =>
          b.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.kvkNumber.includes(searchQuery)
      )
    : budgets;

  const totalAllocated = budgets.reduce((s, b) => s + b.totalAllocated, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.totalSpent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const companiesWithBudget = budgets.filter((b) => b.totalAllocated > 0).length;
  const companiesWithoutBudget = budgets.filter((b) => b.totalAllocated === 0).length;

  const startEdit = (budget: ConsumerBudget) => {
    setEditingId(budget.id);
    setEditValue((budget.totalAllocated / 100).toString());
  };

  const saveEdit = (id: string) => {
    const cents = Math.round(parseFloat(editValue) * 100);
    if (isNaN(cents) || cents < 0) return;
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, totalAllocated: cents } : b))
    );
    setEditingId(null);
    showSuccess(`Budget bijgewerkt`);
  };

  const allocateBulk = () => {
    const amount = parseFloat(bulkAmount);
    if (isNaN(amount) || amount <= 0) return;
    const cents = Math.round(amount * 100);

    setBudgets((prev) =>
      prev.map((b) => {
        if (b.totalAllocated > 0) return b; // only allocate to companies without budget
        const allocation = bulkMode === "per_vehicle" ? cents * b.vehicleCount : cents;
        return { ...b, totalAllocated: allocation };
      })
    );
    setShowAllocateModal(false);
    setBulkAmount("");
    showSuccess(
      `Budget toegewezen aan ${companiesWithoutBudget} vervoerder${companiesWithoutBudget !== 1 ? "s" : ""}`
    );
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar beheerdersdashboard
        </Link>

        {/* Success toast */}
        {successMessage && (
          <div className="fixed top-20 right-6 z-50 bg-accent text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Terugsluis Budgetbeheer</h1>
              <p className="text-sm text-muted-foreground">
                Wijs Terugsluis-budget toe aan geregistreerde vervoerders
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAllocateModal(true)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            Bulk toewijzen
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="card p-4">
            <Euro className="h-5 w-5 text-accent mb-2" />
            <p className="text-xl font-bold text-primary">{formatEur(totalAllocated)}</p>
            <p className="text-xs text-muted-foreground">Totaal toegewezen</p>
          </div>
          <div className="card p-4">
            <Euro className="h-5 w-5 text-danger mb-2" />
            <p className="text-xl font-bold text-primary">{formatEur(totalSpent)}</p>
            <p className="text-xs text-muted-foreground">Totaal besteed</p>
          </div>
          <div className="card p-4">
            <Wallet className="h-5 w-5 text-highlight mb-2" />
            <p className="text-xl font-bold text-primary">{formatEur(totalRemaining)}</p>
            <p className="text-xs text-muted-foreground">Resterend</p>
          </div>
          <div className="card p-4">
            <Building2 className="h-5 w-5 text-accent mb-2" />
            <p className="text-xl font-bold text-accent">{companiesWithBudget}</p>
            <p className="text-xs text-muted-foreground">Met budget</p>
          </div>
          <div className="card p-4 border-amber-200 bg-amber-50/50">
            <AlertCircle className="h-5 w-5 text-amber-600 mb-2" />
            <p className="text-xl font-bold text-amber-700">{companiesWithoutBudget}</p>
            <p className="text-xs text-amber-600">Zonder budget</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Zoek op bedrijfsnaam, contactpersoon of KvK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-highlight/50 focus:border-highlight"
            />
          </div>
        </div>

        {/* Budget table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Vervoerder</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">KvK</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Voertuigen</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Toegewezen</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Besteed</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Resterend</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">% gebruikt</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.map((budget) => {
                  const remaining = budget.totalAllocated - budget.totalSpent;
                  const pctUsed = budget.totalAllocated > 0
                    ? Math.round((budget.totalSpent / budget.totalAllocated) * 100)
                    : 0;
                  const isEditing = editingId === budget.id;
                  const noBudget = budget.totalAllocated === 0;

                  return (
                    <tr
                      key={budget.id}
                      className={`border-b border-border transition-colors ${noBudget ? "bg-amber-50/30" : "hover:bg-background/50"}`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-highlight/10 flex items-center justify-center text-highlight font-bold text-sm shrink-0">
                            {budget.organization.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-primary">{budget.organization}</p>
                            <p className="text-[11px] text-muted-foreground">{budget.contactName} — {budget.contactEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-muted-foreground font-mono">{budget.kvkNumber}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-semibold text-primary">{budget.vehicleCount}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-sm text-muted-foreground">€</span>
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-28 text-right text-sm border border-highlight rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-highlight/30"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit(budget.id);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                            />
                          </div>
                        ) : (
                          <span className={`text-sm font-semibold ${noBudget ? "text-amber-600" : "text-primary"}`}>
                            {noBudget ? "Niet toegewezen" : formatEur(budget.totalAllocated)}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm text-muted-foreground">{formatEur(budget.totalSpent)}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`text-sm font-semibold ${remaining < 0 ? "text-danger" : "text-primary"}`}>
                          {noBudget ? "—" : formatEur(remaining)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {noBudget ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 bg-border rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${pctUsed > 80 ? "bg-danger" : pctUsed > 50 ? "bg-warning" : "bg-accent"}`}
                                style={{ width: `${Math.min(pctUsed, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-8 text-right">{pctUsed}%</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => saveEdit(budget.id)}
                              className="p-1.5 text-accent hover:bg-accent/10 rounded transition-colors"
                              title="Opslaan"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-muted-foreground hover:bg-background rounded transition-colors"
                              title="Annuleren"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(budget)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-highlight hover:text-highlight/80 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            {noBudget ? "Toewijzen" : "Wijzigen"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bulk allocate modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAllocateModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-border max-w-md w-full mx-4 p-6">
            <button
              onClick={() => setShowAllocateModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">Bulk budget toewijzen</h2>
                <p className="text-xs text-muted-foreground">
                  Wijs budget toe aan {companiesWithoutBudget} vervoerder{companiesWithoutBudget !== 1 ? "s" : ""} zonder budget
                </p>
              </div>
            </div>

            {companiesWithoutBudget === 0 ? (
              <div className="text-center py-6">
                <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Alle vervoerders hebben al een budget toegewezen.
                </p>
              </div>
            ) : (
              <>
                {/* Mode selection */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-primary block mb-2">Toewijzingsmethode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setBulkMode("per_vehicle")}
                      className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                        bulkMode === "per_vehicle"
                          ? "border-highlight bg-highlight/5 text-primary"
                          : "border-border text-muted-foreground hover:border-border/80"
                      }`}
                    >
                      <p className="font-semibold">Per voertuig</p>
                      <p className="text-[11px] mt-0.5">Bedrag x aantal voertuigen</p>
                    </button>
                    <button
                      onClick={() => setBulkMode("flat")}
                      className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                        bulkMode === "flat"
                          ? "border-highlight bg-highlight/5 text-primary"
                          : "border-border text-muted-foreground hover:border-border/80"
                      }`}
                    >
                      <p className="font-semibold">Vast bedrag</p>
                      <p className="text-[11px] mt-0.5">Zelfde bedrag per bedrijf</p>
                    </button>
                  </div>
                </div>

                {/* Amount input */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-primary block mb-2">
                    {bulkMode === "per_vehicle" ? "Bedrag per voertuig" : "Bedrag per bedrijf"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                    <input
                      type="number"
                      value={bulkAmount}
                      onChange={(e) => setBulkAmount(e.target.value)}
                      placeholder={bulkMode === "per_vehicle" ? "bijv. 5000" : "bijv. 15000"}
                      className="w-full pl-8 pr-4 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-highlight/50 focus:border-highlight"
                    />
                  </div>
                </div>

                {/* Preview */}
                {bulkAmount && parseFloat(bulkAmount) > 0 && (
                  <div className="bg-background rounded-lg p-4 mb-4 space-y-2">
                    <p className="text-xs font-semibold text-primary mb-2">Voorbeeld toewijzing:</p>
                    {budgets
                      .filter((b) => b.totalAllocated === 0)
                      .slice(0, 3)
                      .map((b) => {
                        const amount = bulkMode === "per_vehicle"
                          ? parseFloat(bulkAmount) * b.vehicleCount
                          : parseFloat(bulkAmount);
                        return (
                          <div key={b.id} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {b.organization}
                              {bulkMode === "per_vehicle" && (
                                <span className="text-[10px] text-muted-foreground"> ({b.vehicleCount} voertuigen)</span>
                              )}
                            </span>
                            <span className="font-semibold text-primary">
                              {formatEur(Math.round(amount * 100))}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={allocateBulk}
                    disabled={!bulkAmount || parseFloat(bulkAmount) <= 0}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Toewijzen aan {companiesWithoutBudget} vervoerder{companiesWithoutBudget !== 1 ? "s" : ""}
                  </button>
                  <button
                    onClick={() => setShowAllocateModal(false)}
                    className="px-4 py-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Annuleren
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
