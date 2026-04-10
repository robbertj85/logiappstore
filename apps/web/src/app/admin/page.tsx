"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getAllOrders, getInvoiceStats, getOrdersWithInvoices, getConsumerBudgetStats } from "@/lib/data";
import type { OrderWithInvoice, ConsumerBudgetStats } from "@/lib/data";
import Link from "next/link";
import { useState } from "react";
import {
  FileText, Euro, Clock, CheckCircle2, XCircle, AlertCircle,
  ArrowRight, TrendingUp, Building2, Search, Filter, Eye,
  CreditCard, BarChart3, Users, ShieldCheck, Truck, Wallet,
} from "lucide-react";

const invoiceStatusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  INGEDIEND: { label: "Ingediend", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
  IN_BEHANDELING: { label: "In behandeling", color: "text-highlight", bgColor: "bg-highlight/10 border-highlight/20" },
  GOEDGEKEURD: { label: "Goedgekeurd", color: "text-accent-dark", bgColor: "bg-accent/10 border-accent/20" },
  UITBETAALD: { label: "Uitbetaald", color: "text-accent-dark", bgColor: "bg-accent/10 border-accent/20" },
  AFGEWEZEN: { label: "Afgewezen", color: "text-danger", bgColor: "bg-danger/10 border-danger/20" },
};

