import React, { useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet, Vibration } from "react-native";

interface BlinkingTextProps {
  children: string;
  vibrate?: boolean;
  tts?: boolean
}
const BlinkingText = ({ children, vibrate, tts }: BlinkingTextProps) => {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (vibrate) {
      Vibration.vibrate([0, 500, 1000, 500,1000],true);
    }
    return () => {Vibration.cancel()}
  }, []);
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
