import React, { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";

const BlinkingText = ({ children }: { children: string }) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();
  }, [opacity]);

  return (
    <Animated.Text style={[styles.blinkingText, { opacity }]}>
      {children}
    </Animated.Text>
  );
};
const styles = StyleSheet.create({
  blinkingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    textAlign: 'center',
  },
});

export default BlinkingText;
