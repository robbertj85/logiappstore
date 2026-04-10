import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Globe, Star, ShieldCheck,
  CheckCircle2, Monitor,
} from "lucide-react";
import { getListingBySlug, getReviewsByListing, getAllCategories } from "@/lib/data";
import { BadgeDisplay } from "@/components/listings/badge-display";
import { StarRating } from "@/components/listings/star-rating";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) return { title: "Product niet gevonden" };
  return {
    title: `${listing.title} — Logistiek Appstore`,
    description: listing.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) notFound();

  const reviews = getReviewsByListing(listing.id);
  const allCategories = getAllCategories();
  const listingCategories = allCategories.filter((c) =>
    listing.categoryIds.includes(c.id)
  );

  const pricingLabel: Record<string, string> = {
    FREE: "Gratis",
    ONE_TIME: "Eenmalig",
    SUBSCRIPTION_MONTHLY: "Per maand",
    SUBSCRIPTION_YEARLY: "Per jaar",
    PER_USER: "Per gebruiker",
    CUSTOM: "Op aanvraag",
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Terug naar producten
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white border border-border rounded-lg p-6">
              <BadgeDisplay listing={listing} organization={listing.organization} size="md" />
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mt-3">
                {listing.title}
              </h1>
              <p className="text-muted-foreground mt-1">
                door{" "}
                <Link
                  href={`/suppliers/${listing.organization.slug}`}
                  className="text-highlight hover:underline font-medium"
                >
                  {listing.organization.name}
                </Link>
              </p>
              {listing.averageRating && (
                <div className="mt-3">
                  <StarRating
                    rating={listing.averageRating}
                    count={listing.reviewCount}
                    size="md"
                  />
                </div>
              )}
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {listing.shortDescription}
              </p>
            </div>

            {/* Screenshots */}
            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-primary mb-4">Screenshots</h2>
              <div className="grid grid-cols-2 gap-3">
                {listing.media
                  .filter((m) => m.type === "image")
                  .map((media) => (
                    <div
                      key={media.id}
                      className="aspect-video bg-gradient-to-br from-primary/5 to-highlight/5 rounded-lg border border-border relative overflow-hidden"
                    >
                      <Image
                        src={media.url}
                        alt={media.alt ?? listing.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-primary mb-4">Beschrijving</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {listing.description.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) {
                    return (
                      <h3 key={i} className="text-base font-bold text-primary mt-4 mb-2">
                        {line.replace("## ", "")}
                      </h3>
                    );
                  }
                  if (line.startsWith("- **")) {
                    const match = line.match(/- \*\*(.+?)\*\* — (.+)/);
                    if (match) {
                      return (
                        <div key={i} className="flex gap-2 py-1">
                          <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <p>
                            <strong className="text-primary">{match[1]}</strong> — {match[2]}
                          </p>
                        </div>
                      );
                    }
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <div key={i} className="flex gap-2 py-1">
                        <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <p>{line.replace("- ", "")}</p>
                      </div>
                    );
                  }
                  if (line.match(/^\d+\. /)) {
                    return (
                      <div key={i} className="flex gap-2 py-1">
                        <span className="text-sm font-bold text-highlight shrink-0 w-5">
                          {line.match(/^(\d+)/)?.[1]}.
                        </span>
                        <p>{line.replace(/^\d+\. \*\*(.+?)\*\* — /, "$1 — ").replace(/^\d+\. /, "")}</p>
                      </div>
                    );
                  }
                  if (line.trim() === "") return <br key={i} />;
                  return <p key={i}>{line}</p>;
                })}
              </div>
            </div>

            {/* Key features */}
            {listing.keyFeatures && listing.keyFeatures.length > 0 && (
              <div className="bg-white border border-border rounded-lg p-6">
                <h2 className="text-lg font-bold text-primary mb-4">Belangrijkste functies</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {listing.keyFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold text-primary mb-4">
                Beoordelingen ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Er zijn nog geen beoordelingen voor dit product.
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-primary">
                              {review.userName}
                            </span>
                            {review.userOrganization && (
                              <span className="text-xs text-muted-foreground">
                                — {review.userOrganization}
                              </span>
                            )}
                          </div>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                      </div>
                      {review.title && (
                        <p className="text-sm font-semibold text-primary mt-2">{review.title}</p>
                      )}
                      {review.body && (
                        <p className="text-sm text-muted-foreground mt-1">{review.body}</p>
                      )}
                      {review.supplierReply && (
                        <div className="mt-3 bg-background rounded-md p-3 border-l-2 border-accent">
                          <p className="text-xs font-semibold text-accent-dark mb-1">
                            Reactie van leverancier
                          </p>
                          <p className="text-sm text-muted-foreground">{review.supplierReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing card */}
            <div className="bg-white border border-border rounded-lg p-6 sticky top-20">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(listing.priceInCents)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {pricingLabel[listing.pricingModel] ?? listing.pricingModel}
                </p>
                {listing.pricingDetails && (
                  <p className="text-xs text-muted-foreground mt-1">{listing.pricingDetails}</p>
                )}
              </div>

              {listing.terugsluisEligible && (
                <div className="bg-accent/10 border border-accent/20 rounded-md p-3 mb-4">
                  <p className="text-xs font-semibold text-accent-dark flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Betaalbaar met Terugsluis-budget
                  </p>
                </div>
              )}

              <button className="w-full btn-primary mb-2">Aanvragen</button>
              {listing.demoUrl && (
                <a
                  href={listing.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Bekijk demo
                </a>
              )}
              {listing.website && (
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-1.5 text-sm text-highlight hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" />
                  Bezoek website
                </a>
              )}
            </div>

            {/* Supplier card */}
            <div className="bg-white border border-border rounded-lg p-6">
              <h3 className="text-sm font-bold text-primary mb-3">Leverancier</h3>
              <Link
                href={`/suppliers/${listing.organization.slug}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-12 h-12 bg-highlight/10 rounded-lg flex items-center justify-center text-highlight font-bold text-lg">
                  {listing.organization.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary group-hover:text-highlight transition-colors">
                    {listing.organization.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{listing.organization.city}</p>
                </div>
              </Link>
              {listing.organization.kvkVerified && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-accent-dark">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  KvK geverifieerd
                </div>
              )}
            </div>

            {/* Categories */}
            <div className="bg-white border border-border rounded-lg p-6">
              <h3 className="text-sm font-bold text-primary mb-3">Categorieën</h3>
              <div className="flex flex-wrap gap-1.5">
                {listingCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="category-pill hover:bg-highlight/20 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags */}
            {listing.tags.length > 0 && (
              <div className="bg-white border border-border rounded-lg p-6">
                <h3 className="text-sm font-bold text-primary mb-3">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {listing.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex px-2.5 py-0.5 rounded-full text-xs bg-background text-muted-foreground border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
