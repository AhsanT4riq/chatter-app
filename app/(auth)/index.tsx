import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { isClerkAPIResponseError, useSignIn, useSSO } from "@clerk/clerk-expo";
import { ClerkAPIError } from "@clerk/types";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const { startSSOFlow } = useSSO();
  const { signIn, setActive } = useSignIn();

  const [errors, setErrors] = useState<ClerkAPIError[]>([]);

  const handleSignInWithPasskeys = async () => {
    try {
      const signInAttempt = await signIn?.authenticateWithPasskey({
        flow: "discoverable",
      });

      if (signInAttempt?.status === "complete") {
        await setActive!({ session: signInAttempt.createdSessionId });
        console.log(
          "Session created successfully:",
          signInAttempt.createdSessionId
        );
      } else {
        console.log("No session created.");
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        setErrors(error.errors);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        console.log("Session created successfully:", createdSessionId);
      } else {
        console.log("No session created.");
      }
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        setErrors(error.errors);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          gap: 20,
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          alt="Logo"
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
          }}
        />
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>Chatter</Text>
        <Text>Talk. Tap. Repeat.</Text>
        {errors.map((error) => (
          <Text
            key={error.code}
            style={{
              color: "red",
            }}
          >
            {error.message}
          </Text>
        ))}
      </View>
      <View style={{ gap: 20, marginBottom: 30 }}>
        <Button onPress={handleSignInWithPasskeys}>
          Sign in with Passkeys
        </Button>
        <Button
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
          onPress={handleSignInWithGoogle}
        >
          <Image
            source={require("@/assets/images/google-icon.png")}
            alt="Google"
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
          <Text style={{ color: "black", fontWeight: "500" }}>
            Contnue with Google
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
