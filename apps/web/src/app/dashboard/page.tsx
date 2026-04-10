"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Wallet, ShoppingBag, Star, Heart, TrendingDown, TrendingUp,
  ArrowRight, Package, Truck, Building2, Scale, ShieldCheck,
  FileText, Upload, Clock, CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { getOrdersByBuyer } from "@/lib/data";

export default function ConsumerDashboard() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="bg-background min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Laden...</div></div>;
  }
  if (!isLoggedIn || !user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  const orders = getOrdersByBuyer(user.email);

  // Demo budget data
  const budget = {
    totalAllocated: 1500000,
    totalSpent: 348900,
    remaining: 1151100,
  };
  const percentSpent = Math.round((budget.totalSpent / budget.totalAllocated) * 100);
  const formatEur = (c: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(c / 100);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">
            Welkom, {user.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user.organization} — Vervoerder Dashboard
          </p>
        </div>

        {/* Budget card */}
        <div className="bg-primary rounded-xl p-6 sm:p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-white/60">Terugsluis-budget 2026</p>
              <p className="text-2xl sm:text-3xl font-extrabold">{formatEur(budget.remaining)}</p>
            </div>
          </div>
          <div className="w-full bg-white/15 rounded-full h-2.5 mb-2">
            <div
              className="bg-accent rounded-full h-2.5"
              style={{ width: `${percentSpent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/50">
            <span>{percentSpent}% besteed</span>
            <span>Totaal: {formatEur(budget.totalAllocated)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Besteed", value: formatEur(budget.totalSpent), icon: TrendingDown, color: "text-danger" },
            { label: "Beschikbaar", value: formatEur(budget.remaining), icon: TrendingUp, color: "text-accent" },
            { label: "Bestellingen", value: String(orders.length), icon: ShoppingBag, color: "text-highlight" },
            { label: "Beoordelingen", value: "0", icon: Star, color: "text-warning" },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 text-center">
              <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Company & Vehicles */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-primary">
                  {user.organization}
                </h2>
                <p className="text-xs text-muted-foreground">
                  KvK: {user.kvkNumber}
                  {user.niwoNumber ? ` — NIWO: ${user.niwoNumber}` : ""}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/bedrijf"
              className="text-xs font-semibold text-highlight hover:text-highlight/80 flex items-center gap-1"
            >
              Beheren
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {user.vehicles && user.vehicles.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Truck className="h-4 w-4 text-accent" />
                <span className="text-xs font-semibold text-primary">
                  {user.vehicles.length} voertuig{user.vehicles.length !== 1 ? "en" : ""} geregistreerd
                </span>
                {user.vehicles.filter((v) => v.toegestane_maximum_massa_voertuig > 3500).length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    <Scale className="h-2.5 w-2.5" />
                    {user.vehicles.filter((v) => v.toegestane_maximum_massa_voertuig > 3500).length}x &gt; 3,5t
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {user.vehicles.slice(0, 6).map((v) => (
                  <div
                    key={v.kenteken}
                    className="flex items-center gap-2 bg-background rounded-md px-3 py-2"
                  >
                    <span className="inline-flex items-center px-1.5 py-0.5 bg-yellow-100 border border-yellow-400 rounded text-[10px] font-mono font-bold text-primary">
                      {v.kenteken}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {v.merk} {v.handelsbenaming}
                    </span>
                  </div>
                ))}
              </div>
              {user.vehicles.length > 6 && (
                <p className="text-xs text-muted-foreground mt-2">
                  + {user.vehicles.length - 6} meer...
                </p>
              )}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-accent font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                Terugsluis-geschikt
              </div>
            </>
          ) : (
            <div className="text-center py-4 border border-dashed border-border rounded-lg">
              <Truck className="h-6 w-6 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-xs text-muted-foreground">
                Geen voertuigen geregistreerd
              </p>
              <Link
                href="/dashboard/bedrijf"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-highlight hover:text-highlight/80"
              >
                Voertuigen registreren
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-highlight/10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-highlight" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-primary">Recente bestellingen</h2>
                <p className="text-xs text-muted-foreground">
                  {orders.length} bestelling{orders.length !== 1 ? "en" : ""}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/bestellingen"
              className="text-xs font-semibold text-highlight hover:text-highlight/80 flex items-center gap-1"
            >
              Alles bekijken
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-4 border border-dashed border-border rounded-lg">
              <Package className="h-6 w-6 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-xs text-muted-foreground">Nog geen bestellingen</p>
              <Link
                href="/products"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-highlight hover:text-highlight/80"
              >
                Producten bekijken
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 3).map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/bestellingen/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-highlight/5 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-white border border-border flex items-center justify-center shrink-0">
                      {order.invoice ? (
                        order.invoice.status === "UITBETAALD" ? (
                          <CheckCircle2 className="h-4 w-4 text-accent" />
                        ) : order.invoice.status === "AFGEWEZEN" ? (
                          <FileText className="h-4 w-4 text-danger" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-500" />
                        )
                      ) : order.status === "COMPLETED" ? (
                        <Upload className="h-4 w-4 text-highlight" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-primary truncate group-hover:text-highlight transition-colors">
                        {order.listingTitle}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {order.supplierOrgName} — {order.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-xs font-bold text-primary">
                      {new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(order.totalInCents / 100)}
                    </p>
                    {order.invoice && (
                      <span className={`text-[10px] font-semibold ${
                        order.invoice.status === "UITBETAALD" ? "text-accent" :
                        order.invoice.status === "AFGEWEZEN" ? "text-danger" :
                        "text-amber-600"
                      }`}>
                        {({ INGEDIEND: "Ingediend", IN_BEHANDELING: "In behandeling", GOEDGEKEURD: "Goedgekeurd", UITBETAALD: "Uitbetaald", AFGEWEZEN: "Afgewezen" } as Record<string, string>)[order.invoice.status]}
                      </span>
                    )}
                    {!order.invoice && order.status === "COMPLETED" && (
                      <span className="text-[10px] font-semibold text-highlight">Upload factuur</span>
                    )}
                  </div>
                </Link>
              ))}
              {orders.length > 3 && (
                <Link
                  href="/dashboard/bestellingen"
                  className="block text-center py-2 text-xs font-semibold text-highlight hover:text-highlight/80"
                >
                  + {orders.length - 3} meer bekijken
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/products" className="card p-5 flex items-center gap-4 hover:border-highlight/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-highlight/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-highlight" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary group-hover:text-highlight transition-colors">Producten zoeken</p>
              <p className="text-xs text-muted-foreground">Vind IT-oplossingen</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link href="/dashboard/bestellingen" className="card p-5 flex items-center gap-4 hover:border-highlight/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary group-hover:text-highlight transition-colors">Bestellingen</p>
              <p className="text-xs text-muted-foreground">Beheer & facturen</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link href="/products" className="card p-5 flex items-center gap-4 hover:border-highlight/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary group-hover:text-highlight transition-colors">Beoordelingen</p>
              <p className="text-xs text-muted-foreground">Uw reviews</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}
