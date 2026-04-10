"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft, Eye, MousePointerClick, Star, TrendingUp,
  BarChart3, Calendar, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { getSupplierListings } from "@/lib/data";

export default function SupplierAnalyticsPage() {
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

  // Demo analytics data
  const weeklyData = [
    { week: "W10", impressions: 312, clicks: 18, conversions: 3 },
    { week: "W11", impressions: 287, clicks: 21, conversions: 2 },
    { week: "W12", impressions: 356, clicks: 29, conversions: 5 },
    { week: "W13", impressions: 401, clicks: 34, conversions: 4 },
    { week: "W14", impressions: 445, clicks: 38, conversions: 6 },
    { week: "W15", impressions: 389, clicks: 31, conversions: 3 },
  ];

  const totalImpressions = weeklyData.reduce((s, w) => s + w.impressions, 0);
  const totalClicks = weeklyData.reduce((s, w) => s + w.clicks, 0);
  const totalConversions = weeklyData.reduce((s, w) => s + w.conversions, 0);
  const ctr = ((totalClicks / totalImpressions) * 100).toFixed(1);
  const maxImpressions = Math.max(...weeklyData.map((w) => w.impressions));

  const topSources = [
    { source: "Direct / Bookmark", visits: 487, pct: 39 },
    { source: "Zoeken op platform", visits: 389, pct: 31 },
    { source: "Categorie browse", visits: 234, pct: 19 },
    { source: "Aanbevolen producten", visits: 137, pct: 11 },
  ];

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
            <h1 className="text-2xl font-bold text-primary">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Prestaties van uw producten op de Logistiek Appstore
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white border border-border rounded-md px-3 py-2">
            <Calendar className="h-4 w-4" />
            Laatste 6 weken
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Impressies", value: totalImpressions.toLocaleString("nl-NL"), change: "+12%", up: true, icon: Eye },
            { label: "Clicks", value: totalClicks.toString(), change: "+8%", up: true, icon: MousePointerClick },
            { label: "CTR", value: `${ctr}%`, change: "+0.3%", up: true, icon: TrendingUp },
            { label: "Aanvragen", value: totalConversions.toString(), change: "-1", up: false, icon: Star },
          ].map((kpi) => (
            <div key={kpi.label} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className="h-5 w-5 text-muted-foreground" />
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${kpi.up ? "text-accent-dark" : "text-danger"}`}>
                  {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-primary">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Impressions bar chart */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-primary">Impressies per week</h2>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-end gap-3 h-40">
                {weeklyData.map((week) => (
                  <div key={week.week} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">{week.impressions}</span>
                    <div
                      className="w-full bg-highlight/80 rounded-t-md transition-all hover:bg-highlight"
                      style={{ height: `${(week.impressions / maxImpressions) * 100}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground font-medium">{week.week}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-listing performance */}
            <div className="card p-6">
              <h2 className="text-base font-bold text-primary mb-4">Prestaties per product</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-semibold text-muted-foreground pb-3">Product</th>
                      <th className="text-right text-xs font-semibold text-muted-foreground pb-3">Impressies</th>
                      <th className="text-right text-xs font-semibold text-muted-foreground pb-3">Clicks</th>
                      <th className="text-right text-xs font-semibold text-muted-foreground pb-3">CTR</th>
                      <th className="text-right text-xs font-semibold text-muted-foreground pb-3">Beoordeling</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr key={listing.id} className="border-b border-border last:border-0">
                        <td className="py-3">
                          <Link href={`/products/${listing.slug}`} className="font-medium text-primary hover:text-highlight">
                            {listing.title}
                          </Link>
                        </td>
                        <td className="text-right text-muted-foreground py-3">1.247</td>
                        <td className="text-right text-muted-foreground py-3">89</td>
                        <td className="text-right text-muted-foreground py-3">7.1%</td>
                        <td className="text-right py-3">
                          <span className="text-amber-500">★</span> {listing.averageRating?.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Traffic sources */}
            <div className="card p-6">
              <h3 className="text-base font-bold text-primary mb-4">Verkeersbronnen</h3>
              <div className="space-y-3">
                {topSources.map((source) => (
                  <div key={source.source}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{source.source}</span>
                      <span className="font-semibold text-primary">{source.pct}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="bg-highlight rounded-full h-2"
                        style={{ width: `${source.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top search terms */}
            <div className="card p-6">
              <h3 className="text-base font-bold text-primary mb-4">Populaire zoektermen</h3>
              <div className="space-y-2">
                {[
                  { term: "TMS", count: 156 },
                  { term: "transport management", count: 89 },
                  { term: "ritplanning", count: 67 },
                  { term: "facturatie transport", count: 45 },
                  { term: "CBS module", count: 34 },
                ].map((item) => (
                  <div key={item.term} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.term}</span>
                    <span className="text-xs bg-background px-2 py-0.5 rounded-full text-muted-foreground">{item.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
