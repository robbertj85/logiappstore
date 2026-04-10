"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Wallet, ShoppingBag, Star, Heart, TrendingDown, TrendingUp,
  ArrowRight, Package,
} from "lucide-react";
import Link from "next/link";

export default function ConsumerDashboard() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  if (!isLoggedIn || !user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }

  // Demo budget data
  const budget = {
    totalAllocated: 1500000,
    totalSpent: 348900,
    remaining: 1151100,
  };
  const percentSpent = Math.round((budget.totalSpent / budget.totalAllocated) * 100);
  const formatEur = (c: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(c / 100);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">
            Welkom, {user.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user.organization} — Vervoerder Dashboard
          </p>
        </div>

        {/* Budget card */}
        <div className="bg-primary rounded-xl p-6 sm:p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-white/60">Terugsluis-budget 2026</p>
              <p className="text-2xl sm:text-3xl font-extrabold">{formatEur(budget.remaining)}</p>
            </div>
          </div>
          <div className="w-full bg-white/15 rounded-full h-2.5 mb-2">
            <div
              className="bg-accent rounded-full h-2.5"
              style={{ width: `${percentSpent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/50">
            <span>{percentSpent}% besteed</span>
            <span>Totaal: {formatEur(budget.totalAllocated)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Besteed", value: formatEur(budget.totalSpent), icon: TrendingDown, color: "text-danger" },
            { label: "Beschikbaar", value: formatEur(budget.remaining), icon: TrendingUp, color: "text-accent" },
            { label: "Bestellingen", value: "0", icon: ShoppingBag, color: "text-highlight" },
            { label: "Beoordelingen", value: "0", icon: Star, color: "text-warning" },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 text-center">
              <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/products" className="card p-5 flex items-center gap-4 hover:border-highlight/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-highlight/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-highlight" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary group-hover:text-highlight transition-colors">Producten zoeken</p>
              <p className="text-xs text-muted-foreground">Vind IT-oplossingen</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link href="/products" className="card p-5 flex items-center gap-4 hover:border-highlight/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary group-hover:text-highlight transition-colors">Favorieten</p>
              <p className="text-xs text-muted-foreground">Opgeslagen producten</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link href="/products" className="card p-5 flex items-center gap-4 hover:border-highlight/30 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary group-hover:text-highlight transition-colors">Beoordelingen</p>
              <p className="text-xs text-muted-foreground">Uw reviews</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}
