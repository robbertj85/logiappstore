import { getTopLevelCategories } from "@/lib/data";
import { CategoryCard } from "@/components/categories/category-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorieën — Logistiek Digistore",
  description: "Blader door IT-oplossingen per categorie op basis van het Mijn Digitale Landschap (TLN) framework.",
};

export default function CategoriesPage() {
  const categories = getTopLevelCategories();

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Mijn Digitale Landschap
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ontdek IT-oplossingen per categorie op basis van de TLN-taxonomie voor het digitale landschap van transportbedrijven.
          </p>
        </div>

        <div className="space-y-10">
          {categories.map((topCat) => (
            <section key={topCat.id}>
              <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                {topCat.name}
              </h2>
              {topCat.description && (
                <p className="text-sm text-muted-foreground mb-4">{topCat.description}</p>
              )}

              {topCat.children && topCat.children.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {topCat.children.map((child) => (
                    <CategoryCard key={child.id} category={child} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <CategoryCard category={topCat} />
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