export default function AdminDashboard() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return <div className="bg-background min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Laden...</div></div>;
  }
  if (!isLoggedIn || !user || user.role !== "ADMIN") {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  const allOrders = getAllOrders();
  const stats = getInvoiceStats();
  const ordersWithInvoices = getOrdersWithInvoices();
  const consumerStats = getConsumerBudgetStats();

  const formatEur = (c: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(c / 100);

  // Filter invoices
  let filteredOrders = ordersWithInvoices;
  if (statusFilter !== "ALL") {
    filteredOrders = filteredOrders.filter((o) => o.invoice?.status === statusFilter);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredOrders = filteredOrders.filter(
      (o) =>
        o.buyerOrgName.toLowerCase().includes(q) ||
        o.supplierOrgName.toLowerCase().includes(q) ||
        o.listingTitle.toLowerCase().includes(q) ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.invoice?.invoiceNumber.toLowerCase().includes(q)
    );
  }

  // Count orders needing attention (INGEDIEND + IN_BEHANDELING)
  const needsAttention = stats.ingediend + stats.inBehandeling;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Beheerdersdashboard</h1>
              <p className="text-sm text-muted-foreground">
                Connekt / Logistiek Digitaal — Terugsluis Factuurbeheer
              </p>
            </div>
          </div>
          <Link
            href="/admin/terugsluis"
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <CreditCard className="h-4 w-4" />
            Budgetbeheer
          </Link>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="card p-4">
            <FileText className="h-5 w-5 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold text-primary">{stats.totalSubmitted}</p>
            <p className="text-xs text-muted-foreground">Facturen totaal</p>
          </div>
          <div className="card p-4 border-amber-200 bg-amber-50/50">
            <AlertCircle className="h-5 w-5 text-amber-600 mb-2" />
            <p className="text-2xl font-bold text-amber-700">{needsAttention}</p>
            <p className="text-xs text-amber-600">Actie vereist</p>
          </div>
          <div className="card p-4">
            <CheckCircle2 className="h-5 w-5 text-accent mb-2" />
            <p className="text-2xl font-bold text-primary">{stats.goedgekeurd}</p>
            <p className="text-xs text-muted-foreground">Goedgekeurd</p>
          </div>
          <div className="card p-4">
            <Euro className="h-5 w-5 text-accent mb-2" />
            <p className="text-2xl font-bold text-accent">{stats.uitbetaald}</p>
            <p className="text-xs text-muted-foreground">Uitbetaald</p>
          </div>
          <div className="card p-4">
            <XCircle className="h-5 w-5 text-danger mb-2" />
            <p className="text-2xl font-bold text-danger">{stats.afgewezen}</p>
            <p className="text-xs text-muted-foreground">Afgewezen</p>
          </div>
          <div className="card p-4">
            <CreditCard className="h-5 w-5 text-highlight mb-2" />
            <p className="text-2xl font-bold text-primary">{formatEur(stats.paidAmountInCents)}</p>
            <p className="text-xs text-muted-foreground">Totaal uitbetaald</p>
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="h-5 w-5 text-highlight" />
              <h3 className="text-sm font-bold text-primary">Financieel overzicht</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Totaal ingediend</span>
                <span className="font-semibold text-primary">{formatEur(stats.totalAmountInCents)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uitbetaald</span>
                <span className="font-semibold text-accent">{formatEur(stats.paidAmountInCents)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Openstaand</span>
                <span className="font-semibold text-amber-600">{formatEur(stats.totalAmountInCents - stats.paidAmountInCents)}</span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-bold text-primary">Betalingstijdigheid</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Op tijd betaald</span>
                <span className="font-semibold text-accent">{stats.paidOnTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Te laat betaald</span>
                <span className="font-semibold text-danger">{stats.paidLate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Percentage op tijd</span>
                <span className="font-semibold text-primary">
                  {stats.paidOnTime + stats.paidLate > 0
                    ? Math.round((stats.paidOnTime / (stats.paidOnTime + stats.paidLate)) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold text-primary">Platformactiviteit</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Totaal bestellingen</span>
                <span className="font-semibold text-primary">{allOrders.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unieke vervoerders</span>
                <span className="font-semibold text-primary">
                  {new Set(allOrders.map((o) => o.buyerKvk)).size}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unieke leveranciers</span>
                <span className="font-semibold text-primary">
                  {new Set(allOrders.map((o) => o.supplierOrgId)).size}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Consumer Terugsluis budget overview */}
        <div className="card mb-8">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-bold text-primary">Terugsluis-budget per vervoerder</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Vervoerder</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Budget</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Besteld</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Uitbetaald</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">In behandeling</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Resterend</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Besteed %</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Orders</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Facturen</th>
                </tr>
              </thead>
              <tbody>
                {consumerStats.map((cs) => {
                  const remaining = cs.budgetAllocated - cs.paidAmountInCents - cs.pendingAmountInCents;
                  const percentUsed = Math.round(((cs.paidAmountInCents + cs.pendingAmountInCents) / cs.budgetAllocated) * 100);
                  return (
                    <tr key={cs.buyerKvk} className="border-b border-border hover:bg-background/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                            <Truck className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-primary">{cs.buyerOrgName}</p>
                            <p className="text-[11px] text-muted-foreground">KvK: {cs.buyerKvk} — {cs.buyerContact}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <p className="text-sm font-semibold text-primary">{formatEur(cs.budgetAllocated)}</p>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <p className="text-sm text-primary">{formatEur(cs.totalOrderedInCents)}</p>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <p className="text-sm font-semibold text-accent">{formatEur(cs.paidAmountInCents)}</p>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <p className="text-sm text-amber-600">
                          {cs.pendingAmountInCents > 0 ? formatEur(cs.pendingAmountInCents) : "—"}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <p className={`text-sm font-semibold ${remaining > 0 ? "text-primary" : "text-danger"}`}>
                          {formatEur(remaining)}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-xs font-bold ${percentUsed >= 80 ? "text-danger" : percentUsed >= 50 ? "text-amber-600" : "text-accent"}`}>
                            {percentUsed}%
                          </span>
                          <div className="w-16 bg-border rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${percentUsed >= 80 ? "bg-danger" : percentUsed >= 50 ? "bg-amber-500" : "bg-accent"}`}
                              style={{ width: `${Math.min(percentUsed, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className="text-sm text-primary">{cs.totalOrders}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-sm text-primary">{cs.invoicesSubmitted}</span>
                          {cs.rejectedCount > 0 && (
                            <span className="text-[10px] font-semibold text-danger bg-danger/10 px-1.5 py-0.5 rounded-full">
                              {cs.rejectedCount} afgewezen
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice table */}
        <div className="card">
          <div className="p-5 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-primary">Alle facturen</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Zoeken..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight w-56"
                  />
                </div>
                <div className="relative">
                  <Filter className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-9 pr-8 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight appearance-none bg-white"
                  >
                    <option value="ALL">Alle statussen</option>
                    <option value="INGEDIEND">Ingediend</option>
                    <option value="IN_BEHANDELING">In behandeling</option>
                    <option value="GOEDGEKEURD">Goedgekeurd</option>
                    <option value="UITBETAALD">Uitbetaald</option>
                    <option value="AFGEWEZEN">Afgewezen</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Factuur</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Vervoerder</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Product</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Leverancier</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">Bedrag</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">Ingediend</th>
                  <th className="text-center text-xs font-semibold text-muted-foreground px-5 py-3">Op tijd</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <InvoiceRow key={order.id} order={order} formatEur={formatEur} />
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Geen facturen gevonden</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InvoiceRow({ order, formatEur }: { order: OrderWithInvoice; formatEur: (c: number) => string }) {
  if (!order.invoice) return null;
  const config = invoiceStatusConfig[order.invoice.status];

  return (
    <tr className="border-b border-border hover:bg-background/50 transition-colors">
      <td className="px-5 py-3">
        <p className="text-sm font-semibold text-primary">{order.invoice.invoiceNumber}</p>
        <p className="text-[11px] text-muted-foreground">{order.orderNumber}</p>
      </td>
      <td className="px-5 py-3">
        <p className="text-sm text-primary">{order.buyerOrgName}</p>
        <p className="text-[11px] text-muted-foreground">{order.buyerContact}</p>
      </td>
      <td className="px-5 py-3">
        <p className="text-sm text-primary truncate max-w-[180px]">{order.listingTitle}</p>
      </td>
      <td className="px-5 py-3">
        <p className="text-sm text-primary">{order.supplierOrgName}</p>
      </td>
      <td className="px-5 py-3 text-right">
        <p className="text-sm font-semibold text-primary">{formatEur(order.invoice.amountInCents)}</p>
      </td>
      <td className="px-5 py-3">
        <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border ${config?.bgColor ?? ""} ${config?.color ?? ""}`}>
          {config?.label ?? order.invoice.status}
        </span>
      </td>
      <td className="px-5 py-3">
        <p className="text-sm text-muted-foreground">{order.invoice.uploadedAt}</p>
      </td>
      <td className="px-5 py-3 text-center">
        {order.invoice.paidOnTime === true && (
          <CheckCircle2 className="h-4 w-4 text-accent mx-auto" />
        )}
        {order.invoice.paidOnTime === false && (
          <AlertCircle className="h-4 w-4 text-danger mx-auto" />
        )}
        {order.invoice.paidOnTime === null && (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-5 py-3 text-right">
        <Link
          href={`/admin/facturen/${order.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-highlight hover:text-highlight/80"
        >
          <Eye className="h-3.5 w-3.5" />
          Details
        </Link>
      </td>
    </tr>
  );
}
