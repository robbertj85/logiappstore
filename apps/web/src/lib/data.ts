import type { Listing, Organization, Review, Category } from "@logiappstore/shared";
import { TLN_CATEGORIES, flattenCategories, findCategoryBySlug } from "@logiappstore/shared";
import listingsData from "../../../../data/listings.json";
import suppliersData from "../../../../data/suppliers.json";
import reviewsData from "../../../../data/reviews.json";
import ordersData from "../../../../data/orders.json";

const listings = listingsData as Listing[];
const suppliers = suppliersData as Organization[];
const reviews = reviewsData as Review[];

// Order/invoice types
export type InvoiceStatus = "INGEDIEND" | "IN_BEHANDELING" | "GOEDGEKEURD" | "UITBETAALD" | "AFGEWEZEN";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  fileName: string;
  uploadedAt: string;
  amountInCents: number;
  status: InvoiceStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  paidAt: string | null;
  paidOnTime: boolean | null;
  rejectionReason?: string;
  notes: string;
}

export interface OrderWithInvoice {
  id: string;
  orderNumber: string;
  buyerOrgName: string;
  buyerContact: string;
  buyerEmail: string;
  buyerKvk: string;
  supplierOrgId: string;
  supplierOrgName: string;
  listingId: string;
  listingTitle: string;
  status: string;
  totalInCents: number;
  terugsluisEligible: boolean;
  createdAt: string;
  confirmedAt: string | null;
  completedAt: string | null;
  invoice: Invoice | null;
}

const orders = ordersData as OrderWithInvoice[];

export function getListings(): Listing[] {
  return listings.filter((l) => l.status === "PUBLISHED");
}

export function getFeaturedListings(): Listing[] {
  return listings.filter((l) => l.status === "PUBLISHED" && l.featured);
}

export function getListingBySlug(slug: string): (Listing & { organization: Organization }) | undefined {
  const listing = listings.find((l) => l.slug === slug && l.status === "PUBLISHED");
  if (!listing) return undefined;
  const org = suppliers.find((s) => s.id === listing.organizationId);
  if (!org) return undefined;
  return { ...listing, organization: org };
}

export function getListingsByCategory(categoryId: string): Listing[] {
  return listings.filter(
    (l) => l.status === "PUBLISHED" && l.categoryIds.includes(categoryId)
  );
}

export function searchListings(query: string): Listing[] {
  const q = query.toLowerCase();
  return listings.filter(
    (l) =>
      l.status === "PUBLISHED" &&
      (l.title.toLowerCase().includes(q) ||
        l.shortDescription.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q)))
  );
}

export function getSuppliers(): Organization[] {
  return suppliers;
}

export function getSupplierBySlug(slug: string): Organization | undefined {
  return suppliers.find((s) => s.slug === slug);
}

export function getSupplierListings(organizationId: string): Listing[] {
  return listings.filter(
    (l) => l.organizationId === organizationId && l.status === "PUBLISHED"
  );
}

export function getReviewsByListing(listingId: string): Review[] {
  return reviews.filter((r) => r.listingId === listingId);
}

export function getCategories(): Category[] {
  return TLN_CATEGORIES;
}

export function getTopLevelCategories(): Category[] {
  return TLN_CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return findCategoryBySlug(slug);
}

export function getAllCategories(): Category[] {
  return flattenCategories(TLN_CATEGORIES);
}

export function getSupplierById(id: string): Organization | undefined {
  return suppliers.find((s) => s.id === id);
}

// Order / Invoice functions

export function getAllOrders(): OrderWithInvoice[] {
  return orders;
}

export function getOrdersByBuyer(email: string): OrderWithInvoice[] {
  return orders.filter((o) => o.buyerEmail === email);
}

export function getOrdersBySupplier(supplierOrgId: string): OrderWithInvoice[] {
  return orders.filter((o) => o.supplierOrgId === supplierOrgId);
}

export function getOrderById(id: string): OrderWithInvoice | undefined {
  return orders.find((o) => o.id === id);
}

export function getOrdersWithInvoices(): OrderWithInvoice[] {
  return orders.filter((o) => o.invoice !== null);
}

