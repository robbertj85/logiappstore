"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft, Plus, Eye, Star, ExternalLink, Edit, MoreHorizontal,
  CheckCircle2, Clock, Archive,
} from "lucide-react";
import { getSupplierListings, getAllCategories } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export default function SupplierListingsPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="bg-background min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Laden...</div></div>;
  }
  if (!isLoggedIn || !user || user.role !== "SUPPLIER") {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  const listings = getSupplierListings("org-transtics");
  const allCategories = getAllCategories();

  const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; className: string }> = {
    PUBLISHED: { label: "Gepubliceerd", icon: CheckCircle2, className: "bg-accent/10 text-accent-dark" },
    PENDING_REVIEW: { label: "In review", icon: Clock, className: "bg-warning/10 text-amber-700" },
    DRAFT: { label: "Concept", icon: Edit, className: "bg-muted text-muted-foreground" },
    ARCHIVED: { label: "Gearchiveerd", icon: Archive, className: "bg-muted text-muted-foreground" },
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/supplier"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">Uw listings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Beheer uw productlistings op de Logistiek Digistore
            </p>
          </div>
          <Link href="/supplier/nieuw-product" className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4" />
            Nieuw product
          </Link>
        </div>

        {/* Listings */}
        <div className="space-y-4">
          {listings.length === 0 ? (
            <div className="card p-12 text-center">
              <Edit className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg font-bold text-primary">Geen listings</p>
              <p className="text-sm text-muted-foreground mt-1">
                U heeft nog geen producten aangemaakt. Start met uw eerste listing.
              </p>
              <Link href="/supplier/nieuw-product" className="btn-primary inline-flex items-center gap-2 mt-4">
                <Plus className="h-4 w-4" />
                Nieuw product
              </Link>
            </div>
          ) : (
            listings.map((listing) => {
              const status = statusConfig[listing.status] ?? statusConfig.DRAFT;
              const StatusIcon = status.icon;
              const listingCategories = allCategories.filter((c) => listing.categoryIds.includes(c.id));

              const firstImage = listing.media.find((m) => m.type === "image");
              // Only show image if file likely exists (DALTI member screenshots)
              const knownPrefixes = ["simacan", "ptv", "addsecure", "gps-buddy", "solid-wms", "centric", "visma-loginex"];
              const hasImage = firstImage && knownPrefixes.some((p) => firstImage.url.includes(p));

              return (
                <div key={listing.id} className="card overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {/* Thumbnail */}
                    <div className="sm:w-56 h-36 sm:h-auto bg-gradient-to-br from-primary/5 to-highlight/5 relative shrink-0">
                      {hasImage ? (
                        <Image
                          src={firstImage.url}
                          alt={listing.title}
                          fill
                          className="object-cover"
                          sizes="224px"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-primary/20">
                          <Eye className="h-10 w-10" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.className}`}>
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </span>
                            {listing.terugsluisEligible && (
                              <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                Terugsluis
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-primary">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {listing.shortDescription}
                          </p>
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-semibold text-primary">{listing.averageRating?.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">({listing.reviewCount} reviews)</span>
                        </div>

                        <span className="text-sm font-semibold text-primary">
                          {formatPrice(listing.priceInCents)}
                          {listing.pricingModel === "SUBSCRIPTION_MONTHLY" && (
                            <span className="text-xs font-normal text-muted-foreground">/mnd</span>
                          )}
                        </span>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          1.247 impressies
                        </div>

                        {/* Categories */}
                        <div className="flex-1" />
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {listingCategories.slice(0, 3).map((cat) => (
                            <span key={cat.id} className="category-pill text-[10px]">
                              {cat.name}
                            </span>
                          ))}
                          {listingCategories.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{listingCategories.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-4">
                        <Link
                          href={`/products/${listing.slug}`}
                          className="text-xs font-semibold text-highlight hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Bekijk in appstore
                        </Link>
                        <span className="text-border">|</span>
                        <button className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1">
                          <Edit className="h-3 w-3" />
                          Bewerken
                        </button>
                        <span className="text-border">|</span>
                        <button className="text-xs font-semibold text-muted-foreground hover:text-primary flex items-center gap-1">
                          <MoreHorizontal className="h-3 w-3" />
                          Meer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
