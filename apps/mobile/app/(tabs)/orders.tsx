import { View, Text, StyleSheet } from "react-native";
import { ShoppingBag } from "lucide-react-native";
import { colors } from "@/lib/colors";

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.emptyState}>
        <ShoppingBag size={48} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>Nog geen bestellingen</Text>
        <Text style={styles.emptyText}>
          Wanneer u een product aanvraagt via de Logistiek Appstore, verschijnt uw bestelling hier.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: 32 },
  emptyState: { alignItems: "center", gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: colors.primary },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: "center", lineHeight: 20 },
});
