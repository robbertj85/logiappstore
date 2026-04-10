import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ShieldCheck, Wallet, ArrowRight } from "lucide-react-native";
import { colors } from "@/lib/colors";
import { getFeaturedListings, getCategories, getSupplierById } from "@/lib/data";

export default function HomeScreen() {
  const router = useRouter();
  const featured = getFeaturedListings();
  const categories = getCategories();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Wallet size={14} color={colors.accent} />
          <Text style={styles.heroBadgeText}>Betaal met Terugsluis-budget</Text>
        </View>
        <Text style={styles.heroTitle}>
          Digitale oplossingen voor transport & logistiek
        </Text>
        <Text style={styles.heroSubtitle}>
          Ontdek IT-producten voor uw transportbedrijf
        </Text>
        <Pressable
          style={styles.heroButton}
          onPress={() => router.push("/(tabs)/search")}
        >
          <Text style={styles.heroButtonText}>Bekijk producten</Text>
          <ArrowRight size={16} color="#fff" />
        </Pressable>
      </View>

      {/* Featured */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uitgelichte producten</Text>
        {featured.map((listing) => {
          const org = getSupplierById(listing.organizationId);
          return (
            <Pressable
              key={listing.id}
              style={styles.listingCard}
              onPress={() => router.push(`/product/${listing.slug}`)}
            >
              <View style={styles.listingHeader}>
                <View style={styles.listingInitial}>
                  <Text style={styles.listingInitialText}>
                    {listing.title.charAt(0)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listingTitle} numberOfLines={1}>
                    {listing.title}
                  </Text>
                  <Text style={styles.listingSupplier}>{org?.name}</Text>
                </View>
              </View>
              <Text style={styles.listingDesc} numberOfLines={2}>
                {listing.shortDescription}
              </Text>
              <View style={styles.listingFooter}>
                <View style={styles.ratingRow}>
                  <Text style={styles.ratingText}>
                    ★ {listing.averageRating?.toFixed(1)} ({listing.reviewCount})
                  </Text>
                </View>
                {listing.terugsluisEligible && (
                  <View style={styles.terugsluisBadge}>
                    <ShieldCheck size={12} color={colors.accentDark} />
                    <Text style={styles.terugsluisText}>Terugsluis</Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorieën</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => router.push(`/category/${cat.slug}`)}
            >
              <Text style={styles.categoryName} numberOfLines={2}>
                {cat.name}
              </Text>
              {cat.children && (
                <Text style={styles.categoryCount}>
                  {cat.children.length} sub
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },

  hero: {
    backgroundColor: colors.primary,
    padding: 24,
    paddingTop: 16,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(122, 182, 72, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  heroBadgeText: { color: colors.accent, fontSize: 12, fontWeight: "600" },
  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    marginTop: 8,
  },
  heroButton: {
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "flex-start",
  },
  heroButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  section: { padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 12,
  },

  listingCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  listingHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  listingInitial: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(0, 163, 224, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  listingInitialText: { color: colors.highlight, fontSize: 18, fontWeight: "700" },
  listingTitle: { fontSize: 15, fontWeight: "700", color: colors.primary },
  listingSupplier: { fontSize: 12, color: colors.textSecondary },
  listingDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  listingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 12, fontWeight: "600", color: colors.primary },
  terugsluisBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(122, 182, 72, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  terugsluisText: { fontSize: 11, fontWeight: "600", color: colors.accentDark },

  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  categoryName: { fontSize: 13, fontWeight: "700", color: colors.primary },
  categoryCount: { fontSize: 11, color: colors.highlight, marginTop: 4 },
});
