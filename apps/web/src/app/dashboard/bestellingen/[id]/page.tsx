"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getOrderById } from "@/lib/data";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft, Package, Clock, CheckCircle2, XCircle, FileText,
  Upload, AlertCircle, ShieldCheck, Building2, CreditCard,
  CircleDot, Check,
} from "lucide-react";

const orderStatusSteps = [
  { key: "PENDING", label: "Aangevraagd", icon: Clock },
  { key: "CONFIRMED", label: "Bevestigd", icon: CheckCircle2 },
  { key: "COMPLETED", label: "Afgerond", icon: Package },
];

const invoiceStatusSteps = [
  { key: "INGEDIEND", label: "Ingediend" },
  { key: "IN_BEHANDELING", label: "In behandeling" },
  { key: "GOEDGEKEURD", label: "Goedgekeurd" },
  { key: "UITBETAALD", label: "Uitbetaald" },
];

export default function OrderDetailPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [invoiceFile, setInvoiceFile] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (isLoading) {
    return <div className="bg-background min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Laden...</div></div>;
  }
  if (!isLoggedIn || !user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  const order = getOrderById(orderId);
  if (!order) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="card p-8 text-center">
          <p className="text-muted-foreground">Bestelling niet gevonden</p>
          <Link href="/dashboard/bestellingen" className="btn-primary mt-4 inline-block">
            Terug naar bestellingen
          </Link>
        </div>
      </div>
    );
  }

  const formatEur = (c: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(c / 100);

  const orderStatusIndex = orderStatusSteps.findIndex((s) => s.key === order.status);
  const canUploadInvoice = order.status === "COMPLETED" && !order.invoice && order.terugsluisEligible;

  const handleUpload = () => {
    setUploadSuccess(true);
    setShowUploadForm(false);
  };

  // Invoice status progress
  const invoiceStatusIndex = order.invoice
    ? invoiceStatusSteps.findIndex((s) => s.key === order.invoice!.status)
    : -1;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/dashboard/bestellingen"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar bestellingen
        </Link>

        {/* Header */}
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-primary">{order.listingTitle}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Order {order.orderNumber} — {order.supplierOrgName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{formatEur(order.totalInCents)}</p>
              {order.terugsluisEligible && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                  <ShieldCheck className="h-3 w-3" />
                  Terugsluis-geschikt
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order progress */}
            <div className="card p-6">
              <h2 className="text-sm font-bold text-primary mb-4">Bestelstatus</h2>
              <div className="flex items-center gap-0">
                {orderStatusSteps.map((step, i) => {
                  const isActive = i <= orderStatusIndex;
                  const isCurrent = i === orderStatusIndex;
                  const StepIcon = step.icon;
                  return (
                    <div key={step.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive ? "bg-accent text-white" : "bg-background text-muted-foreground border border-border"
                        } ${isCurrent ? "ring-2 ring-accent/30" : ""}`}>
                          {isActive && i < orderStatusIndex ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <StepIcon className="h-5 w-5" />
                          )}
                        </div>
                        <span className={`text-xs mt-2 ${isActive ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                          {step.label}
                        </span>
                      </div>
                      {i < orderStatusSteps.length - 1 && (
                        <div className={`h-0.5 flex-1 -mt-5 ${i < orderStatusIndex ? "bg-accent" : "bg-border"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Invoice section */}
            <div className="card p-6">
              <h2 className="text-sm font-bold text-primary mb-4">Factuur & Terugsluis-vergoeding</h2>

              {order.invoice && !uploadSuccess ? (
                <div>
                  {/* Invoice progress */}
                  {order.invoice.status !== "AFGEWEZEN" && (
                    <div className="mb-6">
                      <div className="flex items-center gap-0">
                        {invoiceStatusSteps.map((step, i) => {
                          const isActive = i <= invoiceStatusIndex;
                          return (
                            <div key={step.key} className="flex items-center flex-1">
                              <div className="flex flex-col items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isActive ? "bg-accent text-white" : "bg-background text-muted-foreground border border-border"
                                }`}>
                                  {isActive && i < invoiceStatusIndex ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <CircleDot className="h-4 w-4" />
                                  )}
                                </div>
                                <span className={`text-[10px] mt-1.5 text-center ${isActive ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                                  {step.label}
                                </span>
                              </div>
                              {i < invoiceStatusSteps.length - 1 && (
                                <div className={`h-0.5 flex-1 -mt-4 ${i < invoiceStatusIndex ? "bg-accent" : "bg-border"}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Invoice details */}
                  <div className="bg-background rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-semibold text-primary">{order.invoice.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          Factuurnummer: {order.invoice.invoiceNumber} — Geüpload op {order.invoice.uploadedAt}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Factuurbedrag</p>
                        <p className="text-sm font-bold text-primary">{formatEur(order.invoice.amountInCents)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="text-sm font-semibold text-primary">{
                          ({ INGEDIEND: "Ingediend", IN_BEHANDELING: "In behandeling", GOEDGEKEURD: "Goedgekeurd", UITBETAALD: "Uitbetaald", AFGEWEZEN: "Afgewezen" } as Record<string, string>)[order.invoice.status]
                        }</p>
                      </div>
                      {order.invoice.reviewedBy && (
                        <div>
                          <p className="text-xs text-muted-foreground">Beoordeeld door</p>
                          <p className="text-sm text-primary">{order.invoice.reviewedBy}</p>
                        </div>
                      )}
                      {order.invoice.paidAt && (
                        <div>
                          <p className="text-xs text-muted-foreground">Uitbetaald op</p>
                          <p className="text-sm text-primary">{order.invoice.paidAt}</p>
                        </div>
                      )}
                    </div>

                    {order.invoice.notes && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">{order.invoice.notes}</p>
                      </div>
                    )}
                  </div>

                  {order.invoice.status === "AFGEWEZEN" && (
                    <div className="mt-4 bg-danger/5 border border-danger/20 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-danger">Factuur afgewezen</p>
                          {order.invoice.rejectionReason && (
                            <p className="text-sm text-danger/80 mt-1">{order.invoice.rejectionReason}</p>
                          )}
                          <button
                            onClick={() => setShowUploadForm(true)}
                            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-highlight hover:text-highlight/80"
                          >
                            <Upload className="h-4 w-4" />
                            Nieuwe factuur uploaden
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : canUploadInvoice || showUploadForm ? (
                uploadSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-primary">Factuur ingediend!</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Uw factuur is succesvol ingediend. Connekt zal deze beoordelen
                      en het Terugsluis-bedrag uitbetalen na goedkeuring.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-accent-dark">Terugsluis-vergoeding</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload uw factuur om de Terugsluis-vergoeding aan te vragen.
                            Connekt beoordeelt uw factuur en betaalt het goedgekeurde bedrag uit.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-primary mb-1.5">
                          Factuurnummer
                        </label>
                        <input
                          type="text"
                          value={invoiceNumber}
                          onChange={(e) => setInvoiceNumber(e.target.value)}
                          placeholder="bijv. 2026-TMS-0500"
                          className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-primary mb-1.5">
                          Factuurbestand (PDF)
                        </label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-highlight/30 transition-colors cursor-pointer"
                          onClick={() => setInvoiceFile("factuur-upload.pdf")}
                        >
                          {invoiceFile ? (
                            <div className="flex items-center justify-center gap-2">
                              <FileText className="h-5 w-5 text-accent" />
                              <span className="text-sm font-semibold text-primary">{invoiceFile}</span>
                              <CheckCircle2 className="h-4 w-4 text-accent" />
                            </div>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Klik om een PDF-bestand te selecteren
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Maximaal 10 MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="bg-background rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Bestelbedrag</span>
                          <span className="text-sm font-bold text-primary">{formatEur(order.totalInCents)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-muted-foreground">Terugsluis-vergoeding</span>
                          <span className="text-sm font-bold text-accent">{formatEur(order.totalInCents)}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleUpload}
                        disabled={!invoiceFile || !invoiceNumber}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Factuur indienen
                      </button>
                    </div>
                  </div>
                )
              ) : !order.terugsluisEligible ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm">Dit product komt niet in aanmerking voor Terugsluis-vergoeding.</p>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm">Factuur uploaden is mogelijk zodra de bestelling is afgerond.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order info */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-primary mb-4">Bestelgegevens</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Ordernummer</p>
                  <p className="font-semibold text-primary">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Besteldatum</p>
                  <p className="text-primary">{order.createdAt}</p>
                </div>
                {order.confirmedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Bevestigd op</p>
                    <p className="text-primary">{order.confirmedAt}</p>
                  </div>
                )}
                {order.completedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Afgerond op</p>
                    <p className="text-primary">{order.completedAt}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Supplier */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-primary mb-3">Leverancier</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-highlight/10 rounded-lg flex items-center justify-center text-highlight font-bold text-sm">
                  {order.supplierOrgName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">{order.supplierOrgName}</p>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="card p-6 bg-primary/[0.02]">
              <h3 className="text-sm font-bold text-primary mb-2">Hulp nodig?</h3>
              <p className="text-xs text-muted-foreground">
                Bij vragen over uw bestelling of factuur kunt u contact opnemen
                met Connekt / Logistiek Digitaal via{" "}
                <span className="font-semibold text-highlight">info@connekt.nl</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
