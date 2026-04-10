import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, Phone, MapPin, ShieldCheck, Award } from "lucide-react";
import { getSupplierBySlug, getSupplierListings, getSupplierById } from "@/lib/data";
import { ListingCard } from "@/components/listings/listing-card";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supplier = getSupplierBySlug(slug);
  if (!supplier) return { title: "Leverancier niet gevonden" };
  return {
    title: `${supplier.name} — Logistiek Digistore`,
    description: supplier.description ?? `IT-leverancier ${supplier.name}`,
  };
}

export default async function SupplierDetailPage({ params }: Props) {
  const { slug } = await params;
  const supplier = getSupplierBySlug(slug);
  if (!supplier) notFound();

  const listings = getSupplierListings(supplier.id);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/suppliers"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Alle leveranciers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            {/* Profile header */}
            <div className="bg-white border border-border rounded-lg p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-highlight/10 rounded-lg flex items-center justify-center text-highlight font-bold text-2xl">
                  {supplier.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary">{supplier.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    {supplier.kvkVerified && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-dark bg-accent/10 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Geverifieerd
                      </span>
                    )}
                    {supplier.trustedPartner && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <Award className="h-3.5 w-3.5" />
                        Vertrouwde Partner
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {supplier.description}
              </p>
            </div>

            {/* Listings */}
            <h2 className="text-lg font-bold text-primary mb-4">
              Producten ({listings.length})
            </h2>
            {listings.length === 0 ? (
              <div className="bg-white border border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  Deze leverancier heeft nog geen producten geplaatst.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} organization={supplier} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-border rounded-lg p-6">
              <h3 className="text-sm font-bold text-primary mb-4">Contactgegevens</h3>
              <div className="space-y-3">
                {supplier.city && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {supplier.city}
                    {supplier.postalCode && `, ${supplier.postalCode}`}
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    {supplier.phone}
                  </div>
                )}
                {supplier.website && (
                  <a
                    href={supplier.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-highlight hover:underline"
                  >
                    <Globe className="h-4 w-4 shrink-0" />
                    {supplier.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>

            {supplier.kvkNumber && (
              <div className="bg-white border border-border rounded-lg p-6">
                <h3 className="text-sm font-bold text-primary mb-2">KvK informatie</h3>
                <p className="text-sm text-muted-foreground">
                  KvK-nummer: {supplier.kvkNumber}
                </p>
                {supplier.kvkVerified && (
                  <p className="text-xs text-accent-dark mt-1 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Geverifieerd via Handelsregister
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
