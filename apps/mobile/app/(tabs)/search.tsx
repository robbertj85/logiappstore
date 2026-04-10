import { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Search as SearchIcon, ShieldCheck } from "lucide-react-native";
import { colors } from "@/lib/colors";
import { getListings, searchListings, getSupplierById } from "@/lib/data";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const listings = query.length > 0 ? searchListings(query) : getListings();

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <SearchIcon size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Zoek producten..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.resultCount}>
          {listings.length} {listings.length === 1 ? "resultaat" : "resultaten"}
        </Text>

        {listings.map((listing) => {
          const org = getSupplierById(listing.organizationId);
          return (
            <Pressable
              key={listing.id}
              style={styles.card}
              onPress={() => router.push(`/product/${listing.slug}`)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.initial}>
                  <Text style={styles.initialText}>{listing.title.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title} numberOfLines={1}>
                    {listing.title}
                  </Text>
                  <Text style={styles.supplier}>{org?.name}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>
                    ★ {listing.averageRating?.toFixed(1)}
                  </Text>
                </View>
              </View>
              <Text style={styles.desc} numberOfLines={2}>
                {listing.shortDescription}
              </Text>
              <View style={styles.tagRow}>
                {listing.terugsluisEligible && (
                  <View style={styles.tag}>
                    <ShieldCheck size={10} color={colors.accentDark} />
                    <Text style={styles.tagText}>Terugsluis</Text>
                  </View>
                )}
                {listing.tags.slice(0, 3).map((t) => (
                  <View key={t} style={styles.tagGray}>
                    <Text style={styles.tagGrayText}>{t}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  resultCount: { fontSize: 12, color: colors.textSecondary, marginBottom: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  initial: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(0,163,224,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  initialText: { color: colors.highlight, fontSize: 16, fontWeight: "700" },
  title: { fontSize: 14, fontWeight: "700", color: colors.primary },
  supplier: { fontSize: 11, color: colors.textSecondary },
  ratingBadge: {
    backgroundColor: "rgba(245,158,11,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  ratingText: { fontSize: 12, fontWeight: "600", color: colors.warning },
  desc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(122,182,72,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  tagText: { fontSize: 10, fontWeight: "600", color: colors.accentDark },
  tagGray: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagGrayText: { fontSize: 10, color: colors.textSecondary },
});
