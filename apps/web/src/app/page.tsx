import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, Wallet, BarChart3 } from "lucide-react";
import { getFeaturedListings, getListings, getTopLevelCategories, getSupplierById } from "@/lib/data";
import { ListingCard } from "@/components/listings/listing-card";
import { CategoryCard } from "@/components/categories/category-card";

export default function HomePage() {
  const featuredListings = getFeaturedListings();
  const allListings = getListings();
  const categories = getTopLevelCategories();

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-highlight blur-3xl" />
        </div>
        <div className="relative max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-semibold mb-6">
              <Wallet className="h-4 w-4" />
              Betaal met uw Terugsluis-budget
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Digitale oplossingen voor{" "}
              <span className="text-accent">transport & logistiek</span>
            </h1>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              Ontdek IT-producten en diensten speciaal voor uw transportbedrijf.
              Vergelijk, beoordeel en investeer in digitalisering met uw Terugsluis-budget.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                Bekijk alle producten
              </Link>
              <Link
                href="/categories"
                className="btn-secondary inline-flex items-center justify-center gap-2 !bg-transparent !text-white !border-white/30 hover:!bg-white/10 hover:!text-white"
              >
                Blader op categorie
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-border">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-accent" />
              <p className="text-sm font-semibold text-primary">Geverifieerde leveranciers</p>
              <p className="text-xs text-muted-foreground">KvK-gecontroleerd en beoordeeld</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Wallet className="h-6 w-6 text-accent" />
              <p className="text-sm font-semibold text-primary">Terugsluis-budget</p>
              <p className="text-xs text-muted-foreground">Investeer met uw tolteruggave</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BarChart3 className="h-6 w-6 text-accent" />
              <p className="text-sm font-semibold text-primary">Mijn Digitale Landschap</p>
              <p className="text-xs text-muted-foreground">Gebaseerd op de TLN-taxonomie</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-background">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary">Uitgelichte producten</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Aanbevolen door TLN, VERN, evofenedex en Connekt
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-highlight hover:underline"
            >
              Alle producten
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => {
              const org = getSupplierById(listing.organizationId);
              return (
                <ListingCard key={listing.id} listing={listing} organization={org} />
              );
            })}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-highlight"
            >
              Bekijk alle {allListings.length} producten
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary">
                Mijn Digitale Landschap
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Ontdek producten per categorie op basis van de TLN-taxonomie
              </p>
            </div>
            <Link
              href="/categories"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-highlight hover:underline"
            >
              Alle categorieën
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-primary-light">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Bent u IT-leverancier?
          </h2>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">
            Bied uw producten en diensten aan via de Logistiek Digistore en bereik
            duizenden transportbedrijven die klaar zijn om te investeren in digitalisering.
          </p>
          <Link
            href="/register"
            className="mt-6 btn-primary inline-flex items-center gap-2"
          >
            Registreer als leverancier
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
