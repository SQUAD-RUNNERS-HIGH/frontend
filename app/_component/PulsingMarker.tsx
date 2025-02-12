import React, { useRef, useEffect } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const PulsingMarker = () => {
  const shadowAnim = useRef(new Animated.Value(4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shadowAnim, {
          toValue: 12, // 커지는 효과
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shadowAnim, {
          toValue: 4, // 원래 크기로 돌아오기
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shadowAnim]);

  return (
    <Animated.View
      style={[
        styles.markerWrapper,
        {
          shadowRadius: shadowAnim,
          shadowOpacity: shadowAnim.interpolate({
            inputRange: [4, 12],
            outputRange: [0.3, 0], // 커질 때 투명해짐
          }),
        },
      ]}
    >
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.001)", "#6500A8"]}
        style={styles.marker}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  markerWrapper: {
    shadowColor: "#6500A8",
    shadowOffset: { width: 0, height: 0 },
    elevation: 4, // Android 그림자
    zIndex:5,
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
export default PulsingMarker;