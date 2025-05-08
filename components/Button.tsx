import { Secondary } from "@/utils/colors";
import { Pressable, PressableProps, Text, ViewStyle } from "react-native";

export function Button({ children, style, ...props }: PressableProps) {
  return (
    <Pressable
      style={[
        {
          backgroundColor: props.disabled ? Secondary : "white",
          padding: 14,
          borderRadius: 14,
          width: "100%",
        },
        style as ViewStyle,
      ]}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          style={{
            textAlign: "center",
            fontWeight: "500",
            color: props.disabled ? "white" : "black",
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
