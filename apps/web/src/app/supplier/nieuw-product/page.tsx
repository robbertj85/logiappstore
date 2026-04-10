"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Globe,
  ImagePlus,
  Info,
  Layers,
  ListChecks,
  Package,
  Plus,
  Send,
  Tag,
  Trash2,
  Upload,
  X,
  GripVertical,
  Euro,
} from "lucide-react";
import { TLN_CATEGORIES } from "@logiappstore/shared";
import type { Category, PricingModel } from "@logiappstore/shared";

// ─── TYPES ──────────────────────────────────────────────────────

interface ScreenshotFile {
  id: string;
  name: string;
  dataUrl: string;
}

interface ProductFormData {
  // Step 1: Basis
  title: string;
  shortDescription: string;
  description: string;
  // Step 2: Media
  featureGraphic: ScreenshotFile | null;
  screenshots: ScreenshotFile[];
  // Step 3: Categories & Tags
  categoryIds: string[];
  tags: string[];
  // Step 4: Pricing
  pricingModel: PricingModel;
  priceInCents: number | null;
  pricingDetails: string;
  terugsluisEligible: boolean;
  // Step 5: Links & Features
  website: string;
  demoUrl: string;
  videoUrl: string;
  keyFeatures: string[];
}

const STEPS = [
  { id: 1, label: "Basisinformatie", icon: FileText },
  { id: 2, label: "Media", icon: ImagePlus },
  { id: 3, label: "Categorieën & Tags", icon: Layers },
  { id: 4, label: "Prijzen", icon: Euro },
  { id: 5, label: "Links & Features", icon: Globe },
  { id: 6, label: "Overzicht", icon: ListChecks },
];

const PRICING_MODELS: { value: PricingModel; label: string; hasPrice: boolean }[] = [
  { value: "FREE", label: "Gratis", hasPrice: false },
  { value: "ONE_TIME", label: "Eenmalige betaling", hasPrice: true },
  { value: "SUBSCRIPTION_MONTHLY", label: "Abonnement per maand", hasPrice: true },
  { value: "SUBSCRIPTION_YEARLY", label: "Abonnement per jaar", hasPrice: true },
  { value: "PER_USER", label: "Per gebruiker", hasPrice: true },
  { value: "CUSTOM", label: "Op aanvraag / maatwerk", hasPrice: false },
];

const PRICING_LABEL: Record<string, string> = {
  FREE: "Gratis",
  ONE_TIME: "Eenmalig",
  SUBSCRIPTION_MONTHLY: "Per maand",
  SUBSCRIPTION_YEARLY: "Per jaar",
  PER_USER: "Per gebruiker",
  CUSTOM: "Op aanvraag",
};

