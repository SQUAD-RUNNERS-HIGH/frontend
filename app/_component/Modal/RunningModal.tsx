import { StyleSheet, View, Text } from "react-native";
import Button from "../Button";
import { SetStateAction, useEffect, useState } from "react";
import { useLocation } from "@/app/_hooks/useLocation";
import { formatTime } from "@/app/_lib/formatTime";
import { convertSpeedToPace } from "@/app/_lib/convertSpeedToPace";

export function RunningModal() {
  const { location, setTime, setDistance } = useLocation();
  const [seconds, setSeconds] = useState(0);
  const [speed, setSpeed] = useState<string>("00'00\"");
 
  useEffect(() => {
    setTime(500);
    setDistance(0.5);
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
      setSpeed(convertSpeedToPace(location?.speed));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    // 1초마다 seconds 상태를 증가시키는 Interval 설정
  }, []);

  // 초를 시, 분, 초로 변환
 
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
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            setTime(3000);
            setDistance(3);
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
  },
  info: {
    alignItems: "center",
    fontFamily: "Roboto",
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
