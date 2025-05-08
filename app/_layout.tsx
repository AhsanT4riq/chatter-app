import "@/global.css";
import { tokenCache } from "@/utils/cache";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { passkeys } from "@clerk/expo-passkeys";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Slot } from "expo-router";

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      tokenCache={tokenCache}
      __experimental_passkeys={passkeys}
    >
      <ClerkLoaded>
        <ThemeProvider value={DarkTheme}>
          <Slot />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