export function getInvoiceStats() {
  const withInvoice = orders.filter((o) => o.invoice !== null);
  const totalSubmitted = withInvoice.length;
  const ingediend = withInvoice.filter((o) => o.invoice!.status === "INGEDIEND").length;
  const inBehandeling = withInvoice.filter((o) => o.invoice!.status === "IN_BEHANDELING").length;
  const goedgekeurd = withInvoice.filter((o) => o.invoice!.status === "GOEDGEKEURD").length;
  const uitbetaald = withInvoice.filter((o) => o.invoice!.status === "UITBETAALD").length;
  const afgewezen = withInvoice.filter((o) => o.invoice!.status === "AFGEWEZEN").length;
  const totalAmountInCents = withInvoice.reduce((sum, o) => sum + o.invoice!.amountInCents, 0);
  const paidAmountInCents = withInvoice
    .filter((o) => o.invoice!.status === "UITBETAALD")
    .reduce((sum, o) => sum + o.invoice!.amountInCents, 0);
  const paidOnTime = withInvoice.filter((o) => o.invoice!.paidOnTime === true).length;
  const paidLate = withInvoice.filter((o) => o.invoice!.paidOnTime === false).length;

  return {
    totalSubmitted,
    ingediend,
    inBehandeling,
    goedgekeurd,
    uitbetaald,
    afgewezen,
    totalAmountInCents,
    paidAmountInCents,
    paidOnTime,
    paidLate,
  };
}

export interface ConsumerBudgetStats {
  buyerOrgName: string;
  buyerContact: string;
  buyerEmail: string;
  buyerKvk: string;
  budgetAllocated: number; // in cents
  totalOrders: number;
  totalOrderedInCents: number;
  invoicesSubmitted: number;
  invoicesPaid: number;
  paidAmountInCents: number;
  pendingAmountInCents: number;
  rejectedCount: number;
}

export function getConsumerBudgetStats(): ConsumerBudgetStats[] {
  // Group orders by buyer KvK
  const byBuyer = new Map<string, OrderWithInvoice[]>();
  for (const order of orders) {
    const existing = byBuyer.get(order.buyerKvk) ?? [];
    existing.push(order);
    byBuyer.set(order.buyerKvk, existing);
  }

  // Demo budget allocations per KvK (in cents)
  const budgetAllocations: Record<string, number> = {
    "87654321": 1500000,  // De Vries Transport BV
    "55667788": 1200000,  // Bakker Logistics BV
    "33445566": 1000000,  // Van Dalen Transport
    "11223344": 1800000,  // Jansen & Zonen Transportbedrijf
    "99887766": 800000,   // Groot Transport NV
    "44556677": 1100000,  // Snelweg Logistics
  };

  const result: ConsumerBudgetStats[] = [];

  for (const [kvk, buyerOrders] of byBuyer) {
    const first = buyerOrders[0];
    const terugsluisOrders = buyerOrders.filter((o) => o.terugsluisEligible);
    const withInvoice = terugsluisOrders.filter((o) => o.invoice !== null);
    const paid = withInvoice.filter((o) => o.invoice!.status === "UITBETAALD");
    const pending = withInvoice.filter((o) =>
      o.invoice!.status === "INGEDIEND" ||
      o.invoice!.status === "IN_BEHANDELING" ||
      o.invoice!.status === "GOEDGEKEURD"
    );
    const rejected = withInvoice.filter((o) => o.invoice!.status === "AFGEWEZEN");

    result.push({
      buyerOrgName: first.buyerOrgName,
      buyerContact: first.buyerContact,
      buyerEmail: first.buyerEmail,
      buyerKvk: kvk,
      budgetAllocated: budgetAllocations[kvk] ?? 1000000,
      totalOrders: buyerOrders.length,
      totalOrderedInCents: terugsluisOrders.reduce((sum, o) => sum + o.totalInCents, 0),
      invoicesSubmitted: withInvoice.length,
      invoicesPaid: paid.length,
      paidAmountInCents: paid.reduce((sum, o) => sum + o.invoice!.amountInCents, 0),
      pendingAmountInCents: pending.reduce((sum, o) => sum + o.invoice!.amountInCents, 0),
      rejectedCount: rejected.length,
    });
  }

  // Sort by paid amount descending
  result.sort((a, b) => b.paidAmountInCents - a.paidAmountInCents);
  return result;
}
