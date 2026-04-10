"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Package, Eye, MousePointerClick, Star, MessageSquare,
  Plus, ArrowRight, BarChart3, ShoppingBag, Clock,
  CheckCircle2, ShieldCheck, AlertTriangle, Euro, FileText,
  XCircle, Truck,
} from "lucide-react";
import Link from "next/link";
import { getSupplierListings, getOrdersBySupplier } from "@/lib/data";

export default function SupplierDashboard() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="bg-background min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Laden...</div></div>;
  }
  if (!isLoggedIn || !user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  // Redirect to onboarding if not started or in progress
  const status = user.onboardingStatus;
  if (!status || status === "NOT_STARTED" || status === "IN_PROGRESS") {
    if (typeof window !== "undefined") router.push("/supplier/onboarding");
    return null;
  }

  // Get listings and orders for Transtics (demo supplier)
  const listings = getSupplierListings("org-transtics");
  const supplierOrders = getOrdersBySupplier("org-transtics");

  const formatEur = (c: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(c / 100);
  const totalRevenue = supplierOrders
    .filter((o) => o.status === "COMPLETED" || o.status === "CONFIRMED")
    .reduce((sum, o) => sum + o.totalInCents, 0);

  const isPending = status === "PENDING_REVIEW";
  const isRejected = status === "REJECTED";

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pending review banner */}
        {isPending && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                Registratie in afwachting van goedkeuring
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Uw registratie wordt beoordeeld door Connekt / Logistiek Digitaal.
                Producten aanmaken is mogelijk na goedkeuring.
              </p>
            </div>
            <Link
              href="/supplier/onboarding"
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 shrink-0"
            >
              Bekijk status
            </Link>
          </div>
        )}

        {/* Rejected banner */}
        {isRejected && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-danger mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">
                Registratie afgewezen
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                Uw registratie is afgewezen. Pas uw gegevens aan en dien opnieuw in.
              </p>
            </div>
            <Link
              href="/supplier/onboarding"
              className="text-xs font-semibold text-red-700 hover:text-red-900 shrink-0"
            >
              Aanpassen
            </Link>
          </div>
        )}

        {/* Approved badge */}
        {status === "APPROVED" && (
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 mb-6 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span className="text-xs font-semibold text-accent">
              Geverifieerd door Logistiek Digitaal
            </span>
          </div>
        )}

        {/* Welcome */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Welkom, {user.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {user.organization} — Leverancier Dashboard
            </p>
          </div>
          {status === "APPROVED" ? (
            <Link href="/supplier/nieuw-product" className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="h-4 w-4" />
              Nieuw product
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-background border border-border px-3 py-2 rounded-md cursor-not-allowed">
              <Plus className="h-3.5 w-3.5" />
              Nieuw product
              <span className="text-[10px] text-amber-600">(na goedkeuring)</span>
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Producten", value: listings.length.toString(), icon: Package, color: "text-highlight" },
            { label: "Bestellingen", value: supplierOrders.length.toString(), icon: ShoppingBag, color: "text-accent" },
            { label: "Omzet", value: formatEur(totalRevenue), icon: Euro, color: "text-accent" },
            { label: "Impressies", value: "1.247", icon: Eye, color: "text-primary" },
            { label: "Gem. beoordeling", value: "4.5", icon: Star, color: "text-warning" },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 text-center">
              <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-primary">Uw producten</h2>
            </div>
            <div className="space-y-3">
              {listings.map((listing) => (
                <div key={listing.id} className="card p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-highlight/10 rounded-lg flex items-center justify-center text-highlight font-bold">
                    {listing.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary truncate">{listing.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent-dark">
                        Gepubliceerd
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ★ {listing.averageRating?.toFixed(1)} ({listing.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">Impressies</p>
                    <p className="text-sm font-bold text-primary">1.247</p>
                  </div>
                </div>
              ))}

              {listings.length === 0 && (
                <div className="card p-8 text-center">
                  <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    U heeft nog geen producten. Maak uw eerste listing aan.
                  </p>
                  <Link href="/supplier/nieuw-product" className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
                    <Plus className="h-4 w-4" />
                    Nieuw product
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Incoming orders */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-primary">Bestellingen</h3>
                <span className="text-[10px] font-semibold text-muted-foreground bg-background px-2 py-0.5 rounded-full">
                  {supplierOrders.length} totaal
                </span>
              </div>
              <div className="space-y-2">
                {supplierOrders.slice(0, 5).map((order) => {
                  const statusLabel: Record<string, string> = {
                    PENDING: "In afwachting",
                    CONFIRMED: "Bevestigd",
                    IN_PROGRESS: "In uitvoering",
                    COMPLETED: "Afgerond",
                    CANCELLED: "Geannuleerd",
                  };
                  const statusColor: Record<string, string> = {
                    PENDING: "text-amber-600",
                    CONFIRMED: "text-highlight",
                    IN_PROGRESS: "text-highlight",
                    COMPLETED: "text-accent",
                    CANCELLED: "text-danger",
                  };
                  return (
                    <div key={order.id} className="flex items-center gap-3 p-2 rounded-md bg-background">
                      <div className="w-7 h-7 rounded-md bg-white border border-border flex items-center justify-center shrink-0">
                        <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary truncate">{order.buyerOrgName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{order.listingTitle}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-primary">{formatEur(order.totalInCents)}</p>
                        <p className={`text-[10px] font-semibold ${statusColor[order.status] ?? "text-muted-foreground"}`}>
                          {statusLabel[order.status] ?? order.status}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {supplierOrders.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-3">Nog geen bestellingen</p>
                )}
              </div>
            </div>

            {/* Invoice status for supplier orders */}
            {supplierOrders.some((o) => o.invoice) && (
              <div className="card p-5">
                <h3 className="text-sm font-bold text-primary mb-3">Factuurstatus klanten</h3>
                <div className="space-y-2">
                  {supplierOrders.filter((o) => o.invoice).map((order) => {
                    const inv = order.invoice!;
                    const invStatusLabel: Record<string, string> = {
                      INGEDIEND: "Ingediend",
                      IN_BEHANDELING: "In behandeling",
                      GOEDGEKEURD: "Goedgekeurd",
                      UITBETAALD: "Uitbetaald",
                      AFGEWEZEN: "Afgewezen",
                    };
                    const invStatusColor: Record<string, string> = {
                      INGEDIEND: "text-amber-600 bg-amber-50",
                      IN_BEHANDELING: "text-highlight bg-highlight/10",
                      GOEDGEKEURD: "text-accent bg-accent/10",
                      UITBETAALD: "text-accent bg-accent/10",
                      AFGEWEZEN: "text-danger bg-danger/10",
                    };
                    return (
                      <div key={order.id} className="flex items-center gap-3 p-2 rounded-md bg-background">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-primary truncate">{order.buyerOrgName}</p>
                          <p className="text-[10px] text-muted-foreground">{inv.invoiceNumber}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${invStatusColor[inv.status] ?? ""}`}>
                          {invStatusLabel[inv.status] ?? inv.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick links */}
            <div className="card p-5">
              <h3 className="text-sm font-bold text-primary mb-3">Snelle acties</h3>
              <div className="space-y-2">
                <Link href="/supplier/analytics" className="w-full flex items-center gap-3 text-left text-sm text-primary hover:text-highlight p-2 rounded-md hover:bg-background transition-colors">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  Bekijk analytics
                </Link>
                <Link href="/supplier/reviews" className="w-full flex items-center gap-3 text-left text-sm text-primary hover:text-highlight p-2 rounded-md hover:bg-background transition-colors">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Reageer op reviews
                </Link>
                <Link
                  href="/supplier/listings"
                  className="w-full flex items-center gap-3 text-left text-sm text-primary hover:text-highlight p-2 rounded-md hover:bg-background transition-colors"
                >
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  Bekijk uw listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
