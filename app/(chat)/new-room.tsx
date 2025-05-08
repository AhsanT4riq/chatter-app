import { Button } from "@/components/Button";
import Input from "@/components/Input";
import { Text } from "@/components/Text";
import { useClerkSupabaseClient } from "@/hooks/useSupabaseClient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

export default function NewRoom() {
  const supabase = useClerkSupabaseClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateRoom = async () => {
    try {
      setIsLoading(true);
      const response = await supabase?.from("chatrooms").insert([
        {
          title,
          description,
          updated_at: new Date().toISOString(),
        },
      ]);
      if (response?.error) {
        console.error("Error creating room:", response.error);
      } else {
        router.back();
      }
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Text>New Room</Text>
      <Input
        placeholder="Room Name*"
        value={title}
        onChangeText={setTitle}
        maxLength={100}
      />
      <Input
        placeholder="Room Description"
        value={description}
        onChangeText={setDescription}
        maxLength={500}
        multiline
        style={{ height: 100, textAlignVertical: "top" }}
      />
      <Button disabled={isLoading || !title} onPress={handleCreateRoom}>
        {isLoading ? "Creating..." : "Create"}
      </Button>
    </View>
  );
}
