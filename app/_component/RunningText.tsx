import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { useLocation } from "../_hooks/useLocation";

export const RunningText = ({
  winning,
  distance,
  seconds,
}: {
  winning: boolean;
  distance: number;
  seconds: number;
}) => {
  const [message, setMessage] = useState<string>();
  const {runningLocation} = useLocation();
  useEffect(() => {
    setMessage(
      `${distance.toFixed(0)}m ${winning ? "앞서고 있어요" : "뒤처지고 있어요"}`
    );
  }, [distance]);
  useEffect(() => {
    if (seconds % 3 === 0 && message) {
      Speech.stop(); // 이전 스피치 중단
      Speech.speak(message, { voice: "ko-KR-SMTl01" });
    }
    if (runningLocation?.runningStatus === 'ESCAPED') {
      Speech.stop();
    }
  }, [seconds]);
  return (
    <View style={styles.statusTextContainer}>
      <Text
        style={[
          styles.statusText,
          { color: `${winning ? "#228b22" : "#ff4500"}` },
        ]}
      >
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusTextContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: -12,
    marginBottom: -12,
  },
  statusText: {
    fontSize: 14,
  },
});
