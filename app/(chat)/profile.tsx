import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { Gray } from "@/utils/colors";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const passkeys = user?.passkeys ?? [];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 16, gap: 16 }}>
      <Image
        source={{ uri: user?.imageUrl }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <View style={{ alignItems: "center", gap: 4 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          {user?.fullName}
        </Text>
        <Text style={{ fontSize: 16 }}>
          {user?.emailAddresses[0].emailAddress}
        </Text>
      </View>
      <Button onPress={handleSignOut}>Sign Out</Button>

      <View style={{ width: "100%", gap: 16, marginTop: 32 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Passkeys</Text>
        {passkeys.length > 0 ? (
          <View style={{ gap: 8 }}>
            {passkeys.map((passkey) => (
              <View key={passkey.id}>
                <Text>
                  ID: <Text style={{ color: Gray }}>{passkey.id}</Text>
                </Text>
                <Text>
                  Name: <Text style={{ color: Gray }}>{passkey.name}</Text>
                </Text>
                <Text>
                  Created:{" "}
                  <Text style={{ color: Gray }}>
                    {passkey.createdAt.toDateString()}
                  </Text>
                </Text>
                <Text>
                  Last Used:{" "}
                  <Text style={{ color: Gray }}>
                    {passkey.lastUsedAt?.toDateString() ?? "Never"}
                  </Text>
                </Text>
                <TouchableOpacity onPress={passkey.delete}>
                  <Text style={{ color: "red" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text>No passkeys found</Text>
        )}
        <Button
          onPress={async () => {
            try {
              await user?.createPasskey();
              console.log("Passkey added successfully");
            } catch (error) {
              console.error("Error adding passkey:", error);
            }
          }}
        >
          Add Passkey
        </Button>
      </View>
    </View>
  );
}
