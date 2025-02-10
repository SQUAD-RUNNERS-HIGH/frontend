import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function RhSplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current; // 페이드 인용 애니메이션 값
  const spinner = useRef(new Animated.Value(0)).current;
  // const translateY = useRef(new Animated.Value(-50)).current; // Y축 이동 애니메이션 값

  useEffect(() => {
    // 애니메이션 실행
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, // 최종 불투명도
        duration: 2000, // 애니메이션 지속 시간
        useNativeDriver: true, // 네이티브 드라이버 사용
      }),
    ]).start();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      delay: 500, // 0.5초 딜레이
      useNativeDriver: true,
    }).start();
    Animated.timing(spinner, {
      toValue: 1,
      delay: 2500, // 0.5초 딜레이
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  return (
    <LinearGradient
      colors={["#8A2BE2", "#4169E1"]} // 색상 배열
      start={{ x: 0, y: 0 }} // 시작 지점 (왼쪽 상단)
      end={{ x: 1, y: 1 }} // 끝 지점 (오른쪽 하단)
      style={styles.rootContainer}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
          <Image source={require("../../assets/images/logo.png")} />
          <Text style={styles.text}>Runner's High</Text>
        </Animated.View>
        <Animated.View style={[styles.spinner, , { opacity: spinner }]}>
          <ActivityIndicator  size={'large'} />
        </Animated.View>
      </View>
    </LinearGradient>
  );
}
export default RhSplashScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // fontVariant: ['kern'],
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -100,
    gap: 80,
    height: "100%",
  },
  innerContainer: {
    gap: "65px",
    alignItems: "center",
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 36,
    textAlign: "center",
    letterSpacing: 0,
    color: "#FFFFFF",
  },
  spinner: {
    gap: 20,
    height: 132,
    justifyContent:'center'
  },
});
