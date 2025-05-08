import { IconSymbol } from "@/components/IconSymbol";
import { useUser } from "@clerk/clerk-expo";
import { Link, Redirect, Stack } from "expo-router";
import { cssInterop } from "nativewind";
import { Image } from "react-native";

const StyledImage = cssInterop(Image, {
  className: "style",
});

export default function ChatLayout() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return <Redirect href="/(chat)" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Chat Rooms",
          headerLargeTitle: true,
          headerLeft: () => (
            <Link href="/profile">
              <StyledImage
                className="w-8 h-8 rounded-full"
                source={{ uri: user?.imageUrl }}
              />
            </Link>
          ),
          headerRight: () => (
            <Link href="/new-room">
              <IconSymbol name="plus" />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          presentation: "modal",
          headerTitle: "Profile",
          headerLeft: () => (
            <Link dismissTo href="/">
              <IconSymbol name="chevron.left" />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="new-room"
        options={{
          presentation: "modal",
          title: "New Chat Room",
          headerLeft: () => (
            <Link dismissTo href="/">
              <IconSymbol name="chevron.left" />
            </Link>
          ),
          headerRight: undefined,
        }}
      />
      <Stack.Screen
        name="[chat]"
        options={{
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="settings/[chat]"
        options={{
          headerTitle: "Room Settings",
          presentation: "modal",
          headerLeft: () => (
            <Link dismissTo href="/">
              <IconSymbol name="chevron.left" />
            </Link>
          ),
        }}
      />
    </Stack>
  );
}
