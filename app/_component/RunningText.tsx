import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Speech from "expo-speech";

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
  useEffect(() => {
    setMessage(
      `${distance.toFixed(0)}m ${winning ? "앞서고 있어요" : "뒤처지고 있어요"}`
    );
  }, [distance]);
  useEffect(() => {
    if (seconds % 3 === 0 && message) {
      Speech.speak(message, { voice: "ko-KR-SMTl01" });
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
