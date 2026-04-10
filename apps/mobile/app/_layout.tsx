import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/lib/colors";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[slug]"
          options={{ title: "Product", headerBackTitle: "Terug" }}
        />
        <Stack.Screen
          name="category/[slug]"
          options={{ title: "Categorie", headerBackTitle: "Terug" }}
        />
        <Stack.Screen name="login" options={{ title: "Inloggen", presentation: "modal" }} />
      </Stack>
    </>
  );
}
