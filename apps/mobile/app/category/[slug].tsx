import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { colors } from "@/lib/colors";
import { getCategoryBySlug, getSupplierById } from "@/lib/data";
import type { Category, Listing } from "@logiappstore/shared";
import listingsData from "../../../../data/listings.json";

const listings = listingsData as Listing[];

export default function CategoryDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const category = getCategoryBySlug(slug);

  if (!category) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Categorie niet gevonden</Text>
      </View>
    );
  }

  // Collect all category IDs (including children)
  const allIds = [category.id];
  function collectIds(children?: Category[]) {
    children?.forEach((c) => {
      allIds.push(c.id);
      if (c.children) collectIds(c.children);
    });
  }
  collectIds(category.children);

  const categoryListings = listings
    .filter((l) => l.status === "PUBLISHED" && l.categoryIds.some((id) => allIds.includes(id)))
    .filter((l, i, arr) => arr.findIndex((x) => x.id === l.id) === i);

  return (
    <>
      <Stack.Screen options={{ title: category.name }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Description */}
        {category.description && (
          <Text style={styles.description}>{category.description}</Text>
        )}

        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subcategorieën</Text>
            <View style={styles.subGrid}>
              {category.children.map((child) => (
                <Pressable
                  key={child.id}
                  style={styles.subCard}
                  onPress={() => router.push(`/category/${child.slug}`)}
                >
                  <Text style={styles.subName}>{child.name}</Text>
                  {child.children && (
                    <Text style={styles.subCount}>{child.children.length} sub</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Listings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Producten ({categoryListings.length})
          </Text>
          {categoryListings.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Geen producten in deze categorie</Text>
            </View>
          ) : (
            categoryListings.map((listing) => {
              const org = getSupplierById(listing.organizationId);
              return (
                <Pressable
                  key={listing.id}
                  style={styles.listingCard}
                  onPress={() => router.push(`/product/${listing.slug}`)}
                >
                  <Text style={styles.listingTitle} numberOfLines={1}>
                    {listing.title}
                  </Text>
                  <Text style={styles.listingSupplier}>{org?.name}</Text>
                  <Text style={styles.listingDesc} numberOfLines={2}>
                    {listing.shortDescription}
                  </Text>
                  <Text style={styles.listingRating}>
                    ★ {listing.averageRating?.toFixed(1)} ({listing.reviewCount})
                  </Text>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  errorText: { fontSize: 16, color: colors.danger, textAlign: "center", marginTop: 40 },
  description: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.primary, marginBottom: 12 },
  subGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  subCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  subName: { fontSize: 13, fontWeight: "600", color: colors.primary },
  subCount: { fontSize: 11, color: colors.highlight, marginTop: 4 },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: "center",
  },
  emptyText: { fontSize: 13, color: colors.textSecondary },
  listingCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  listingTitle: { fontSize: 15, fontWeight: "700", color: colors.primary },
  listingSupplier: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  listingDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginTop: 6 },
  listingRating: { fontSize: 12, fontWeight: "600", color: colors.primary, marginTop: 8 },
});
