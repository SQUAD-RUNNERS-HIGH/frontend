import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function Button({
  children,
  onPress,
  theme = "default",
}: {
  children: ReactNode;
  onPress: () => void;
  theme?: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        { backgroundColor: `${theme === "default" ? "#6500A8" : "white"}` },
        styles.button,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View>
        <Text
          style={[
            styles.text,
            { color: `${theme === "default" ? "#ffffff" : "#6500A8"}` },
          ]}
        >
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    width:'100%',
    borderRadius: 6,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 28,
    textAlign: "center",
    letterSpacing: 0,
    color: "#ffffff",
  },
});
