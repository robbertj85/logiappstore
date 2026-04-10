"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getOrderById } from "@/lib/data";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft, FileText, CheckCircle2, XCircle, Clock,
  Building2, Euro, AlertCircle, ShieldCheck, User,
  CreditCard, CircleDot, Check, Download, Send,
} from "lucide-react";

export default function AdminInvoiceDetailPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [actionTaken, setActionTaken] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [notes, setNotes] = useState("");

  if (isLoading) {
    return <div className="bg-background min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Laden...</div></div>;
  }
  if (!isLoggedIn || !user || user.role !== "ADMIN") {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  const order = getOrderById(orderId);
  if (!order || !order.invoice) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="card p-8 text-center">
          <p className="text-muted-foreground">Factuur niet gevonden</p>
          <Link href="/admin" className="btn-primary mt-4 inline-block">
            Terug naar dashboard
          </Link>
        </div>
      </div>
    );
  }

  const invoice = order.invoice;
  const formatEur = (c: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(c / 100);

  const canApprove = invoice.status === "INGEDIEND" || invoice.status === "IN_BEHANDELING";
  const canPay = invoice.status === "GOEDGEKEURD";

  const statusTimeline = [
    {
      label: "Factuur ingediend",
      date: invoice.uploadedAt,
      done: true,
      icon: FileText,
    },
    {
      label: "In behandeling genomen",
      date: invoice.status !== "INGEDIEND" ? invoice.reviewedAt ?? "—" : null,
      done: invoice.status !== "INGEDIEND",
      icon: Clock,
    },
    {
      label: invoice.status === "AFGEWEZEN" ? "Afgewezen" : "Goedgekeurd",
      date: invoice.status === "AFGEWEZEN" || invoice.status === "GOEDGEKEURD" || invoice.status === "UITBETAALD" ? invoice.reviewedAt ?? "—" : null,
      done: invoice.status === "GOEDGEKEURD" || invoice.status === "UITBETAALD" || invoice.status === "AFGEWEZEN",
      icon: invoice.status === "AFGEWEZEN" ? XCircle : CheckCircle2,
      danger: invoice.status === "AFGEWEZEN",
    },
    {
      label: "Uitbetaald",
      date: invoice.paidAt,
      done: invoice.status === "UITBETAALD",
      icon: Euro,
    },
  ];

  const handleApprove = () => setActionTaken("GOEDGEKEURD");
  const handleReject = () => {
    if (rejectionReason.trim()) {
      setActionTaken("AFGEWEZEN");
      setShowRejectForm(false);
    }
  };
  const handlePay = () => setActionTaken("UITBETAALD");

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar dashboard
        </Link>

        {/* Header */}
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-primary">Factuur {invoice.invoiceNumber}</h1>
                <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  actionTaken
                    ? actionTaken === "GOEDGEKEURD"
                      ? "bg-accent/10 border-accent/20 text-accent-dark"
                      : actionTaken === "AFGEWEZEN"
                      ? "bg-danger/10 border-danger/20 text-danger"
                      : "bg-accent/10 border-accent/20 text-accent-dark"
                    : invoice.status === "INGEDIEND"
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : invoice.status === "IN_BEHANDELING"
                    ? "bg-highlight/10 border-highlight/20 text-highlight"
                    : invoice.status === "GOEDGEKEURD"
                    ? "bg-accent/10 border-accent/20 text-accent-dark"
                    : invoice.status === "UITBETAALD"
                    ? "bg-accent/10 border-accent/20 text-accent-dark"
                    : "bg-danger/10 border-danger/20 text-danger"
                }`}>
                  {actionTaken
                    ? actionTaken === "GOEDGEKEURD" ? "Goedgekeurd" : actionTaken === "AFGEWEZEN" ? "Afgewezen" : "Uitbetaald"
                    : ({ INGEDIEND: "Ingediend", IN_BEHANDELING: "In behandeling", GOEDGEKEURD: "Goedgekeurd", UITBETAALD: "Uitbetaald", AFGEWEZEN: "Afgewezen" } as Record<string, string>)[invoice.status]
                  }
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Order {order.orderNumber} — {order.listingTitle}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{formatEur(invoice.amountInCents)}</p>
              <p className="text-xs text-muted-foreground">Factuurbedrag</p>
            </div>
          </div>
        </div>

        {actionTaken && (
          <div className={`mb-6 rounded-lg p-4 border ${
            actionTaken === "AFGEWEZEN"
              ? "bg-danger/5 border-danger/20"
              : "bg-accent/5 border-accent/20"
          }`}>
            <div className="flex items-center gap-2">
              {actionTaken === "AFGEWEZEN" ? (
                <XCircle className="h-5 w-5 text-danger" />
              ) : actionTaken === "UITBETAALD" ? (
                <Euro className="h-5 w-5 text-accent" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-accent" />
              )}
              <p className={`text-sm font-semibold ${actionTaken === "AFGEWEZEN" ? "text-danger" : "text-accent-dark"}`}>
                {actionTaken === "GOEDGEKEURD" && "Factuur is goedgekeurd. De uitbetaling wordt verwerkt in de eerstvolgende betalingscyclus."}
                {actionTaken === "AFGEWEZEN" && "Factuur is afgewezen. De vervoerder wordt hiervan op de hoogte gesteld."}
                {actionTaken === "UITBETAALD" && "Uitbetaling is verwerkt. Het bedrag is overgemaakt naar de vervoerder."}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <div className="card p-6">
              <h2 className="text-sm font-bold text-primary mb-5">Verwerkingsstatus</h2>
              <div className="space-y-0">
                {statusTimeline.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        step.done
                          ? step.danger
                            ? "bg-danger text-white"
                            : "bg-accent text-white"
                          : "bg-background border border-border text-muted-foreground"
                      }`}>
                        <step.icon className="h-4 w-4" />
                      </div>
                      {i < statusTimeline.length - 1 && (
                        <div className={`w-0.5 h-8 ${step.done ? (step.danger ? "bg-danger/30" : "bg-accent/30") : "bg-border"}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-semibold ${step.done ? (step.danger ? "text-danger" : "text-primary") : "text-muted-foreground"}`}>
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-xs text-muted-foreground">{step.date}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice document */}
            <div className="card p-6">
              <h2 className="text-sm font-bold text-primary mb-4">Factuurgegevens</h2>
              <div className="bg-background rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-danger/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-danger" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-primary">{invoice.fileName}</p>
                    <p className="text-xs text-muted-foreground">PDF document</p>
                  </div>
                  <button className="btn-secondary inline-flex items-center gap-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    Downloaden
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Factuurnummer</p>
                    <p className="text-sm font-semibold text-primary">{invoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Factuurbedrag</p>
                    <p className="text-sm font-semibold text-primary">{formatEur(invoice.amountInCents)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bestelbedrag</p>
                    <p className="text-sm font-semibold text-primary">{formatEur(order.totalInCents)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Verschil</p>
                    <p className={`text-sm font-semibold ${
                      invoice.amountInCents === order.totalInCents ? "text-accent" : "text-danger"
                    }`}>
                      {invoice.amountInCents === order.totalInCents
                        ? "Geen verschil"
                        : formatEur(invoice.amountInCents - order.totalInCents)
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Rejection reason */}
              {invoice.status === "AFGEWEZEN" && invoice.rejectionReason && (
                <div className="mt-4 bg-danger/5 border border-danger/20 rounded-lg p-4">
                  <p className="text-xs font-semibold text-danger mb-1">Reden van afwijzing</p>
                  <p className="text-sm text-danger/80">{invoice.rejectionReason}</p>
                </div>
              )}

              {/* Notes */}
              {invoice.notes && (
                <div className="mt-4 bg-highlight/5 border border-highlight/20 rounded-lg p-4">
                  <p className="text-xs font-semibold text-highlight mb-1">Opmerkingen</p>
                  <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                </div>
              )}

              {/* Payment info */}
              {invoice.paidAt && (
                <div className="mt-4 bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Euro className="h-4 w-4 text-accent" />
                    <p className="text-xs font-semibold text-accent-dark">Betalingsinformatie</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Uitbetaald op</p>
                      <p className="text-sm text-primary">{invoice.paidAt}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Op tijd betaald</p>
                      <p className={`text-sm font-semibold ${invoice.paidOnTime ? "text-accent" : "text-danger"}`}>
                        {invoice.paidOnTime ? "Ja" : "Nee — te laat"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action panel */}
            {!actionTaken && (canApprove || canPay) && (
              <div className="card p-6">
                <h2 className="text-sm font-bold text-primary mb-4">Acties</h2>

                {canApprove && !showRejectForm && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1.5">Interne notitie (optioneel)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Voeg een interne notitie toe..."
                        className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight resize-none h-20"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleApprove}
                        className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Goedkeuren
                      </button>
                      <button
                        onClick={() => setShowRejectForm(true)}
                        className="flex-1 bg-white border border-danger text-danger hover:bg-danger/5 font-semibold px-6 py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        Afwijzen
                      </button>
                    </div>
                  </div>
                )}

                {showRejectForm && (
                  <div className="space-y-4">
                    <div className="bg-danger/5 border border-danger/20 rounded-lg p-4">
                      <p className="text-sm font-semibold text-danger mb-3">Factuur afwijzen</p>
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1.5">
                          Reden van afwijzing *
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Geef een duidelijke reden voor afwijzing..."
                          className="w-full border border-danger/30 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-danger/30 focus:border-danger resize-none h-24"
                        />
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={handleReject}
                          disabled={!rejectionReason.trim()}
                          className="flex-1 bg-danger hover:bg-danger/90 text-white font-semibold px-6 py-3 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Bevestig afwijzing
                        </button>
                        <button
                          onClick={() => setShowRejectForm(false)}
                          className="flex-1 btn-secondary"
                        >
                          Annuleren
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {canPay && (
                  <div className="space-y-4">
                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-4 w-4 text-accent" />
                        <p className="text-sm font-semibold text-accent-dark">Klaar voor uitbetaling</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Deze factuur is goedgekeurd en kan worden uitbetaald aan {order.buyerOrgName}.
                      </p>
                    </div>
                    <button
                      onClick={handlePay}
                      className="w-full bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                      <Euro className="h-4 w-4" />
                      Uitbetaling verwerken — {formatEur(invoice.amountInCents)}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Buyer info */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-primary mb-4">Vervoerder</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">{order.buyerOrgName}</p>
                  <p className="text-xs text-muted-foreground">KvK: {order.buyerKvk}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{order.buyerContact}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Send className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{order.buyerEmail}</span>
                </div>
              </div>
            </div>

            {/* Supplier info */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-primary mb-4">Leverancier</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-highlight/10 rounded-lg flex items-center justify-center text-highlight font-bold text-sm">
                  {order.supplierOrgName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">{order.supplierOrgName}</p>
                </div>
              </div>
            </div>

            {/* Order info */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-primary mb-4">Bestelgegevens</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Ordernummer</p>
                  <p className="font-semibold text-primary">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Product</p>
                  <p className="text-primary">{order.listingTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bestelbedrag</p>
                  <p className="font-semibold text-primary">{formatEur(order.totalInCents)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Besteldatum</p>
                  <p className="text-primary">{order.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Terugsluis-geschikt</p>
                  <p className={`font-semibold ${order.terugsluisEligible ? "text-accent" : "text-muted-foreground"}`}>
                    {order.terugsluisEligible ? "Ja" : "Nee"}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviewer info */}
            {invoice.reviewedBy && (
              <div className="card p-6">
                <h3 className="text-sm font-bold text-primary mb-3">Beoordeeld door</h3>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                    {invoice.reviewedBy.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{invoice.reviewedBy}</p>
                    <p className="text-xs text-muted-foreground">{invoice.reviewedAt}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
