import { IconSymbol } from "@/components/IconSymbol";
import ItemTitleAndDescription from "@/components/Room/Description";
import { useClerkSupabaseClient } from "@/hooks/useSupabaseClient";
import { Gray, Secondary } from "@/utils/colors";
import { ChatRoom } from "@/utils/types";
import { useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

export default function Index() {
  const supabase = useClerkSupabaseClient();
  const { user } = useUser();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user || !supabase) return;
    fetchChatRooms();
  }, [user, supabase]);

  const fetchChatRooms = async () => {
    if (!supabase) return;

    const { data, error } = await supabase.from("chatrooms").select("*");

    if (error) {
      console.error("Error fetching chat rooms:", error);
    } else {
      setChatRooms(data);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChatRooms();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={chatRooms}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: "/[chat]",
            params: { chat: item.id },
          }}
        >
          <View
            style={{
              gap: 6,
              padding: 16,
              width: "100%",
              borderRadius: 16,
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: Secondary,
              justifyContent: "space-between",
            }}
          >
            <ItemTitleAndDescription
              title={item.title}
              description={item.description}
            />
            <IconSymbol name="chevron.right" color={Gray} />
          </View>
        </Link>
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, gap: 16 }}
      contentInsetAdjustmentBehavior="automatic"
    />
  );
}
