"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getOrdersByBuyer } from "@/lib/data";
import type { OrderWithInvoice } from "@/lib/data";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Package, Clock, CheckCircle2,
  XCircle, FileText, Upload, AlertCircle,
} from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: "In afwachting", color: "text-amber-600 bg-amber-50", icon: Clock },
  CONFIRMED: { label: "Bevestigd", color: "text-highlight bg-highlight/10", icon: CheckCircle2 },
  IN_PROGRESS: { label: "In uitvoering", color: "text-highlight bg-highlight/10", icon: Package },
  COMPLETED: { label: "Afgerond", color: "text-accent bg-accent/10", icon: CheckCircle2 },
  CANCELLED: { label: "Geannuleerd", color: "text-danger bg-danger/10", icon: XCircle },
};

const invoiceStatusConfig: Record<string, { label: string; color: string }> = {
  INGEDIEND: { label: "Ingediend", color: "text-amber-600 bg-amber-50" },
  IN_BEHANDELING: { label: "In behandeling", color: "text-highlight bg-highlight/10" },
  GOEDGEKEURD: { label: "Goedgekeurd", color: "text-accent bg-accent/10" },
  UITBETAALD: { label: "Uitbetaald", color: "text-accent bg-accent/10" },
  AFGEWEZEN: { label: "Afgewezen", color: "text-danger bg-danger/10" },
};

export default function BestellingenPage() {
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
  const formatEur = (c: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(c / 100);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">Mijn Bestellingen</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Beheer uw aanvragen en upload facturen voor Terugsluis-vergoeding
            </p>
          </div>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            <Package className="h-4 w-4" />
            Nieuw product aanvragen
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="card p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-bold text-primary mb-2">Nog geen bestellingen</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Zoek een product en vraag het aan om uw eerste bestelling te plaatsen.
            </p>
            <Link href="/products" className="btn-primary inline-flex items-center gap-2">
              Producten bekijken
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} formatEur={formatEur} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, formatEur }: { order: OrderWithInvoice; formatEur: (c: number) => string }) {
  const status = statusConfig[order.status] ?? statusConfig.PENDING;
  const StatusIcon = status.icon;

  return (
    <Link href={`/dashboard/bestellingen/${order.id}`} className="block">
      <div className="card p-5 hover:border-highlight/30 hover:shadow-md transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-bold text-primary truncate">{order.listingTitle}</h3>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Leverancier: <strong className="text-primary">{order.supplierOrgName}</strong></span>
              <span>Besteldatum: {order.createdAt}</span>
              <span>Order: {order.orderNumber}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-primary">{formatEur(order.totalInCents)}</p>
            {order.terugsluisEligible && (
              <span className="text-[10px] font-semibold text-accent">Terugsluis</span>
            )}
          </div>
        </div>

        {/* Invoice status bar */}
        <div className="mt-4 pt-3 border-t border-border">
          {order.status === "COMPLETED" && !order.invoice && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600">
                <Upload className="h-4 w-4" />
                <span className="text-xs font-semibold">Factuur uploaden voor vergoeding</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          {order.invoice && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-xs text-muted-foreground">Factuur {order.invoice.invoiceNumber}</span>
                  <span className={`ml-2 inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${invoiceStatusConfig[order.invoice.status]?.color ?? ""}`}>
                    {invoiceStatusConfig[order.invoice.status]?.label ?? order.invoice.status}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          {order.invoice?.status === "AFGEWEZEN" && order.invoice.rejectionReason && (
            <div className="mt-2 flex items-start gap-2 bg-danger/5 rounded-md p-2">
              <AlertCircle className="h-3.5 w-3.5 text-danger shrink-0 mt-0.5" />
              <span className="text-xs text-danger">{order.invoice.rejectionReason}</span>
            </div>
          )}
          {!order.invoice && order.status !== "COMPLETED" && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs">Factuur uploaden mogelijk na afronding bestelling</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
