import { IconSymbol } from "@/components/IconSymbol";
import { Text } from "@/components/Text";
import { useClerkSupabaseClient } from "@/hooks/useSupabaseClient";
import { Gray, Primary, Secondary } from "@/utils/colors";
import { Message } from "@/utils/types";
import { useUser } from "@clerk/clerk-expo";
import { LegendList } from "@legendapp/list";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Chat() {
  const { chat: chatId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRoomInfo, setChatRoomInfo] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const headerHeight = useHeaderHeight();
  const subscriptionRef = useRef<any>(null);

  const { user } = useUser();

  const supabase = useClerkSupabaseClient();

  useEffect(() => {
    if (!chatId || isLoading) return;
    getChatRoomInfo();
    handleInitialLoad();
    setupMessagesSubscription();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [chatId, isLoading, subscriptionRef]);

  if (!chatId) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chat room cannot be found 😔</Text>;
      </View>
    );
  }

  const setupMessagesSubscription = () => {
    if (!supabase || !chatId) return;

    // Remove any existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Subscribe to changes on the messages table for this chat room
    subscriptionRef.current = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chatroom_id=eq.${chatId}`,
        },
        (payload) => {
          // When a new message is inserted, add it to the messages state
          const newMessage = payload.new as Message;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();
  };

  const getChatRoomInfo = async () => {
    if (!supabase || !chatId) return;
    try {
      const { data, error } = await supabase
        .from("chatrooms")
        .select("*")
        .eq("id", chatId)
        .single();
      if (error) {
        console.error("Error fetching chat room info:", error);
      } else {
        setChatRoomInfo(data);
      }
    } catch (error) {
      console.error("Error fetching chat room info:", error);
    }
  };

  const handleInitialLoad = async () => {
    try {
      await handleFetchMessages();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleFetchMessages = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chatroom_id", chatId)
        .order("created_at", { ascending: true })
        .limit(50);
      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!content || content.trim() === "") return;
    setIsLoading(true);
    try {
      const response = await supabase?.from("messages").insert([
        {
          content,
          sender_id: user?.id,
          sender_name: user?.fullName,
          sender_photo: user?.imageUrl,
          chatroom_id: chatId,
        },
      ]);

      // update the chat room last message
      await supabase
        ?.from("chatrooms")
        .update({
          updatedAt: new Date().toISOString(),
        })
        .eq("id", chatId);

      if (response?.error) {
        console.error("Error sending message:", response.error);
      } else {
        setContent("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <Stack.Screen options={{ headerTitle: chatRoomInfo.title ?? "Chat" }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={headerHeight}
      >
        <LegendList
          data={messages}
          renderItem={({ item }) => {
            const isSender = item.sender_id === user?.id;
            return (
              <View
                style={{
                  flexDirection: "row",
                  padding: 10,
                  borderRadius: 10,
                  gap: 5,
                  alignSelf: isSender ? "flex-end" : "flex-start",
                  maxWidth: SCREEN_WIDTH * 0.8,
                }}
              >
                {!isSender && (
                  <Image
                    source={{ uri: item.sender_photo }}
                    style={{ width: 30, height: 30, borderRadius: 15 }}
                  />
                )}
                <View
                  style={{
                    backgroundColor: isSender ? Primary : Secondary,
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,

                    gap: 5,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>{item.sender_name}</Text>
                  <Text style={{ flexShrink: 1 }}>{item.content}</Text>
                  <Text style={{ fontSize: 10, textAlign: "right" }}>
                    {new Date(item.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 10 }}
          recycleItems={true}
          initialScrollIndex={messages.length - 1}
          alignItemsAtEnd
          maintainScrollAtEnd
          maintainScrollAtEndThreshold={0.5}
          maintainVisibleContentPosition
          estimatedItemSize={100}
        />
        <View
          style={{
            borderRadius: 20,
            borderColor: Gray,
            borderWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
            marginHorizontal: 2,
          }}
        >
          <TextInput
            placeholder="Message..."
            value={content}
            onChangeText={setContent}
            multiline
            placeholderTextColor={Gray}
            style={{
              minHeight: 25,
              maxHeight: 125,
              flexGrow: 1,
              color: "white",
              flexShrink: 1,
              padding: 10,
            }}
          />
          <Pressable
            disabled={!content}
            onPress={handleSendMessage}
            style={{
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconSymbol name="paperplane" color={content ? Primary : Gray} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
