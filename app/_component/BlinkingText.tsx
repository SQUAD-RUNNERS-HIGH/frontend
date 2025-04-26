import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View, StyleSheet, Vibration } from "react-native";
import * as Speech from 'expo-speech';

interface BlinkingTextProps {
  children: string;
  vibrate?: boolean;
  tts?: boolean;
}
const BlinkingText = ({ children, vibrate, tts }: BlinkingTextProps) => {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (vibrate) {
      // Vibration.vibrate([0, 500, 2000], true);
    }
    if (tts) {
      Speech.speak(children, {voice: 'ko-KR-SMTl01'});
      interval = setInterval(() => {
      Speech.speak(children, {voice: 'ko-KR-SMTl01'});
      }, 5000);
    }
    return () => {
      if(vibrate) {
        Vibration.cancel();
      }
      if (tts) {
        Speech.stop();
      }
      if(interval) {
        clearInterval(interval)
      }
    };
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
    textAlign: "center",
  },
});

export default BlinkingText;