// ─── HELPERS ────────────────────────────────────────────────────

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function formatCents(cents: number | null): string {
  if (cents === null || cents === 0) return "Gratis";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

// ─── MAIN COMPONENT ────────────────────────────────────────────

export default function NieuwProductPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submittedAs, setSubmittedAs] = useState<"DRAFT" | "PENDING_REVIEW">("DRAFT");

  const [form, setForm] = useState<ProductFormData>({
    title: "",
    shortDescription: "",
    description: "",
    featureGraphic: null,
    screenshots: [],
    categoryIds: [],
    tags: [],
    pricingModel: "SUBSCRIPTION_MONTHLY",
    priceInCents: null,
    pricingDetails: "",
    terugsluisEligible: false,
    website: "",
    demoUrl: "",
    videoUrl: "",
    keyFeatures: [""],
  });

  // Auth guard — wait for hydration before redirecting
  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Laden...</div>
      </div>
    );
  }
  if (!isLoggedIn || !user || user.role !== "SUPPLIER") {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  // ─── STEP VALIDATION ─────────────────────────────────────────

  function isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return form.title.trim().length >= 3 && form.shortDescription.trim().length >= 10;
      case 2:
        return true; // media is optional
      case 3:
        return form.categoryIds.length > 0;
      case 4:
        return true; // pricing always has a default
      case 5:
        return true; // links are optional
      case 6:
        return true;
      default:
        return true;
    }
  }

  function canProceed(): boolean {
    return isStepValid(currentStep);
  }

  // ─── NAVIGATION ───────────────────────────────────────────────

  function goNext() {
    if (currentStep < 6 && canProceed()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goPrev() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goToStep(step: number) {
    // Allow going back, or forward if all prior steps are valid
    if (step < currentStep) {
      setCurrentStep(step);
    } else {
      let canGo = true;
      for (let s = 1; s < step; s++) {
        if (!isStepValid(s)) {
          canGo = false;
          break;
        }
      }
      if (canGo) setCurrentStep(step);
    }
  }

  // ─── SUBMIT ───────────────────────────────────────────────────

  function handleSubmit(status: "DRAFT" | "PENDING_REVIEW") {
    const product = {
      id: `listing-${generateId()}`,
      title: form.title,
      slug: slugify(form.title),
      shortDescription: form.shortDescription,
      description: form.description,
      status,
      pricingModel: form.pricingModel,
      priceInCents: form.priceInCents,
      pricingDetails: form.pricingDetails,
      website: form.website || undefined,
      demoUrl: form.demoUrl || undefined,
      videoUrl: form.videoUrl || undefined,
      featured: false,
      terugsluisEligible: form.terugsluisEligible,
      badgeAanbevolen: false,
      organizationId: "org-transtics",
      categoryIds: form.categoryIds,
      tags: form.tags,
      media: form.screenshots.map((s, i) => ({
        id: s.id,
        url: s.dataUrl,
        type: "image" as const,
        sortOrder: i + 1,
      })),
      keyFeatures: form.keyFeatures.filter((f) => f.trim() !== ""),
      averageRating: undefined,
      reviewCount: 0,
    };

    // Store in localStorage for demo purposes
    const existing = JSON.parse(localStorage.getItem("logiappstore_draft_products") || "[]");
    existing.push(product);
    localStorage.setItem("logiappstore_draft_products", JSON.stringify(existing));

    setSubmittedAs(status);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ─── SUCCESS SCREEN ───────────────────────────────────────────

  if (submitted) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            {submittedAs === "DRAFT" ? "Product opgeslagen als concept" : "Product ingediend ter review"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {submittedAs === "DRAFT"
              ? "Uw product is opgeslagen als concept. U kunt het later verder bewerken en indienen ter review."
              : "Uw product is ingediend en wordt door ons team beoordeeld. U ontvangt bericht zodra het is goedgekeurd."}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/supplier" className="btn-secondary inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Terug naar dashboard
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setCurrentStep(1);
                setForm({
                  title: "",
                  shortDescription: "",
                  description: "",
                  featureGraphic: null,
                  screenshots: [],
                  categoryIds: [],
                  tags: [],
                  pricingModel: "SUBSCRIPTION_MONTHLY",
                  priceInCents: null,
                  pricingDetails: "",
                  terugsluisEligible: false,
                  website: "",
                  demoUrl: "",
                  videoUrl: "",
                  keyFeatures: [""],
                });
              }}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nog een product toevoegen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────────────

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/supplier"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Terug naar dashboard
          </Link>
          <h1 className="text-2xl font-bold text-primary">Nieuw product toevoegen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Vul alle stappen in om uw product in de Logistiek Digistore te plaatsen.
          </p>
        </div>

        {/* Stepper */}
        <div className="card p-4 mb-8">
          <div className="flex items-center gap-1 overflow-x-auto">
            {STEPS.map((step, i) => {
              const isActive = step.id === currentStep;
              const isDone = step.id < currentStep;
              const isClickable =
                step.id < currentStep ||
                (() => {
                  for (let s = 1; s < step.id; s++) {
                    if (!isStepValid(s)) return false;
                  }
                  return true;
                })();

              return (
                <button
                  key={step.id}
                  onClick={() => isClickable && goToStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-highlight/10 text-highlight"
                      : isDone
                        ? "text-accent-dark hover:bg-accent/5 cursor-pointer"
                        : isClickable
                          ? "text-muted-foreground hover:bg-background cursor-pointer"
                          : "text-muted-foreground/40 cursor-not-allowed"
                  }`}
                  disabled={!isClickable}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isActive
                        ? "bg-highlight text-white"
                        : isDone
                          ? "bg-accent text-white"
                          : "bg-border text-muted-foreground"
                    }`}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" /> : step.id}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-border ml-1 hidden sm:block" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="card p-6 sm:p-8 mb-6">
          {currentStep === 1 && <StepBasis form={form} setForm={setForm} />}
          {currentStep === 2 && <StepMedia form={form} setForm={setForm} />}
          {currentStep === 3 && <StepCategories form={form} setForm={setForm} />}
          {currentStep === 4 && <StepPricing form={form} setForm={setForm} />}
          {currentStep === 5 && <StepLinksFeatures form={form} setForm={setForm} />}
          {currentStep === 6 && <StepOverview form={form} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-md transition-colors ${
              currentStep === 1
                ? "text-muted-foreground/40 cursor-not-allowed"
                : "text-primary hover:bg-white border border-border hover:border-primary"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Vorige
          </button>

          <div className="flex items-center gap-3">
            {currentStep === 6 ? (
              <>
                <button
                  onClick={() => handleSubmit("DRAFT")}
                  className="btn-secondary flex items-center gap-2 text-sm !px-5 !py-2.5"
                >
                  <Package className="h-4 w-4" />
                  Opslaan als concept
                </button>
                <button
                  onClick={() => handleSubmit("PENDING_REVIEW")}
                  className="btn-primary flex items-center gap-2 text-sm !px-5 !py-2.5"
                >
                  <Send className="h-4 w-4" />
                  Indienen ter review
                </button>
              </>
            ) : (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-md transition-colors ${
                  canProceed()
                    ? "bg-highlight text-white hover:bg-highlight/90"
                    : "bg-border text-muted-foreground cursor-not-allowed"
                }`}
              >
                Volgende
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 1: BASISINFORMATIE ────────────────────────────────────

function StepBasis({
  form,
  setForm,
}: {
  form: ProductFormData;
  setForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-primary mb-1">Basisinformatie</h2>
        <p className="text-sm text-muted-foreground">
          Geef de basale productinformatie op die kopers als eerste zien.
        </p>
      </div>

      {/* Product name */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-1.5">
          Productnaam <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="bijv. FleetConnect Pro"
          className="w-full px-4 py-2.5 border border-border rounded-md text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
        />
        {form.title.trim() && (
          <p className="text-xs text-muted-foreground mt-1.5">
            URL: /products/<span className="font-mono text-highlight">{slugify(form.title)}</span>
          </p>
        )}
      </div>

      {/* Short description */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-1.5">
          Korte omschrijving <span className="text-danger">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-1.5">
          Wordt getoond op productkaarten en in zoekresultaten. Max 200 tekens.
        </p>
        <textarea
          value={form.shortDescription}
          onChange={(e) =>
            setForm((f) => ({ ...f, shortDescription: e.target.value.slice(0, 200) }))
          }
          placeholder="Een korte, pakkende omschrijving van uw product..."
          rows={3}
          className="w-full px-4 py-2.5 border border-border rounded-md text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight resize-none"
        />
        <p className="text-xs text-muted-foreground text-right mt-1">
          {form.shortDescription.length}/200
        </p>
      </div>

      {/* Full description */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-1.5">
          Volledige beschrijving
        </label>
        <p className="text-xs text-muted-foreground mb-1.5">
          Uitgebreide productbeschrijving. U kunt Markdown gebruiken (## voor koppen, - voor lijsten).
        </p>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder={"## Overzicht\nBeschrijf uw product in detail...\n\n## Belangrijkste voordelen\n- Voordeel 1\n- Voordeel 2"}
          rows={10}
          className="w-full px-4 py-2.5 border border-border rounded-md text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight resize-y font-mono"
        />
      </div>
    </div>
  );
}

// ─── STEP 2: MEDIA ──────────────────────────────────────────────

function StepMedia({
  form,
  setForm,
}: {
  form: ProductFormData;
  setForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const featureInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newScreenshots: ScreenshotFile[] = [];
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => {
          newScreenshots.push({
            id: generateId(),
            name: file.name,
            dataUrl: reader.result as string,
          });
          if (newScreenshots.length === files.length || newScreenshots.length === Array.from(files).filter(f => f.type.startsWith("image/")).length) {
            setForm((f) => ({
              ...f,
              screenshots: [...f.screenshots, ...newScreenshots],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [setForm]
  );

  const handleFeatureGraphic = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({
        ...f,
        featureGraphic: {
          id: generateId(),
          name: file.name,
          dataUrl: reader.result as string,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeScreenshot = (id: string) => {
    setForm((f) => ({
      ...f,
      screenshots: f.screenshots.filter((s) => s.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-primary mb-1">Media & Screenshots</h2>
        <p className="text-sm text-muted-foreground">
          Upload afbeeldingen van uw product. Goede screenshots helpen kopers bij hun beslissing.
        </p>
      </div>

      {/* Feature graphic */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-1.5">
          Feature graphic
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Hoofdafbeelding die bovenaan de productpagina wordt getoond. Aanbevolen: 1200x630px.
        </p>
        {form.featureGraphic ? (
          <div className="relative w-full max-w-md">
            <img
              src={form.featureGraphic.dataUrl}
              alt="Feature graphic"
              className="w-full rounded-lg border border-border object-cover aspect-video"
            />
            <button
              onClick={() => setForm((f) => ({ ...f, featureGraphic: null }))}
              className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-danger hover:bg-danger hover:text-white transition-colors shadow-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => featureInputRef.current?.click()}
            className="w-full max-w-md border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-2 hover:border-highlight hover:bg-highlight/5 transition-colors cursor-pointer"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium text-primary">Klik om te uploaden</span>
            <span className="text-xs text-muted-foreground">PNG, JPG of WebP</span>
          </button>
        )}
        <input
          ref={featureInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFeatureGraphic(e.target.files)}
        />
      </div>

      {/* Screenshots */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-1.5">
          Screenshots
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Voeg meerdere screenshots toe om uw product te demonstreren.
        </p>

        {/* Existing screenshots grid */}
        {form.screenshots.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {form.screenshots.map((screenshot) => (
              <div key={screenshot.id} className="relative group">
                <img
                  src={screenshot.dataUrl}
                  alt={screenshot.name}
                  className="w-full aspect-video rounded-lg border border-border object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition-colors flex items-center justify-center">
                  <button
                    onClick={() => removeScreenshot(screenshot.id)}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-white rounded-full flex items-center justify-center text-danger shadow-sm transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 truncate">{screenshot.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
            dragOver
              ? "border-highlight bg-highlight/10"
              : "border-border hover:border-highlight hover:bg-highlight/5"
          }`}
        >
          <ImagePlus className={`h-8 w-8 ${dragOver ? "text-highlight" : "text-muted-foreground"}`} />
          <span className="text-sm font-medium text-primary">
            {dragOver ? "Laat los om te uploaden" : "Sleep screenshots hierheen of klik om te selecteren"}
          </span>
          <span className="text-xs text-muted-foreground">PNG, JPG of WebP — max 10 screenshots</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

// ─── STEP 3: CATEGORIEËN & TAGS ─────────────────────────────────

function StepCategories({
  form,
  setForm,
}: {
  form: ProductFormData;
  setForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
}) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    // Auto-expand groups that have selected children
    const expanded = new Set<string>();
    TLN_CATEGORIES.forEach((topCat) => {
      if (form.categoryIds.includes(topCat.id)) expanded.add(topCat.id);
      topCat.children?.forEach((subCat) => {
        if (form.categoryIds.includes(subCat.id)) {
          expanded.add(topCat.id);
          expanded.add(subCat.id);
        }
        subCat.children?.forEach((leaf) => {
          if (form.categoryIds.includes(leaf.id)) {
            expanded.add(topCat.id);
            expanded.add(subCat.id);
          }
        });
      });
    });
    return expanded;
  });
  const [tagInput, setTagInput] = useState("");

  const toggleCategory = (catId: string) => {
    setForm((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(catId)
        ? f.categoryIds.filter((id) => id !== catId)
        : [...f.categoryIds, catId],
    }));
  };

  const toggleExpand = (catId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  function renderCategory(cat: Category, depth: number = 0) {
    const hasChildren = cat.children && cat.children.length > 0;
    const isExpanded = expandedGroups.has(cat.id);
    const isSelected = form.categoryIds.includes(cat.id);

    return (
      <div key={cat.id}>
        <div
          className={`flex items-center gap-2 py-1.5 rounded-md hover:bg-background transition-colors ${
            depth === 0 ? "" : ""
          }`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
        >
          {hasChildren ? (
            <button onClick={() => toggleExpand(cat.id)} className="shrink-0">
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  isExpanded ? "" : "-rotate-90"
                }`}
              />
            </button>
          ) : (
            <span className="w-4" />
          )}
          <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleCategory(cat.id)}
              className="w-4 h-4 rounded border-border text-highlight focus:ring-highlight/30 shrink-0"
            />
            <span
              className={`text-sm truncate ${
                depth === 0
                  ? "font-bold text-primary"
                  : depth === 1
                    ? "font-medium text-primary"
                    : "text-muted-foreground"
              }`}
            >
              {cat.name}
            </span>
          </label>
        </div>
        {hasChildren && isExpanded && (
          <div>{cat.children!.map((child) => renderCategory(child, depth + 1))}</div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-primary mb-1">Categorieën & Tags</h2>
        <p className="text-sm text-muted-foreground">
          Selecteer de categorieën en voeg tags toe zodat kopers uw product gemakkelijk kunnen vinden.
        </p>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-1.5">
          Categorieën <span className="text-danger">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Kies een of meer categorieën uit de TLN-taxonomie.
        </p>

        {form.categoryIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {form.categoryIds.map((catId) => {
              const cat = findCategoryInTree(catId, TLN_CATEGORIES);
              return (
                <span
                  key={catId}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-highlight/10 text-highlight"
                >
                  {cat?.name ?? catId}
                  <button onClick={() => toggleCategory(catId)} className="hover:text-danger">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        <div className="border border-border rounded-lg max-h-80 overflow-y-auto p-2">
          {TLN_CATEGORIES.map((cat) => renderCategory(cat))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-1.5">Tags</label>
        <p className="text-xs text-muted-foreground mb-2">
          Voeg relevante tags toe voor betere vindbaarheid.
        </p>

        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-background text-muted-foreground border border-border"
              >
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-danger">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="bijv. ritplanning, facturatie, TMS..."
            className="flex-1 px-4 py-2.5 border border-border rounded-md text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
          />
          <button
            onClick={addTag}
            disabled={!tagInput.trim()}
            className="px-4 py-2.5 bg-highlight text-white rounded-md text-sm font-semibold hover:bg-highlight/90 transition-colors disabled:bg-border disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function findCategoryInTree(id: string, categories: Category[]): Category | undefined {
  for (const cat of categories) {
    if (cat.id === id) return cat;
    if (cat.children) {
      const found = findCategoryInTree(id, cat.children);
      if (found) return found;
    }
  }
  return undefined;
}

// ─── STEP 4: PRIJZEN ────────────────────────────────────────────

function StepPricing({
  form,
  setForm,
}: {
  form: ProductFormData;
  setForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
}) {
  const selectedModel = PRICING_MODELS.find((m) => m.value === form.pricingModel)!;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-primary mb-1">Prijzen & Terugsluis</h2>
        <p className="text-sm text-muted-foreground">
          Stel het prijsmodel in en geef aan of uw product geschikt is voor Terugsluis-budget.
        </p>
      </div>

      {/* Pricing model */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-2">Prijsmodel</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRICING_MODELS.map((model) => (
            <button
              key={model.value}
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  pricingModel: model.value,
                  priceInCents: model.hasPrice ? f.priceInCents : null,
                }))
              }
              className={`text-left p-3 rounded-lg border-2 transition-colors ${
                form.pricingModel === model.value
                  ? "border-highlight bg-highlight/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <span
                className={`text-sm font-semibold ${
                  form.pricingModel === model.value ? "text-highlight" : "text-primary"
                }`}
              >
                {model.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price input */}
      {selectedModel.hasPrice && (
        <div>
          <label className="block text-sm font-semibold text-primary mb-1.5">
            Prijs (in euro)
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">
              &euro;
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.priceInCents !== null ? (form.priceInCents / 100).toFixed(2) : ""}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setForm((f) => ({
                  ...f,
                  priceInCents: isNaN(val) ? null : Math.round(val * 100),
                }));
              }}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2.5 border border-border rounded-md text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
            />
          </div>
        </div>
      )}

      {/* Pricing details */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-1.5">
          Prijs toelichting
        </label>
        <p className="text-xs text-muted-foreground mb-1.5">
          Eventuele aanvullende informatie over de prijs, bijv. staffelkortingen of licentie-opties.
        </p>
        <textarea
          value={form.pricingDetails}
          onChange={(e) => setForm((f) => ({ ...f, pricingDetails: e.target.value }))}
          placeholder="bijv. Vanaf 249/maand bij jaarcontract. Gratis proefperiode van 30 dagen."
          rows={3}
          className="w-full px-4 py-2.5 border border-border rounded-md text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight resize-none"
        />
      </div>

      {/* Terugsluis eligibility */}
      <div className="border border-border rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.terugsluisEligible}
            onChange={(e) =>
              setForm((f) => ({ ...f, terugsluisEligible: e.target.checked }))
            }
            className="w-5 h-5 rounded border-border text-accent focus:ring-accent/30 mt-0.5 shrink-0"
          />
          <div>
            <span className="text-sm font-bold text-primary block">
              Geschikt voor Terugsluis-budget
            </span>
            <span className="text-xs text-muted-foreground mt-0.5 block">
              Geef aan of transportbedrijven dit product kunnen bekostigen uit hun Terugsluis-budget.
              Dit vergroot de zichtbaarheid en aantrekkelijkheid van uw product voor vervoerders.
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}

// ─── STEP 5: LINKS & FEATURES ───────────────────────────────────

function StepLinksFeatures({
  form,
  setForm,
}: {
  form: ProductFormData;
  setForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
}) {
  const addFeature = () => {
    setForm((f) => ({ ...f, keyFeatures: [...f.keyFeatures, ""] }));
  };

  const updateFeature = (index: number, value: string) => {
    setForm((f) => {
      const updated = [...f.keyFeatures];
      updated[index] = value;
      return { ...f, keyFeatures: updated };
    });
  };

  const removeFeature = (index: number) => {
    setForm((f) => ({
      ...f,
      keyFeatures: f.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-primary mb-1">Links & Features</h2>
        <p className="text-sm text-muted-foreground">
          Voeg links toe naar uw website en demo, en beschrijf de belangrijkste functies.
        </p>
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-primary mb-1.5">Website URL</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            placeholder="https://www.voorbeeld.nl"
            className="w-full px-4 py-2.5 border border-border rounded-md text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-primary mb-1.5">Demo URL</label>
          <input
            type="url"
            value={form.demoUrl}
            onChange={(e) => setForm((f) => ({ ...f, demoUrl: e.target.value }))}
            placeholder="https://demo.voorbeeld.nl"
            className="w-full px-4 py-2.5 border border-border rounded-md text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary mb-1.5">Video URL</label>
        <p className="text-xs text-muted-foreground mb-1.5">
          Link naar een productvideo, bijv. op YouTube of Vimeo.
        </p>
        <input
          type="url"
          value={form.videoUrl}
          onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-4 py-2.5 border border-border rounded-md text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
        />
      </div>

      {/* Key features */}
      <div>
        <label className="block text-sm font-semibold text-primary mb-1.5">
          Belangrijkste functies
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          Som de belangrijkste functies of voordelen op. Deze worden op de productpagina getoond.
        </p>

        <div className="space-y-2">
          {form.keyFeatures.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-border shrink-0" />
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(i, e.target.value)}
                placeholder={`Functie ${i + 1}, bijv. "Drag & drop ritplanning"`}
                className="flex-1 px-4 py-2 border border-border rounded-md text-sm text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-highlight/30 focus:border-highlight"
              />
              {form.keyFeatures.length > 1 && (
                <button
                  onClick={() => removeFeature(i)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-danger transition-colors rounded-md hover:bg-danger/5"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addFeature}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-highlight hover:text-highlight/80 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Functie toevoegen
        </button>
      </div>
    </div>
  );
}

// ─── STEP 6: OVERZICHT ──────────────────────────────────────────

function StepOverview({ form }: { form: ProductFormData }) {
  const allCategories = form.categoryIds.map((id) => findCategoryInTree(id, TLN_CATEGORIES));
  const nonEmptyFeatures = form.keyFeatures.filter((f) => f.trim() !== "");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-primary mb-1">Overzicht</h2>
        <p className="text-sm text-muted-foreground">
          Controleer alle gegevens voordat u het product indient.
        </p>
      </div>

      {/* Basic info */}
      <Section title="Basisinformatie">
        <Field label="Productnaam" value={form.title} />
        <Field label="URL slug" value={slugify(form.title)} mono />
        <Field label="Korte omschrijving" value={form.shortDescription} />
        {form.description && (
          <div>
            <dt className="text-xs font-semibold text-muted-foreground mb-0.5">Beschrijving</dt>
            <dd className="text-sm text-primary whitespace-pre-wrap line-clamp-4">
              {form.description}
            </dd>
          </div>
        )}
      </Section>

      {/* Media */}
      <Section title="Media">
        <div className="flex items-center gap-4">
          <div>
            <dt className="text-xs font-semibold text-muted-foreground mb-0.5">Feature graphic</dt>
            <dd className="text-sm text-primary">
              {form.featureGraphic ? form.featureGraphic.name : "Niet ingesteld"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-muted-foreground mb-0.5">Screenshots</dt>
            <dd className="text-sm text-primary">{form.screenshots.length} afbeelding(en)</dd>
          </div>
        </div>
        {(form.featureGraphic || form.screenshots.length > 0) && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            {form.featureGraphic && (
              <img
                src={form.featureGraphic.dataUrl}
                alt="Feature"
                className="h-16 rounded border border-border object-cover"
              />
            )}
            {form.screenshots.map((s) => (
              <img
                key={s.id}
                src={s.dataUrl}
                alt={s.name}
                className="h-16 rounded border border-border object-cover"
              />
            ))}
          </div>
        )}
      </Section>

      {/* Categories & Tags */}
      <Section title="Categorieën & Tags">
        <div>
          <dt className="text-xs font-semibold text-muted-foreground mb-1">Categorieën</dt>
          <dd className="flex flex-wrap gap-1.5">
            {allCategories.map(
              (cat) =>
                cat && (
                  <span
                    key={cat.id}
                    className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-highlight/10 text-highlight"
                  >
                    {cat.name}
                  </span>
                )
            )}
            {form.categoryIds.length === 0 && (
              <span className="text-sm text-danger">Geen categorieën geselecteerd</span>
            )}
          </dd>
        </div>
        {form.tags.length > 0 && (
          <div className="mt-2">
            <dt className="text-xs font-semibold text-muted-foreground mb-1">Tags</dt>
            <dd className="flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex px-2.5 py-0.5 rounded-full text-xs bg-background text-muted-foreground border border-border"
                >
                  {tag}
                </span>
              ))}
            </dd>
          </div>
        )}
      </Section>

      {/* Pricing */}
      <Section title="Prijzen">
        <div className="flex items-center gap-6">
          <Field label="Prijsmodel" value={PRICING_LABEL[form.pricingModel] ?? form.pricingModel} />
          {form.priceInCents !== null && (
            <Field label="Prijs" value={formatCents(form.priceInCents)} />
          )}
        </div>
        {form.pricingDetails && <Field label="Toelichting" value={form.pricingDetails} />}
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              form.terugsluisEligible
                ? "bg-accent/10 text-accent-dark"
                : "bg-background text-muted-foreground"
            }`}
          >
            {form.terugsluisEligible ? (
              <>
                <Check className="h-3 w-3" /> Terugsluis geschikt
              </>
            ) : (
              "Niet Terugsluis geschikt"
            )}
          </span>
        </div>
      </Section>

      {/* Links & Features */}
      <Section title="Links & Features">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Website" value={form.website || "—"} />
          <Field label="Demo" value={form.demoUrl || "—"} />
          <Field label="Video" value={form.videoUrl || "—"} />
        </div>
        {nonEmptyFeatures.length > 0 && (
          <div className="mt-2">
            <dt className="text-xs font-semibold text-muted-foreground mb-1">
              Belangrijkste functies
            </dt>
            <dd className="space-y-1">
              {nonEmptyFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-primary">
                  <Check className="h-3.5 w-3.5 text-accent shrink-0" />
                  {f}
                </div>
              ))}
            </dd>
          </div>
        )}
      </Section>

      <div className="bg-highlight/5 border border-highlight/20 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-highlight shrink-0 mt-0.5" />
        <div className="text-sm text-primary">
          <p className="font-semibold mb-1">Klaar om in te dienen?</p>
          <p className="text-muted-foreground">
            U kunt het product <strong>opslaan als concept</strong> om later verder te bewerken, of
            direct <strong>indienen ter review</strong> zodat ons team het kan beoordelen en
            publiceren.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── UI HELPERS ─────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-lg p-4">
      <h3 className="text-sm font-bold text-primary mb-3">{title}</h3>
      <dl className="space-y-2">{children}</dl>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold text-muted-foreground mb-0.5">{label}</dt>
      <dd className={`text-sm text-primary ${mono ? "font-mono" : ""}`}>{value || "—"}</dd>
    </div>
  );
}
