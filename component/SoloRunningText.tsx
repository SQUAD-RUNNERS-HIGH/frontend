import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import { convertSpeedToPace } from "@/lib/convertSpeedToPace";
import { useShallow } from "zustand/react/shallow";

function paceStringToSeconds(paceStr: string): number {
  const [min, sec] = paceStr.split(/['"]/).map(Number);
  return min * 60 + sec;
}

// function secondsToPaceString(seconds: number): string {
//   const min = Math.floor(seconds / 60);
//   const sec = seconds % 60;
//   return `${min}'${sec.toString().padStart(2, "0")}"`;
// }

export const SoloRunningText = () => {
  const [message, setMessage] = useState<string>();
  const lastFeedbackDistanceRef = useRef(0); // 마지막 안내한 거리 (m)
  const { targetPace, runDistance } = useRunningStore(
    useShallow((state) => ({
      targetPace: state.targetPace,
      runDistance: state.runDistance,
    }))
  );
  const myLocation = useLocationStore((state) => state.myLocation);
  const currentPace = convertSpeedToPace(myLocation?.speed!);
  const targetSec = paceStringToSeconds(targetPace);
  const currentSec = paceStringToSeconds(currentPace);
  const winning = targetSec - currentSec > 0 ? true : false;
  const feedbackInterval = 50; // ← 50m 간격으로 설정
  const paceDiff = Math.abs(targetSec - currentSec);
  console.log(targetSec,currentSec);
  useEffect(() => {
    setMessage(`목표 속도보다 ${paceDiff}초 ${winning ? "빨라요" : "느려요"}`);
  }, [myLocation]);
  useEffect(() => {
    const last = lastFeedbackDistanceRef.current;
    const nextThreshold = last + feedbackInterval;

    if (runDistance >= nextThreshold) {
      const rounded =
        Math.floor(runDistance / feedbackInterval) * feedbackInterval;
      Speech.speak(`${message}`, {
        language: "ko-KR",
      });

      // 기준 거리 갱신
      lastFeedbackDistanceRef.current = rounded;
    }
  }, [runDistance]);
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
    marginBottom: -12,
  },
  statusText: {
    fontSize: 14,
  },
});
