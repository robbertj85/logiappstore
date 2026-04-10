import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Category } from "@logiappstore/shared";
import { getCategoryBySlug, getListingsByCategory, getSupplierById } from "@/lib/data";
import { ListingCard } from "@/components/listings/listing-card";
import { CategoryCard } from "@/components/categories/category-card";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Categorie niet gevonden" };
  return {
    title: `${category.name} — Logistiek Appstore`,
    description: category.description ?? `IT-oplossingen in de categorie ${category.name}`,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  // Get listings for this category and all subcategories
  const allCategoryIds = [category.id];
  function collectChildIds(children?: Category[]) {
    children?.forEach((c) => {
      allCategoryIds.push(c.id);
      if (c.children) collectChildIds(c.children);
    });
  }
  collectChildIds(category.children);

  const listings = allCategoryIds.flatMap((id) => getListingsByCategory(id));
  // Deduplicate
  const uniqueListings = listings.filter(
    (l, i, arr) => arr.findIndex((x) => x.id === l.id) === i
  );

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Alle categorieën
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">{category.name}</h1>
          {category.description && (
            <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
          )}
        </div>

        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-primary mb-4">Subcategorieën</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {category.children.map((child) => (
                <CategoryCard key={child.id} category={child} />
              ))}
            </div>
          </div>
        )}

        {/* Listings */}
        <div>
          <h2 className="text-lg font-bold text-primary mb-4">
            Producten ({uniqueListings.length})
          </h2>
          {uniqueListings.length === 0 ? (
            <div className="bg-white border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Er zijn nog geen producten in deze categorie.
              </p>
              <Link
                href="/products"
                className="mt-3 inline-flex text-sm text-highlight hover:underline"
              >
                Bekijk alle producten
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueListings.map((listing) => {
                const org = getSupplierById(listing.organizationId);
                return (
                  <ListingCard key={listing.id} listing={listing} organization={org} />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
