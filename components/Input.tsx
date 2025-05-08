import { Secondary } from "@/utils/colors";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

export default function Input(props: TextInputProps) {
  const { style, ...rest } = props;
  return (
    <TextInput
      {...rest}
      style={StyleSheet.flatten([
        {
          padding: 18,
          borderRadius: 10,
          backgroundColor: Secondary,
          color: "#FFF",
          fontSize: 16,
        },
        style,
      ])}
    />
  );
}
