import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  ToastAndroid,
  Alert,
} from "react-native";
import Button from "../Button";
import { SetStateAction, useEffect, useState } from "react";
import { useLocation } from "@/app/_hooks/useLocation";
import { formatTime } from "@/app/_lib/formatTime";
import { convertSpeedToPace } from "@/app/_lib/convertSpeedToPace";
import { ProgressBar } from "react-native-paper";

const dummyData = 120;

export function RunningModal({
  setTheme,
}: {
  setTheme: React.Dispatch<SetStateAction<string>>;
}) {
  const { location, setSelectedCourse, setRunning } = useLocation();
  const [seconds, setSeconds] = useState(0);
  const [speed, setSpeed] = useState<string>("00'00\"");
  const [backPressCount, setBackPressCount] = useState<number>(0);
  const progress = Math.min(seconds / dummyData, 1);
  const confirmExit = () => {
    return new Promise((resolve) => {
      Alert.alert(
        "러닝 종료", // 제목
        "정말 러닝을 종료하시겠습니까?", // 메시지
        [
          { text: "아니요", style: "cancel", onPress: () => resolve(false) }, // 취소 버튼
          { text: "예", onPress: () => resolve(true) }, // 종료 버튼
        ]
      );
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
      setSpeed(convertSpeedToPace(location?.speed));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const onBackPress = () => {
      if (backPressCount === 1) {
        console.log("aa");
        setRunning(false);
        setSelectedCourse("");
        return true;
      }
      setBackPressCount((prev) => prev + 1);

      ToastAndroid.show(
        "한 번 더 누르면 러닝이 종료됩니다.",
        ToastAndroid.SHORT
      );

      setTimeout(() => setBackPressCount(0), 2000); // 2초 내에 다시 누르지 않으면 초기화
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [backPressCount]);
  return (
    <>
      <View style={styles.infoContainer}>
        <View style={styles.info}>
          <Text style={styles.value}>{formatTime(seconds)}</Text>
          <Text style={styles.key}>경과시간</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.value}>2.5 km</Text>
          <Text style={styles.key}>남은 거리</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.value}>{speed}</Text>
          <Text style={styles.key}>속도</Text>
        </View>
      </View>
      {progress < 1 ? (
        <ProgressBar
          progress={progress}
          color="#6200ee"
          style={styles.progressBar}
        />
      ) : (
        <Text style={{ textAlign: "center" }}>
          경쟁 러너의 러닝이 끝났습니다.
        </Text>
      )}
      <View style={styles.buttonContainer}>
        <Button
          onPress={async () => {
            const exit = await confirmExit();
            if (exit) {
              setRunning(false);
              setSelectedCourse("");
            }
          }}
        >
          종료하기
        </Button>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  infoContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  info: {
    alignItems: "center",
    fontFamily: "Roboto",
  },
  progressBar: {
    height: 16,
    borderRadius: 12,
  },
  value: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "bold",
  },
  key: {
    fontSize: 14,
    color: "#4B5563",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 24,
    marginTop: 16,
  },
});
