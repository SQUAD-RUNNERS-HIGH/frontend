import { Pressable, StyleSheet, Text, View } from "react-native";
import ProfileIcon from "./ProfileIcon";
import ChatIcon from "./ChatIcon";
import CourseIcon from "./CourseIcon";
import CrewIcon from "./CrewIcon";
import { useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/_hooks/useAuth";
function TabBar() {
  const segments = useSegments();
  const [show, setShow] = useState(false);
  console.log(segments);
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
  const { logout } = useAuth();
  return (
    <View style={[styles.rootContainer, !show && styles.hide]}>
      <View style={styles.container}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <CourseIcon fill="#6500A8" />
          <Text style={[styles.buttonText, styles.currentPage]}>코스</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <ChatIcon fill="#9CA3AF" />
          <Text style={styles.buttonText}>채팅</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <CrewIcon fill="#9CA3AF" />
          <Text style={styles.buttonText}>크루</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={logout}
        >
          <ProfileIcon fill="#9CA3AF" />
          <Text style={styles.buttonText}>프로필</Text>
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
