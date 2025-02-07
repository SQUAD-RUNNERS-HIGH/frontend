import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import RhSplashScreen from "./_component/RhSplashScreen";
import Button from "./_component/Button";
import { useRouter } from "expo-router";
// Splash Screen을 유지
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isAppReady, setAppReady] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const prepareApp = async () => {
      // Splash Screen 동안 실행할 초기 작업 (ex: 데이터 로딩, API 호출 등)
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3초 대기
      setAppReady(true);
      await SplashScreen.hideAsync(); // Splash Screen 숨기기
    };

    prepareApp();
  }, []);

  if (!isAppReady) {
    return <RhSplashScreen />; // Splash Screen 유지
  }

  return (
    <LinearGradient
      colors={["#8A2BE2", "#4169E1"]} // 색상 배열
      start={{ x: 0, y: 0 }} // 시작 지점 (왼쪽 상단)
      end={{ x: 1, y: 1 }} // 끝 지점 (오른쪽 하단)
      style={styles.rootContainer}
    >
      <View style={styles.container}>
        <View  style={styles.innerContainer}>
          <Image source={require("../assets/images/logo.png")} />
          <Text style={styles.text}>Runner's High</Text>
        </View>
        <View style={styles.buttonGroup}>
          <Button onPress={() => {router.push("/login")}}>로그인</Button>
          <Button theme='secondary' onPress={() => {router.push("/signup")}}>회원가입</Button>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems:'center',
    // fontVariant: ['kern'],
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent:'center',
    marginTop:-100,
    gap:'80px',
    height: '100%',
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
  buttonGroup: {
    gap:'20px',
  }
});

// import React from "react";
// import { StyleSheet, Image, View, Text } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

// export default function Index() {
//   return (
//     // <>
//     <LinearGradient
//       colors={['#8A2BE2', '#4169E1']} // 색상 배열
//       start={{ x: 0, y: 0 }} // 시작 지점 (왼쪽 상단)
//       end={{ x: 1, y: 1 }} // 끝 지점 (오른쪽 하단)
//       style={styles.rootContainer}
//     >
//       <View style = {styles.container}>
//         <Image source={require('../assets/images/logo.png')}/>
//         <Text style = {styles.text}>Runner's High</Text>
//       </View>
//      </LinearGradient>
//     // </>
//   );
// }

// const styles = StyleSheet.create({
//   rootContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',

//     // fontVariant: ['kern'],
//   },
//   container: {
//     flexDirection: 'column',
//     gap: '65px',
//     alignItems:'center',
//   },
//   text: {
//     fontFamily: 'Roboto',
//     fontSize: 30,
//     fontWeight: 'bold',
//     lineHeight: 36,
//     textAlign: 'center',
//     letterSpacing: 0,
//     color: '#FFFFFF',
//   }

// })
