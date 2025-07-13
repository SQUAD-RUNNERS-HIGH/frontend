import { useLayoutStore } from "@/store/useLayoutStore";
import { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

function Button({
  children,
  style,
  onPress,
  theme = "default",
  disabled = false,
  fontSize = 18,
}: {
  children: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  fontSize?: number;
  width?: string;
  theme?: string;
  disabled?: boolean;
}) {
  return (
    <>
      {disabled ? (
        <View style={[styles.button, style, disabled && styles.disabled]}>
          <Text
            style={[
              styles.text,
              { color: `${theme === "default" ? "#ffffff" : "#6500A8"}` },            ]}
          >
            {children}
          </Text>
        </View>
      ) : (
        <Pressable
          style={({ pressed }) => [
            theme === 'default'? styles.default: styles.secondary,
            styles.button,
            pressed && styles.pressed,
            styles.shadow,
            style,
          ]}
          onPress={onPress}
        >
            <Text
              style={[
                styles.text,
                { color: `${theme === "default" ? "#ffffff" : "#6500A8"}` },
              ]}
            >
              {children}
            </Text>
        </Pressable>
      )}
    </>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    borderRadius: 6,
  },
  default: {
    backgroundColor: "#6500A8",
  },
  secondary: {
    backgroundColor: "white",
    borderColor:"#6500A8",
    borderWidth: 1,
  },
  shadow: {
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  disabled: {
    backgroundColor: "rgba(101, 0, 168, 0.5)",
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontFamily: "Roboto",
    fontWeight: "500",
    lineHeight: 28,
    textAlign: "center",
    letterSpacing: 0,
    color: "#ffffff",
  },
});