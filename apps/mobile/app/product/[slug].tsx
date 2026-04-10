import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Star, ShieldCheck, Globe, CheckCircle2, ExternalLink } from "lucide-react-native";
import { colors } from "@/lib/colors";
import { getListingBySlug, getReviewsByListing } from "@/lib/data";

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const listing = getListingBySlug(slug);
  const reviews = listing ? getReviewsByListing(listing.id) : [];

  if (!listing) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product niet gevonden</Text>
      </View>
    );
  }

  const formatEur = (cents: number | null | undefined) => {
    if (cents == null) return "Op aanvraag";
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(cents / 100);
  };

  return (
    <>
      <Stack.Screen options={{ title: listing.title }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.card}>
          {/* Badges */}
          <View style={styles.badgeRow}>
            {listing.terugsluisEligible && (
              <View style={styles.badgeGreen}>
                <ShieldCheck size={12} color={colors.accentDark} />
                <Text style={styles.badgeGreenText}>Terugsluis</Text>
              </View>
            )}
            {listing.badgeAanbevolen && (
              <View style={styles.badgeBlue}>
                <Star size={12} color={colors.highlight} />
                <Text style={styles.badgeBlueText}>
                  Aanbevolen{listing.badgeAanbevolenBy ? ` door ${listing.badgeAanbevolenBy}` : ""}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.supplier}>
            door {listing.organization?.name ?? "Onbekend"}
          </Text>

          {listing.averageRating && (
            <View style={styles.ratingRow}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingValue}>{listing.averageRating.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({listing.reviewCount} beoordelingen)</Text>
            </View>
          )}

          <Text style={styles.shortDesc}>{listing.shortDescription}</Text>
        </View>

        {/* Price & CTA */}
        <View style={styles.card}>
          <Text style={styles.price}>{formatEur(listing.priceInCents)}</Text>
          {listing.pricingDetails && (
            <Text style={styles.pricingDetails}>{listing.pricingDetails}</Text>
          )}
          <Pressable style={styles.ctaButton}>
            <Text style={styles.ctaText}>Aanvragen</Text>
          </Pressable>
          {listing.website && (
            <Pressable style={styles.secondaryButton}>
              <Globe size={16} color={colors.primary} />
              <Text style={styles.secondaryText}>Bezoek website</Text>
              <ExternalLink size={14} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {/* Key features */}
        {listing.keyFeatures && listing.keyFeatures.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Belangrijkste functies</Text>
            {listing.keyFeatures.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <CheckCircle2 size={16} color={colors.accent} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Reviews */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Beoordelingen ({reviews.length})</Text>
          {reviews.length === 0 ? (
            <Text style={styles.emptyText}>Nog geen beoordelingen</Text>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{review.userName}</Text>
                  <Text style={styles.reviewRating}>★ {review.rating}</Text>
                </View>
                {review.title && <Text style={styles.reviewTitle}>{review.title}</Text>}
                {review.body && <Text style={styles.reviewBody}>{review.body}</Text>}
                {review.supplierReply && (
                  <View style={styles.replyBox}>
                    <Text style={styles.replyLabel}>Reactie leverancier</Text>
                    <Text style={styles.replyText}>{review.supplierReply}</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32, gap: 12 },
  errorText: { fontSize: 16, color: colors.danger, textAlign: "center", marginTop: 40 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },

  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  badgeGreen: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(122,182,72,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeGreenText: { fontSize: 11, fontWeight: "600", color: colors.accentDark },
  badgeBlue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,163,224,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeBlueText: { fontSize: 11, fontWeight: "600", color: colors.highlight },

  title: { fontSize: 22, fontWeight: "800", color: colors.primary },
  supplier: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  ratingValue: { fontSize: 14, fontWeight: "700", color: colors.primary },
  ratingCount: { fontSize: 12, color: colors.textSecondary },
  shortDesc: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginTop: 12 },

  price: { fontSize: 28, fontWeight: "800", color: colors.primary, textAlign: "center" },
  pricingDetails: { fontSize: 12, color: colors.textSecondary, textAlign: "center", marginTop: 4 },
  ctaButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  secondaryText: { fontSize: 14, fontWeight: "600", color: colors.primary },

  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.primary, marginBottom: 12 },
  featureRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  featureText: { fontSize: 13, color: colors.textSecondary, flex: 1 },

  emptyText: { fontSize: 13, color: colors.textSecondary },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    marginBottom: 12,
  },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  reviewAuthor: { fontSize: 13, fontWeight: "600", color: colors.primary },
  reviewRating: { fontSize: 12, fontWeight: "600", color: colors.warning },
  reviewTitle: { fontSize: 13, fontWeight: "600", color: colors.primary, marginTop: 4 },
  reviewBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginTop: 4 },
  replyBox: {
    backgroundColor: colors.background,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  replyLabel: { fontSize: 11, fontWeight: "600", color: colors.accentDark },
  replyText: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
