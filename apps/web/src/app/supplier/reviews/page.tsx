"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft, Star, MessageSquare, Send, ChevronDown, ChevronUp,
} from "lucide-react";
import { getSupplierListings, getReviewsByListing } from "@/lib/data";
import type { Review } from "@logiappstore/shared";

export default function SupplierReviewsPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [repliedReviews, setRepliedReviews] = useState<Set<string>>(new Set());

  if (isLoading) {
    return <div className="bg-background min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Laden...</div></div>;
  }
  if (!isLoggedIn || !user || user.role !== "SUPPLIER") {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  const listings = getSupplierListings("org-transtics");
  const allReviews: (Review & { listingTitle: string; listingSlug: string })[] = [];
  for (const listing of listings) {
    const reviews = getReviewsByListing(listing.id);
    for (const review of reviews) {
      allReviews.push({ ...review, listingTitle: listing.title, listingSlug: listing.slug });
    }
  }
  allReviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
    : "0";
  const unreplied = allReviews.filter((r) => !r.supplierReply && !repliedReviews.has(r.id)).length;

  const handleReply = (reviewId: string) => {
    if (replyTexts[reviewId]?.trim()) {
      setRepliedReviews((prev) => new Set(prev).add(reviewId));
      setExpandedReview(null);
    }
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

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">Beoordelingen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bekijk en reageer op beoordelingen van uw producten
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-5 text-center">
            <Star className="h-5 w-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">{avgRating}</p>
            <p className="text-xs text-muted-foreground">Gemiddelde score</p>
          </div>
          <div className="card p-5 text-center">
            <MessageSquare className="h-5 w-5 text-highlight mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">{allReviews.length}</p>
            <p className="text-xs text-muted-foreground">Totaal reviews</p>
          </div>
          <div className="card p-5 text-center">
            <Send className="h-5 w-5 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">{unreplied}</p>
            <p className="text-xs text-muted-foreground">Onbeantwoord</p>
          </div>
        </div>

        {/* Reviews list */}
        <div className="space-y-4">
          {allReviews.length === 0 ? (
            <div className="card p-8 text-center">
              <Star className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Er zijn nog geen beoordelingen voor uw producten.</p>
            </div>
          ) : (
            allReviews.map((review) => {
              const hasReply = !!review.supplierReply || repliedReviews.has(review.id);
              const isExpanded = expandedReview === review.id;

              return (
                <div key={review.id} className="card p-5">
                  {/* Review header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-primary">{review.userName}</span>
                        {review.userOrganization && (
                          <span className="text-xs text-muted-foreground">— {review.userOrganization}</span>
                        )}
                        <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/products/${review.listingSlug}`}
                      className="text-xs text-highlight hover:underline shrink-0"
                    >
                      {review.listingTitle}
                    </Link>
                  </div>

                  {/* Review content */}
                  {review.title && (
                    <p className="text-sm font-semibold text-primary mt-3">{review.title}</p>
                  )}
                  {review.body && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.body}</p>
                  )}

                  {/* Existing reply */}
                  {review.supplierReply && (
                    <div className="mt-4 bg-background rounded-md p-4 border-l-2 border-accent">
                      <p className="text-xs font-semibold text-accent-dark mb-1">Uw reactie</p>
                      <p className="text-sm text-muted-foreground">{review.supplierReply}</p>
                    </div>
                  )}

                  {/* Just replied */}
                  {!review.supplierReply && repliedReviews.has(review.id) && (
                    <div className="mt-4 bg-background rounded-md p-4 border-l-2 border-accent">
                      <p className="text-xs font-semibold text-accent-dark mb-1">Uw reactie (zojuist geplaatst)</p>
                      <p className="text-sm text-muted-foreground">{replyTexts[review.id]}</p>
                    </div>
                  )}

                  {/* Reply button / form */}
                  {!hasReply && (
                    <div className="mt-4">
                      {isExpanded ? (
                        <div className="space-y-3">
                          <textarea
                            className="w-full border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-highlight/50 focus:border-highlight resize-none"
                            rows={3}
                            placeholder="Schrijf uw reactie..."
                            value={replyTexts[review.id] ?? ""}
                            onChange={(e) =>
                              setReplyTexts((prev) => ({ ...prev, [review.id]: e.target.value }))
                            }
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReply(review.id)}
                              disabled={!replyTexts[review.id]?.trim()}
                              className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Plaatsen
                            </button>
                            <button
                              onClick={() => setExpandedReview(null)}
                              className="text-sm text-muted-foreground hover:text-primary px-3 py-2"
                            >
                              Annuleren
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setExpandedReview(review.id)}
                          className="text-sm text-highlight hover:underline flex items-center gap-1"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Reageren
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
