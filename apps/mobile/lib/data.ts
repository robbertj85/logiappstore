import type { Listing, Organization, Review } from "@logiappstore/shared";
import { TLN_CATEGORIES, flattenCategories, findCategoryBySlug } from "@logiappstore/shared";

// In production, this would fetch from an API.
// For demo, we import JSON directly.
import listingsData from "../../../data/listings.json";
import suppliersData from "../../../data/suppliers.json";
import reviewsData from "../../../data/reviews.json";

const listings = listingsData as Listing[];
const suppliers = suppliersData as Organization[];
const reviews = reviewsData as Review[];

export function getListings() {
  return listings.filter((l) => l.status === "PUBLISHED");
}

export function getFeaturedListings() {
  return listings.filter((l) => l.status === "PUBLISHED" && l.featured);
}

export function getListingBySlug(slug: string) {
  const listing = listings.find((l) => l.slug === slug && l.status === "PUBLISHED");
  if (!listing) return undefined;
  const org = suppliers.find((s) => s.id === listing.organizationId);
  return { ...listing, organization: org };
}

export function getSupplierById(id: string) {
  return suppliers.find((s) => s.id === id);
}

export function getReviewsByListing(listingId: string) {
  return reviews.filter((r) => r.listingId === listingId);
}

export function getCategories() {
  return TLN_CATEGORIES;
}

export function getCategoryBySlug(slug: string) {
  return findCategoryBySlug(slug);
}

export function searchListings(query: string) {
  const q = query.toLowerCase();
  return listings.filter(
    (l) =>
      l.status === "PUBLISHED" &&
      (l.title.toLowerCase().includes(q) ||
        l.shortDescription.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q)))
  );
}
