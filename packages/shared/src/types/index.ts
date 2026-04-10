// ─── ENUMS ──────────────────────────────────────────────────────

export type UserRole = "CONSUMER" | "SUPPLIER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
export type OrganizationType = "TRANSPORT_COMPANY" | "IT_SUPPLIER" | "GOVERNING_BODY";
export type ListingStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED";
export type PricingModel = "FREE" | "ONE_TIME" | "SUBSCRIPTION_MONTHLY" | "SUBSCRIPTION_YEARLY" | "PER_USER" | "CUSTOM";
export type OrderStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type VerificationTier = "BASIC" | "VERIFIED" | "TRUSTED_PARTNER";
export type BadgeType = "GEVERIFIEERD" | "VERTROUWDE_PARTNER" | "TERUGSLUIS_GESCHIKT" | "POPULAIR" | "AANBEVOLEN";

// ─── CATEGORIES ─────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string | null;
  sortOrder: number;
  children?: Category[];
}

// ─── ORGANIZATIONS ──────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  kvkNumber?: string;
  niwoNumber?: string;
  description?: string;
  logo?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country: string;
  kvkVerified: boolean;
  verificationTier: VerificationTier;
  trustedPartner: boolean;
  vehicles?: Vehicle[];
}

// ─── LISTINGS ───────────────────────────────────────────────────

export interface ListingMedia {
  id: string;
  url: string;
  alt?: string;
  type: "image" | "video";
  sortOrder: number;
}

export interface Listing {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  status: ListingStatus;
  pricingModel: PricingModel;
  priceInCents?: number | null;
  pricingDetails?: string;
  website?: string;
  demoUrl?: string;
  videoUrl?: string;
  featured: boolean;
  terugsluisEligible: boolean;
  badgeAanbevolen: boolean;
  badgeAanbevolenBy?: string;
  featureGraphic?: string;
  publishedAt?: string;
  organizationId: string;
  organization?: Organization;
  categoryIds: string[];
  categories?: Category[];
  tags: string[];
  media: ListingMedia[];
  keyFeatures?: string[];
  averageRating?: number;
  reviewCount?: number;
}

// ─── REVIEWS ────────────────────────────────────────────────────

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userOrganization?: string;
  rating: number;
  title?: string;
  body?: string;
  supplierReply?: string;
  supplierRepliedAt?: string;
  createdAt: string;
}

// ─── ORDERS ─────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  listingId: string;
  listingTitle: string;
  quantity: number;
  priceInCents: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerOrgId: string;
  supplierOrgId: string;
  status: OrderStatus;
  totalInCents: number;
  terugsluisAmountInCents?: number;
  items: OrderItem[];
  createdAt: string;
}

// ─── TERUGSLUIS BUDGET ──────────────────────────────────────────

export interface TerugsluitBudget {
  id: string;
  organizationId: string;
  fiscalYear: number;
  totalAllocated: number;
  totalSpent: number;
  remaining: number;
}

// ─── VEHICLES (RDW) ────────────────────────────────────────────

export interface Vehicle {
  kenteken: string;
  merk: string;
  handelsbenaming: string;
  voertuigsoort: string;
  eerste_kleur: string;
  toegestane_maximum_massa_voertuig: number;
  datum_eerste_toelating: string;
  vervaldatum_apk: string;
  wam_verzekerd: string;
}

// ─── BADGES ─────────────────────────────────────────────────────

export interface Badge {
  type: BadgeType;
  label: string;
  description: string;
  color: string;
}

export const BADGES: Record<BadgeType, Badge> = {
  GEVERIFIEERD: {
    type: "GEVERIFIEERD",
    label: "Geverifieerd",
    description: "Leverancier is geverifieerd via KvK",
    color: "accent",
  },
  VERTROUWDE_PARTNER: {
    type: "VERTROUWDE_PARTNER",
    label: "Vertrouwde Partner",
    description: "Handmatig goedgekeurd door brancheorganisatie",
    color: "primary",
  },
  TERUGSLUIS_GESCHIKT: {
    type: "TERUGSLUIS_GESCHIKT",
    label: "Terugsluis Geschikt",
    description: "Geschikt voor besteding van Terugsluis-budget",
    color: "primary",
  },
  POPULAIR: {
    type: "POPULAIR",
    label: "Populair",
    description: "10+ aankopen en gemiddeld 4.0+ beoordeling",
    color: "warning",
  },
  AANBEVOLEN: {
    type: "AANBEVOLEN",
    label: "Aanbevolen",
    description: "Aanbevolen door brancheorganisatie",
    color: "highlight",
  },
};
