import { useLocation } from "@/app/_hooks/useLocation";
import { formatTime } from "@/app/_lib/formatTime";
import { useRunningStore } from "@/store/useRunningStore";
import { View, Text, StyleSheet } from "react-native";

interface RunningInfoProps {
  seconds: number;
  rest: number;
  speed: string;
}
const RunningInfo = ({seconds, rest, speed}: RunningInfoProps) => {
  const runningInfo = useRunningStore((state) => state.runningInfo);
  return (<View style={styles.infoContainer}>
          <View style={styles.info}>
            <Text style={styles.value}>{formatTime(seconds)}</Text>
            <Text style={styles.key}>경과시간</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.value}>{rest}m</Text>
            <Text style={styles.key}>{`${runningInfo === 'solo' ? '뛴 ':'남은 '}`}거리</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.value}>{speed}</Text>
            <Text style={styles.key}>속도</Text>
          </View>
        </View>)
}
export default RunningInfo;
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
