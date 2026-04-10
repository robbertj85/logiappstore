import Image from "next/image";
import Link from "next/link";
import type { Listing, Organization } from "@logiappstore/shared";
import { BadgeDisplay } from "./badge-display";
import { StarRating } from "./star-rating";
import { formatPrice } from "@/lib/utils";

function hasRealImage(url: string): boolean {
  // Only return true for screenshots we actually captured from supplier websites
  const knownPrefixes = ["simacan", "ptv", "addsecure", "gps-buddy", "solid-wms", "centric", "visma-loginex"];
  return url.startsWith("/uploads/listings/") && knownPrefixes.some((p) => url.includes(p));
}

interface ListingCardProps {
  listing: Listing;
  organization?: Organization;
}

export function ListingCard({ listing, organization }: ListingCardProps) {
  const firstImage = listing.media.find((m) => m.type === "image");
  const imageUrl = firstImage?.url;
  const showImage = imageUrl && hasRealImage(imageUrl);

  return (
    <Link href={`/products/${listing.slug}`} className="group">
      <div className="card overflow-hidden h-full flex flex-col">
        {/* Feature graphic */}
        <div className="aspect-video bg-gradient-to-br from-primary/5 to-highlight/5 relative overflow-hidden">
          {showImage ? (
            <Image
              src={imageUrl}
              alt={firstImage?.alt ?? listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-primary/20">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          {/* Badges */}
          <div className="mb-2">
            <BadgeDisplay listing={listing} organization={organization} />
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-primary group-hover:text-highlight transition-colors line-clamp-1">
            {listing.title}
          </h3>

          {/* Supplier */}
          {organization && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {organization.name}
            </p>
          )}

          {/* Description */}
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1">
            {listing.shortDescription}
          </p>

          {/* Bottom row */}
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            {/* Rating */}
            {listing.averageRating && (
              <StarRating rating={listing.averageRating} count={listing.reviewCount} />
            )}

            {/* Price */}
            <span className="text-sm font-semibold text-primary">
              {formatPrice(listing.priceInCents)}
              {listing.pricingModel === "SUBSCRIPTION_MONTHLY" && (
                <span className="text-xs font-normal text-muted-foreground">/mnd</span>
              )}
              {listing.pricingModel === "PER_USER" && (
                <span className="text-xs font-normal text-muted-foreground">/stuk</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
