import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const countdownArray = ["Ready", "Run!"];

export const PreRunOverlay = ({ onFinish }: { onFinish: () => void }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (index < countdownArray.length) {
      // 애니메이션 시작
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          // 애니메이션 초기화 및 다음 텍스트로 전환
          opacity.setValue(0);
          scale.setValue(0.8);
          setIndex((prev) => prev + 1);
        }, 700); // 텍스트 보여지는 시간
      });
    } else {
      setVisible(false);
      onFinish?.();
    }
  }, [index]);

  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <Animated.Text
        style={[
          styles.text,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        {countdownArray[index]}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    top:0,
    left:0,
    right:0,
    bottom:0,
  },
  text: {
    fontSize: 100,
    color: "white",
    fontWeight: "bold",
  },
});
