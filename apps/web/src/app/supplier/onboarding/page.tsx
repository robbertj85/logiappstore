"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { SupplierProfile } from "@/lib/auth-context";
import { getTopLevelCategories } from "@/lib/data";
import {
  Building2,
  User,
  Globe,
  Phone,
  Mail,
  FileText,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Send,
  Layers,
  Circle,
} from "lucide-react";

const STEPS = [
  { label: "Bedrijfsgegevens", icon: Building2 },
  { label: "Productaanbod", icon: Layers },
  { label: "Verificatie", icon: ShieldCheck },
  { label: "Beoordeling", icon: Clock },
];

export default function SupplierOnboarding() {
  const { user, isLoggedIn, isLoading, updateUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(() => user?.supplierProfile?.onboardingStep || 0);
  const [profile, setProfile] = useState<SupplierProfile>(() => ({
    contactName: user?.supplierProfile?.contactName || user?.name || "",
    contactEmail: user?.supplierProfile?.contactEmail || user?.email || "",
    contactPhone: user?.supplierProfile?.contactPhone || "",
    website: user?.supplierProfile?.website || "",
    description: user?.supplierProfile?.description || "",
    categoryIds: user?.supplierProfile?.categoryIds || [],
    logo: user?.supplierProfile?.logo || "",
    kvkUittreksel: user?.supplierProfile?.kvkUittreksel || false,
    onboardingStep: user?.supplierProfile?.onboardingStep || 0,
  }));
  const [kvkNumber, setKvkNumber] = useState(user?.kvkNumber || "");

  const categories = getTopLevelCategories();

  if (isLoading) {
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

  // If already approved, redirect to dashboard
  if (user.onboardingStatus === "APPROVED") {
    router.push("/supplier");
    return null;
  }

  const updateProfile = (updates: Partial<SupplierProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const canProceedStep0 =
    kvkNumber.length === 8 &&
    profile.contactName.trim() &&
    profile.contactEmail.trim() &&
    profile.description.trim();

  const canProceedStep1 = profile.categoryIds.length > 0;

  const canSubmit = profile.kvkUittreksel;

  const toggleCategory = (id: string) => {
    updateProfile({
      categoryIds: profile.categoryIds.includes(id)
        ? profile.categoryIds.filter((c) => c !== id)
        : [...profile.categoryIds, id],
    });
  };

  const saveProgress = (nextStep: number) => {
    const updatedProfile = { ...profile, onboardingStep: nextStep };
    updateUser({
      kvkNumber,
      onboardingStatus: "IN_PROGRESS",
      supplierProfile: updatedProfile,
    });
    setStep(nextStep);
  };

  const submitForReview = () => {
    const updatedProfile = { ...profile, onboardingStep: 3 };
    updateUser({
      kvkNumber,
      onboardingStatus: "PENDING_REVIEW",
      supplierProfile: updatedProfile,
    });
    setStep(3);
  };

  // Demo: simulate approval
  const simulateApproval = () => {
    updateUser({ onboardingStatus: "APPROVED" });
    router.push("/supplier");
  };

  const simulateRejection = () => {
    updateUser({ onboardingStatus: "REJECTED" });
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">
            Leverancier Onboarding
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registreer uw bedrijf als IT-leverancier op de Logistiek Digistore
          </p>
        </div>

        {/* Stepper */}
        <div className="card p-4 mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => {
              const isCompleted = i < step || user.onboardingStatus === "APPROVED";
              const isCurrent = i === step;
              const StepIcon = s.icon;

              return (
                <div key={i} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-accent text-white"
                          : isCurrent
                          ? "bg-highlight text-white"
                          : "bg-background text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-1.5 font-semibold text-center ${
                        isCurrent ? "text-highlight" : isCompleted ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-full mx-1 ${
                        i < step ? "bg-accent" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 0: Bedrijfsgegevens */}
        {step === 0 && (
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">
                  Bedrijfsgegevens
                </h2>
                <p className="text-xs text-muted-foreground">
                  Basisinformatie over uw organisatie
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">
                    Bedrijfsnaam
                  </label>
                  <input
                    type="text"
                    value={user.organization}
                    disabled
                    className="w-full px-3 py-2.5 border border-border rounded-md text-sm bg-background text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">
                    KvK-nummer <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={kvkNumber}
                    onChange={(e) => setKvkNumber(e.target.value)}
                    placeholder="12345678"
                    maxLength={8}
                    className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">
                    <User className="h-3.5 w-3.5 inline mr-1" />
                    Contactpersoon <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.contactName}
                    onChange={(e) => updateProfile({ contactName: e.target.value })}
                    placeholder="Uw naam"
                    className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">
                    <Mail className="h-3.5 w-3.5 inline mr-1" />
                    E-mailadres <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    value={profile.contactEmail}
                    onChange={(e) => updateProfile({ contactEmail: e.target.value })}
                    placeholder="email@bedrijf.nl"
                    className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">
                    <Phone className="h-3.5 w-3.5 inline mr-1" />
                    Telefoonnummer
                  </label>
                  <input
                    type="tel"
                    value={profile.contactPhone}
                    onChange={(e) => updateProfile({ contactPhone: e.target.value })}
                    placeholder="+31 20 123 4567"
                    className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-1.5">
                    <Globe className="h-3.5 w-3.5 inline mr-1" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => updateProfile({ website: e.target.value })}
                    placeholder="https://uwbedrijf.nl"
                    className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-1.5">
                  Beschrijving <span className="text-danger">*</span>
                </label>
                <textarea
                  value={profile.description}
                  onChange={(e) => updateProfile({ description: e.target.value })}
                  placeholder="Beschrijf kort uw bedrijf en wat u aanbiedt aan de transport- en logistiek sector..."
                  rows={4}
                  className="w-full px-3 py-2.5 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => saveProgress(1)}
                disabled={!canProceedStep0}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Volgende
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Productaanbod */}
        {step === 1 && (
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-highlight/10 flex items-center justify-center">
                <Layers className="h-5 w-5 text-highlight" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">
                  Productaanbod
                </h2>
                <p className="text-xs text-muted-foreground">
                  In welke categorieën biedt u producten aan? (TLN Mijn Digitale Landschap)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const isSelected = profile.categoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-highlight bg-highlight/5"
                        : "border-border hover:border-highlight/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected
                            ? "bg-highlight border-highlight"
                            : "border-border"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {cat.name}
                        </p>
                        {cat.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {cat.description}
                          </p>
                        )}
                        {cat.children && cat.children.length > 0 && (
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {cat.children.map((c) => c.name).slice(0, 4).join(", ")}
                            {cat.children.length > 4 && ` +${cat.children.length - 4} meer`}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Selecteer minimaal 1 categorie. U kunt later subcategorieën kiezen per product.
            </p>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(0)}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Vorige
              </button>
              <button
                onClick={() => saveProgress(2)}
                disabled={!canProceedStep1}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Volgende
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Verificatie & Indienen */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">
                    Verificatie & Indienen
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Upload uw documenten voor beoordeling
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* KvK uittreksel */}
                <div
                  className={`p-4 rounded-lg border-2 ${
                    profile.kvkUittreksel
                      ? "border-accent bg-accent/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-primary">
                        KvK-uittreksel <span className="text-danger">*</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Recent uittreksel uit het Handelsregister (niet ouder dan 3 maanden)
                      </p>
                      <button
                        onClick={() =>
                          updateProfile({ kvkUittreksel: !profile.kvkUittreksel })
                        }
                        className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md ${
                          profile.kvkUittreksel
                            ? "bg-accent/10 text-accent"
                            : "bg-highlight/10 text-highlight hover:bg-highlight/20"
                        }`}
                      >
                        {profile.kvkUittreksel ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            kvk-uittreksel-transtics.pdf
                          </>
                        ) : (
                          <>
                            <Upload className="h-3.5 w-3.5" />
                            Upload bestand (demo)
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Logo */}
                <div className="p-4 rounded-lg border-2 border-border">
                  <div className="flex items-start gap-3">
                    <Upload className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-primary">
                        Bedrijfslogo
                        <span className="text-xs font-normal text-muted-foreground ml-1">
                          (optioneel)
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        PNG of SVG, minimaal 200x200px
                      </p>
                      <button className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-highlight/10 text-highlight hover:bg-highlight/20">
                        <Upload className="h-3.5 w-3.5" />
                        Upload logo (demo)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Approval notice */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-800">
                    Beoordeling door Logistiek Digitaal
                  </h3>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Na indienen wordt uw registratie beoordeeld door het{" "}
                    <strong>Connekt / Logistiek Digitaal</strong> team. Zij controleren of uw bedrijf
                    en productaanbod passen binnen het Terugsluis-ecosysteem. U ontvangt
                    bericht zodra uw registratie is goedgekeurd.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      <Clock className="h-2.5 w-2.5" />
                      Verwachte doorlooptijd: 2-5 werkdagen
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="h-2.5 w-2.5" />
                      KvK-verificatie + inhoudelijke toets
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-primary mb-3">
                Samenvatting registratie
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Bedrijf</span>
                  <span className="font-semibold text-primary">{user.organization}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <span className="text-muted-foreground">KvK</span>
                  <span className="font-semibold text-primary">{kvkNumber}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Contact</span>
                  <span className="font-semibold text-primary">{profile.contactName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Categorieën</span>
                  <span className="font-semibold text-primary">{profile.categoryIds.length} geselecteerd</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">KvK-uittreksel</span>
                  <span className={`font-semibold ${profile.kvkUittreksel ? "text-accent" : "text-danger"}`}>
                    {profile.kvkUittreksel ? "Geüpload" : "Ontbreekt"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Vorige
              </button>
              <button
                onClick={submitForReview}
                disabled={!canSubmit}
                className="bg-highlight hover:bg-highlight/90 text-white font-semibold px-6 py-3 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
                Indienen ter beoordeling
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Waiting / Result */}
        {step === 3 && (
          <div className="space-y-6">
            {user.onboardingStatus === "REJECTED" ? (
              /* Rejected state */
              <div className="card p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-danger" />
                </div>
                <h2 className="text-xl font-bold text-primary mb-2">
                  Registratie afgewezen
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Uw registratie is helaas afgewezen door het Logistiek Digitaal team.
                  Neem contact op via{" "}
                  <strong>onboarding@logistiekdigitaal.nl</strong> voor meer informatie.
                </p>
                <div className="mt-6 bg-danger/5 border border-danger/20 rounded-lg p-4 max-w-md mx-auto text-left">
                  <p className="text-xs font-semibold text-danger mb-1">Reden (demo):</p>
                  <p className="text-xs text-muted-foreground">
                    Productaanbod past niet binnen de scope van het Terugsluis-programma.
                    Het aanbod dient gericht te zijn op IT-oplossingen voor de transport- en logistiek sector.
                  </p>
                </div>
                <button
                  onClick={() => {
                    updateUser({ onboardingStatus: "IN_PROGRESS" });
                    setStep(0);
                  }}
                  className="btn-secondary mt-6 inline-flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Registratie aanpassen
                </button>
              </div>
            ) : (
              /* Pending review state */
              <div className="card p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-highlight/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-highlight" />
                </div>
                <h2 className="text-xl font-bold text-primary mb-2">
                  In afwachting van beoordeling
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Uw registratie is ingediend en wordt beoordeeld door het{" "}
                  <strong>Connekt / Logistiek Digitaal</strong> team. U ontvangt een bericht zodra
                  de beoordeling is afgerond.
                </p>

                <div className="mt-6 max-w-sm mx-auto">
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                      <span className="text-sm text-primary">Bedrijfsgegevens ingevuld</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                      <span className="text-sm text-primary">Productcategorieën gekozen</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                      <span className="text-sm text-primary">KvK-uittreksel geüpload</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 shrink-0 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full border-2 border-highlight border-t-transparent animate-spin" />
                      </div>
                      <span className="text-sm text-highlight font-semibold">
                        Wacht op goedkeuring Logistiek Digitaal
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-background rounded-lg p-4 max-w-sm mx-auto">
                  <p className="text-xs text-muted-foreground mb-1">Wat wordt beoordeeld?</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className="flex items-start gap-1.5">
                      <Circle className="h-2 w-2 mt-1 shrink-0" />
                      KvK-registratie en bedrijfsstatus
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Circle className="h-2 w-2 mt-1 shrink-0" />
                      Relevantie productaanbod voor transportsector
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Circle className="h-2 w-2 mt-1 shrink-0" />
                      Geschiktheid voor Terugsluis-besteding
                    </li>
                  </ul>
                </div>

                {/* Demo controls */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3">
                    Demo — simuleer beoordeling
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={simulateApproval}
                      className="btn-primary text-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Goedkeuren
                    </button>
                    <button
                      onClick={simulateRejection}
                      className="px-4 py-2.5 border border-danger text-danger text-sm font-semibold rounded-md hover:bg-danger/5 flex items-center gap-1.5"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Afwijzen
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
