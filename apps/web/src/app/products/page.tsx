import { getListings, getTopLevelCategories, getSupplierById } from "@/lib/data";
import { ListingCard } from "@/components/listings/listing-card";
import { Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alle producten — Logistiek Digistore",
  description: "Ontdek IT-oplossingen voor uw transportbedrijf. Filter op categorie, prijs en beoordeling.",
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const listings = getListings();
  const categories = getTopLevelCategories();

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Alle producten
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {listings.length} IT-oplossingen voor transport en logistiek
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 shrink-0">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Zoek producten..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-highlight/50 focus:border-highlight"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white border border-border rounded-lg p-4">
              <h3 className="text-sm font-bold text-primary mb-3">Categorieën</h3>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button className="w-full text-left text-sm text-muted-foreground hover:text-primary py-1 px-2 rounded hover:bg-background transition-colors">
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price filter */}
            <div className="bg-white border border-border rounded-lg p-4 mt-4">
              <h3 className="text-sm font-bold text-primary mb-3">Prijsmodel</h3>
              <ul className="space-y-2">
                {[
                  { label: "Gratis", value: "FREE" },
                  { label: "Eenmalig", value: "ONE_TIME" },
                  { label: "Abonnement", value: "SUBSCRIPTION_MONTHLY" },
                  { label: "Per gebruiker", value: "PER_USER" },
                  { label: "Op aanvraag", value: "CUSTOM" },
                ].map((option) => (
                  <li key={option.value}>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <input type="checkbox" className="rounded border-border text-highlight focus:ring-highlight" />
                      {option.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Terugsluis filter */}
            <div className="bg-white border border-border rounded-lg p-4 mt-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer">
                <input type="checkbox" className="rounded border-border text-highlight focus:ring-highlight" />
                Terugsluis geschikt
              </label>
            </div>
          </aside>

          {/* Listing grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((listing) => {
                const org = getSupplierById(listing.organizationId);
                return (
                  <ListingCard key={listing.id} listing={listing} organization={org} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
