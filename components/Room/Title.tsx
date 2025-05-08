import { Text } from "@/components/Text";
import { View } from "react-native";

export default function ItemTitle({ title }: { title: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Text style={{ fontSize: 17 }}>{title}</Text>
    </View>
  );
}
