import { Pressable, StyleSheet, Text, View } from "react-native";
import ProfileIcon from "./ProfileIcon";
import ChatIcon from "./ChatIcon";
import CourseIcon from "./CourseIcon";
import CrewIcon from "./CrewIcon";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { tabBarFill } from "@/app/_constants";
import { useAuthStore } from "@/store/useAuthStore";
function TabBar() {
  const segments = useSegments();
  const [show, setShow] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (
      segments.length !== 1 &&
      segments[segments.length - 1] !== "login" &&
      segments[segments.length - 1] !== "signup"
    ) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [segments]);
  const logout  = useAuthStore(state => state.logout);
  return (
    <View style={[styles.rootContainer, !show && styles.hide]}>
      <View style={styles.container}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress = {() => {router.push('/map')}}
        >
          <CourseIcon fill={`${segments.includes('map')?tabBarFill.activate:tabBarFill.inactivate}`} />
          <Text style={[styles.buttonText, segments.includes('map') &&  styles.currentPage]}>코스</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <ChatIcon fill={`${segments.includes('chat')?tabBarFill.activate:tabBarFill.inactivate}`}  />
          <Text style={[styles.buttonText, segments.includes('chat') &&  styles.currentPage]}>채팅</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={() => {router.push('/crew/home')}}
        >
          <CrewIcon fill={`${segments.includes('crew')?tabBarFill.activate:tabBarFill.inactivate}`}  />
          <Text style={[styles.buttonText, segments.includes('crew') &&  styles.currentPage]}>크루</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={async() => {
            await logout();
          }}
        >
          <ProfileIcon fill={`${segments.includes('profile')?tabBarFill.activate:tabBarFill.inactivate}`}  />
          <Text style={[styles.buttonText, segments.includes('profile') &&  styles.currentPage]}>프로필</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  rootContainer: {
    width: "100%",
  },
  hide: {
    display: "none",
  },
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
  button: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  pressed: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: "Roboto", // 폰트 패밀리
    fontSize: 12, // 폰트 크기
    fontWeight: "normal", // 폰트 굵기
    lineHeight: 16, // 줄 높이
    letterSpacing: 0, // 글자 간격
    color: "#9CA3AF", // 글자 색상
  },
  currentPage: {
    color: "#6500A8",
  },
});
export default TabBar;
