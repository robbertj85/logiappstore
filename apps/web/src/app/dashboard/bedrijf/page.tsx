"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { Vehicle } from "@logiappstore/shared";
import {
  Building2,
  Truck,
  Plus,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Scale,
} from "lucide-react";
import Link from "next/link";

type KentekenEntry = {
  input: string;
  vehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
};

function formatKenteken(raw: string): string {
  return raw
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .replace(/(.{2})(.{2,3})(.{2})/, "$1-$2-$3");
}

function formatDatum(d: string): string {
  if (!d || d.length !== 8) return "-";
  return `${d.slice(6, 8)}-${d.slice(4, 6)}-${d.slice(0, 4)}`;
}

function formatMassa(kg: number): string {
  if (!kg) return "-";
  return `${(kg / 1000).toFixed(1)}t`;
}

export default function BedrijfPage() {
  const { user, isLoggedIn, isLoading: authLoading, updateUser } = useAuth();
  const router = useRouter();

  const [kvkNumber, setKvkNumber] = useState(user?.kvkNumber || "");
  const [niwoNumber, setNiwoNumber] = useState(user?.niwoNumber || "");
  const [kentekens, setKentekens] = useState<KentekenEntry[]>(
    () =>
      user?.vehicles?.map((v) => ({
        input: v.kenteken,
        vehicle: v,
        loading: false,
        error: null,
      })) || []
  );
  const [saved, setSaved] = useState(false);

  if (authLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Laden...</div>
      </div>
    );
  }
  if (!isLoggedIn || !user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  const canAddMore = kentekens.length < 10;

  const addKenteken = () => {
    if (!canAddMore) return;
    setKentekens([
      ...kentekens,
      { input: "", vehicle: null, loading: false, error: null },
    ]);
    setSaved(false);
  };

  const removeKenteken = (index: number) => {
    setKentekens(kentekens.filter((_, i) => i !== index));
    setSaved(false);
  };

  const updateKentekenInput = (index: number, value: string) => {
    const updated = [...kentekens];
    updated[index] = { ...updated[index], input: value, error: null };
    setKentekens(updated);
    setSaved(false);
  };

  const lookupKenteken = async (index: number) => {
    const entry = kentekens[index];
    const cleaned = entry.input.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (!cleaned) return;

    const updated = [...kentekens];
    updated[index] = { ...updated[index], loading: true, error: null, vehicle: null };
    setKentekens(updated);

    try {
      const res = await fetch(`/api/rdw?kenteken=${cleaned}`);
      const data = await res.json();

      const next = [...kentekens];
      if (!res.ok) {
        next[index] = {
          ...next[index],
          loading: false,
          error: data.error || "Kenteken niet gevonden",
          vehicle: null,
        };
      } else {
        next[index] = {
          ...next[index],
          input: data.kenteken,
          loading: false,
          error: null,
          vehicle: data,
        };
      }
      setKentekens(next);
      setSaved(false);
    } catch {
      const next = [...kentekens];
      next[index] = {
        ...next[index],
        loading: false,
        error: "Verbindingsfout met RDW",
        vehicle: null,
      };
      setKentekens(next);
    }
  };

  const handleSave = () => {
    const vehicles = kentekens
      .filter((k) => k.vehicle)
      .map((k) => k.vehicle as Vehicle);

    updateUser({
      kvkNumber,
      niwoNumber: niwoNumber || undefined,
      vehicles,
    });
    setSaved(true);
  };

  const validVehicles = kentekens.filter((k) => k.vehicle);
  const heavyVehicles = validVehicles.filter(
    (k) => k.vehicle && k.vehicle.toegestane_maximum_massa_voertuig > 3500
  );

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-highlight mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">
            Bedrijfsgegevens
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registreer uw bedrijfsgegevens en voertuigen om uw Terugsluis-geschiktheid te valideren.
          </p>
        </div>

        {/* KvK & NIWO Section */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Bedrijf</h2>
              <p className="text-xs text-muted-foreground">
                {user.organization}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1.5">
                KvK-nummer <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={kvkNumber}
                onChange={(e) => {
                  setKvkNumber(e.target.value);
                  setSaved(false);
                }}
                placeholder="12345678"
                maxLength={8}
                className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
              />
              <p className="text-xs text-muted-foreground mt-1">
                8-cijferig KvK-nummer
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-1.5">
                NIWO-nummer
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  (optioneel)
                </span>
              </label>
              <input
                type="text"
                value={niwoNumber}
                onChange={(e) => {
                  setNiwoNumber(e.target.value);
                  setSaved(false);
                }}
                placeholder="Alleen voor beroepsvervoerders"
                className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Eurovergunning — niet vereist voor eigen vervoerders
              </p>
            </div>
          </div>
        </div>

        {/* Kentekens Section */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">Voertuigen</h2>
                <p className="text-xs text-muted-foreground">
                  {kentekens.length}/10 kentekens geregistreerd
                </p>
              </div>
            </div>
            {canAddMore && (
              <button
                onClick={addKenteken}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-highlight hover:text-highlight/80"
              >
                <Plus className="h-4 w-4" />
                Toevoegen
              </button>
            )}
          </div>

          {kentekens.length === 0 && (
            <div className="text-center py-8 border border-dashed border-border rounded-lg">
              <Truck className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Nog geen voertuigen geregistreerd
              </p>
              <button
                onClick={addKenteken}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-highlight hover:text-highlight/80"
              >
                <Plus className="h-4 w-4" />
                Eerste kenteken toevoegen
              </button>
            </div>
          )}

          <div className="space-y-3">
            {kentekens.map((entry, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={entry.input}
                      onChange={(e) =>
                        updateKentekenInput(index, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") lookupKenteken(index);
                      }}
                      placeholder="XX-999-X"
                      className="w-full px-3 py-2.5 border border-border rounded-md text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight pr-10"
                    />
                    {entry.vehicle && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent" />
                    )}
                    {entry.error && (
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-danger" />
                    )}
                  </div>
                  <button
                    onClick={() => lookupKenteken(index)}
                    disabled={entry.loading || !entry.input}
                    className="px-3 py-2.5 bg-highlight text-white rounded-md text-sm font-semibold hover:bg-highlight/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {entry.loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    RDW
                  </button>
                  <button
                    onClick={() => removeKenteken(index)}
                    className="p-2.5 text-muted-foreground hover:text-danger rounded-md hover:bg-danger/5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {entry.error && (
                  <p className="text-xs text-danger flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {entry.error}
                  </p>
                )}

                {entry.vehicle && (
                  <div className="bg-background rounded-md p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 bg-yellow-100 border-2 border-yellow-400 rounded text-xs font-mono font-bold text-primary">
                        {formatKenteken(entry.vehicle.kenteken)}
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        {entry.vehicle.merk} {entry.vehicle.handelsbenaming}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wide text-muted-foreground/60">
                          Soort
                        </span>
                        {entry.vehicle.voertuigsoort}
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wide text-muted-foreground/60">
                          GVW
                        </span>
                        <span
                          className={
                            entry.vehicle.toegestane_maximum_massa_voertuig > 3500
                              ? "text-accent font-semibold"
                              : ""
                          }
                        >
                          {formatMassa(
                            entry.vehicle.toegestane_maximum_massa_voertuig
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wide text-muted-foreground/60">
                          Kleur
                        </span>
                        {entry.vehicle.eerste_kleur}
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wide text-muted-foreground/60">
                          APK tot
                        </span>
                        {formatDatum(entry.vehicle.vervaldatum_apk)}
                      </div>
                    </div>
                    {entry.vehicle.toegestane_maximum_massa_voertuig > 3500 && (
                      <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                        <Scale className="h-3 w-3" />
                        Vrachtwagenheffing-plichtig (&gt; 3,5t)
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Validation Summary */}
        <div className="card p-6 mb-6">
          <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" />
            Terugsluis-geschiktheid
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {kvkNumber.length === 8 ? (
                <CheckCircle2 className="h-4 w-4 text-accent" />
              ) : (
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={
                  kvkNumber.length === 8
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                KvK-nummer ingevuld
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {validVehicles.length > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-accent" />
              ) : (
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={
                  validVehicles.length > 0
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                Kentekens gevalideerd ({validVehicles.length})
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {heavyVehicles.length > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-accent" />
              ) : (
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={
                  heavyVehicles.length > 0
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                Voertuigen &gt; 3,5t ({heavyVehicles.length})
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {niwoNumber ? (
                <CheckCircle2 className="h-4 w-4 text-accent" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                  <span className="text-[8px] text-muted-foreground">—</span>
                </div>
              )}
              <span className="text-muted-foreground">
                NIWO-vergunning {niwoNumber ? "opgegeven" : "(optioneel)"}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Annuleren
          </Link>
          <button
            onClick={handleSave}
            disabled={kvkNumber.length !== 8 || validVehicles.length === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Opgeslagen
              </>
            ) : (
              "Opslaan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
