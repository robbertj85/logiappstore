import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { User, LogIn, Building2, Settings } from "lucide-react-native";
import { colors } from "@/lib/colors";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <User size={40} color={colors.textMuted} />
        </View>
        <Text style={styles.name}>Niet ingelogd</Text>
        <Text style={styles.subtitle}>Log in om uw profiel te bekijken</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable style={styles.actionItem} onPress={() => router.push("/login")}>
          <LogIn size={20} color={colors.highlight} />
          <Text style={styles.actionText}>Inloggen</Text>
        </Pressable>
        <Pressable style={styles.actionItem}>
          <Building2 size={20} color={colors.highlight} />
          <Text style={styles.actionText}>Registreren als vervoerder</Text>
        </Pressable>
        <Pressable style={styles.actionItem}>
          <Settings size={20} color={colors.highlight} />
          <Text style={styles.actionText}>Instellingen</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Logistiek Appstore v0.1.0{"\n"}
        Een initiatief van Connekt, TLN, VERN en evofenedex
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  avatarSection: { alignItems: "center", paddingVertical: 32 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: "700", color: colors.primary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  actions: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionText: { fontSize: 15, color: colors.primary, fontWeight: "500" },
  footer: {
    textAlign: "center",
    fontSize: 11,
    color: colors.textMuted,
    marginTop: "auto",
    paddingVertical: 16,
    lineHeight: 18,
  },
});
