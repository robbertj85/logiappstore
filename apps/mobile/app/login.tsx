import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { LogIn } from "lucide-react-native";
import { colors } from "@/lib/colors";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Inloggen</Text>
        <Text style={styles.subtitle}>
          Log in met uw account om producten aan te vragen
        </Text>

        <Text style={styles.label}>E-mailadres</Text>
        <TextInput
          style={styles.input}
          placeholder="u@bedrijf.nl"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Wachtwoord</Text>
        <TextInput
          style={styles.input}
          placeholder="Wachtwoord"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />

        <Pressable style={styles.button}>
          <LogIn size={18} color="#fff" />
          <Text style={styles.buttonText}>Inloggen</Text>
        </Pressable>

        <Text style={styles.footerText}>
          Nog geen account?{" "}
          <Text style={styles.link}>Registreer als vervoerder</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: 24 },
  form: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
  },
  title: { fontSize: 22, fontWeight: "800", color: colors.primary, textAlign: "center" },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 24,
  },
  label: { fontSize: 13, fontWeight: "600", color: colors.primary, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
  },
  link: { color: colors.highlight, fontWeight: "600" },
});
