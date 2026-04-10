"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Package, Eye, MousePointerClick, Star, MessageSquare,
  Plus, ArrowRight, BarChart3, ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { getSupplierListings } from "@/lib/data";

export default function SupplierDashboard() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  if (!isLoggedIn || !user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  // Get listings for Transtics (demo supplier)
  const listings = getSupplierListings("org-transtics");

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Welkom, {user.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {user.organization} — Leverancier Dashboard
            </p>
          </div>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="h-4 w-4" />
            Nieuw product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Producten", value: listings.length.toString(), icon: Package, color: "text-highlight" },
            { label: "Impressies", value: "1.247", icon: Eye, color: "text-primary" },
            { label: "Clicks", value: "89", icon: MousePointerClick, color: "text-accent" },
            { label: "Gem. beoordeling", value: "4.5", icon: Star, color: "text-warning" },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 text-center">
              <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-primary">Uw producten</h2>
            </div>
            <div className="space-y-3">
              {listings.map((listing) => (
                <div key={listing.id} className="card p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-highlight/10 rounded-lg flex items-center justify-center text-highlight font-bold">
                    {listing.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary truncate">{listing.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent-dark">
                        Gepubliceerd
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ★ {listing.averageRating?.toFixed(1)} ({listing.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-muted-foreground">Impressies</p>
                    <p className="text-sm font-bold text-primary">1.247</p>
                  </div>
                </div>
              ))}

              {listings.length === 0 && (
                <div className="card p-8 text-center">
                  <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    U heeft nog geen producten. Maak uw eerste listing aan.
                  </p>
                  <button className="btn-primary mt-4 inline-flex items-center gap-2 text-sm">
                    <Plus className="h-4 w-4" />
                    Nieuw product
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent activity */}
            <div className="card p-5">
              <h3 className="text-sm font-bold text-primary mb-3">Recente activiteit</h3>
              <div className="space-y-3">
                {[
                  { text: "Nieuwe beoordeling op Transtics TMS Pro", icon: Star, time: "2 uur geleden" },
                  { text: "Aanvraag ontvangen van Bakker Logistics", icon: ShoppingBag, time: "1 dag geleden" },
                  { text: "Reactie op review geplaatst", icon: MessageSquare, time: "3 dagen geleden" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shrink-0">
                      <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-primary">{item.text}</p>
                      <p className="text-[10px] text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="card p-5">
              <h3 className="text-sm font-bold text-primary mb-3">Snelle acties</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 text-left text-sm text-primary hover:text-highlight p-2 rounded-md hover:bg-background transition-colors">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  Bekijk analytics
                </button>
                <button className="w-full flex items-center gap-3 text-left text-sm text-primary hover:text-highlight p-2 rounded-md hover:bg-background transition-colors">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Reageer op reviews
                </button>
                <Link
                  href="/products/transtics-tms-pro"
                  className="w-full flex items-center gap-3 text-left text-sm text-primary hover:text-highlight p-2 rounded-md hover:bg-background transition-colors"
                >
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  Bekijk uw listing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
