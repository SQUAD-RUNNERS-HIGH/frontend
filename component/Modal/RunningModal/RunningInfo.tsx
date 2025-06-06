import { formatTime } from "@/lib/formatTime";
import { useLayoutStore } from "@/store/useLayoutStore";
import { useRunningStore } from "@/store/useRunningStore";
import { View, Text, StyleSheet, Dimensions } from "react-native";

interface RunningInfoProps {
  seconds: number;
  rest: number;
  speed: string;
}
const RunningInfo = ({ seconds, rest, speed }: RunningInfoProps) => {
  const isSmall = useLayoutStore(state => state.isSmall);
  const runningInfo = useRunningStore((state) => state.runningInfo);
  return (
    <View style={styles.infoContainer}>
      <View style={[styles.info]}>
        <Text style={[styles.value, isSmall && { fontSize: 14 }]}>
          {formatTime(seconds)}
        </Text>
        <Text style={[styles.key, isSmall && { fontSize: 10 }]}>
          경과시간
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.value, isSmall && { fontSize: 14 }]}>
          {rest}m
        </Text>
        <Text style={[styles.key, isSmall && { fontSize: 10 }]}>
          {`${runningInfo.mode === "solo" ? "뛴 " : "남은 "}`}거리
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.value, isSmall && { fontSize: 14 }]}>
          {speed}
        </Text>
        <Text style={[styles.key, isSmall && { fontSize: 10 }]}>
          속도
        </Text>
      </View>
    </View>
  );
};
export default RunningInfo;
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
  courseMessage: {
    width: "100%",
    textAlign: "center",
    color: "red",
  },
});
