import { View, Text, StyleSheet } from "react-native";
import { Wallet, TrendingDown, TrendingUp } from "lucide-react-native";
import { colors } from "@/lib/colors";

export default function BudgetScreen() {
  // Demo data
  const budget = {
    totalAllocated: 1500000, // €15,000
    totalSpent: 348900, // €3,489
    remaining: 1151100, // €11,511
    fiscalYear: 2026,
  };

  const formatEur = (cents: number) =>
    new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(cents / 100);

  const percentSpent = Math.round((budget.totalSpent / budget.totalAllocated) * 100);

  return (
    <View style={styles.container}>
      {/* Balance card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceIcon}>
          <Wallet size={28} color="#fff" />
        </View>
        <Text style={styles.balanceLabel}>Beschikbaar budget {budget.fiscalYear}</Text>
        <Text style={styles.balanceAmount}>{formatEur(budget.remaining)}</Text>

        {/* Progress bar */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${percentSpent}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {percentSpent}% besteed van {formatEur(budget.totalAllocated)}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <TrendingDown size={20} color={colors.danger} />
          <Text style={styles.statLabel}>Besteed</Text>
          <Text style={styles.statValue}>{formatEur(budget.totalSpent)}</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={20} color={colors.accent} />
          <Text style={styles.statLabel}>Resterend</Text>
          <Text style={styles.statValue}>{formatEur(budget.remaining)}</Text>
        </View>
      </View>

      {/* Placeholder for transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recente transacties</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Nog geen transacties. Koop een product om uw budget te besteden.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  balanceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  balanceLabel: { color: "rgba(255,255,255,0.7)", fontSize: 13 },
  balanceAmount: { color: "#fff", fontSize: 32, fontWeight: "800", marginTop: 4 },
  progressBg: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 3,
    marginTop: 20,
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  progressText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    marginTop: 6,
  },
  statsRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: "center",
    gap: 4,
  },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  statValue: { fontSize: 16, fontWeight: "700", color: colors.primary },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.primary, marginBottom: 12 },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: "center",
  },
  emptyText: { fontSize: 13, color: colors.textSecondary, textAlign: "center" },
});
