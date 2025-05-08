import { Text } from "@/components/Text";
import { Gray } from "@/utils/colors";
import { View } from "react-native";
import ItemTitle from "./Title";

export default function ItemTitleAndDescription({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={{ gap: 4 }}>
      <ItemTitle title={title} />
      <Text
        style={{
          fontSize: 13,
          color: Gray,
        }}
      >
        {description}
      </Text>
    </View>
  );
}
