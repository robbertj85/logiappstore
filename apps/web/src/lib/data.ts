import type { Listing, Organization, Review, Category } from "@logiappstore/shared";
import { TLN_CATEGORIES, flattenCategories, findCategoryBySlug } from "@logiappstore/shared";
import listingsData from "../../../../data/listings.json";
import suppliersData from "../../../../data/suppliers.json";
import reviewsData from "../../../../data/reviews.json";

const listings = listingsData as Listing[];
const suppliers = suppliersData as Organization[];
const reviews = reviewsData as Review[];

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
