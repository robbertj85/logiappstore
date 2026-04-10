import Link from "next/link";
import { ShieldCheck, Award, ExternalLink } from "lucide-react";
import { getSuppliers, getSupplierListings } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leveranciers — Logistiek Appstore",
  description: "Ontdek geverifieerde IT-leveranciers voor de transport en logistiek sector.",
};

export default function SuppliersPage() {
  const suppliers = getSuppliers();

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Leveranciers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {suppliers.length} geverifieerde IT-leveranciers voor transport en logistiek
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => {
            const listingCount = getSupplierListings(supplier.id).length;
            return (
              <Link
                key={supplier.id}
                href={`/suppliers/${supplier.slug}`}
                className="group"
              >
                <div className="card p-6 h-full flex flex-col">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-highlight/10 rounded-lg flex items-center justify-center text-highlight font-bold text-xl shrink-0">
                      {supplier.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-primary group-hover:text-highlight transition-colors truncate">
                        {supplier.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{supplier.city}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {supplier.kvkVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent-dark bg-accent/10 px-1.5 py-0.5 rounded-full">
                            <ShieldCheck className="h-3 w-3" />
                            Geverifieerd
                          </span>
                        )}
                        {supplier.trustedPartner && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                            <Award className="h-3 w-3" />
                            Vertrouwde Partner
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2 flex-1">
                    {supplier.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {listingCount} {listingCount === 1 ? "product" : "producten"}
                    </span>
                    {supplier.website && (
                      <span className="text-xs text-highlight flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Website
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
