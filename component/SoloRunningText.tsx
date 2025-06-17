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
  // const lastSecondRef = useRef(0);
  const { targetPace, runDistance, seconds } = useRunningStore(
    useShallow((state) => ({
      targetPace: state.targetPace,
      runDistance: state.runDistance,
      seconds: state.seconds,
    }))
  );
  const myLocation = useLocationStore((state) => state.myLocation);
  const currentPace = convertSpeedToPace(myLocation?.speed!);
  const targetSec = paceStringToSeconds(targetPace);
  const currentSec = paceStringToSeconds(currentPace);
  const winning = targetSec - currentSec > 0 ? false : true;
  const paceDiff = Math.abs(targetSec - currentSec);
  const feedbackInterval = 500; // 500m 단위로 안내  const stompLocation = useLocationStore((store) => store.stompLocation);
  // const secondInterVal = 15;
  useEffect(() => {
    const last = lastFeedbackDistanceRef.current;
    const nextThreshold = last + feedbackInterval;
    setMessage(`목표 속도보다 ${paceDiff}초 ${winning ? "빨라요" : "느려요"}`);

    if (runDistance >= nextThreshold) {
      // 안내
      const rounded = Math.floor(runDistance / 100) * 100;
      Speech.speak(`${rounded}미터 달렸어요!`, {
        language: "ko-KR",
      });

      // 기준 거리 갱신
      lastFeedbackDistanceRef.current =
        Math.floor(runDistance / feedbackInterval) * feedbackInterval;
    }
  }, [runDistance]);
  // useEffect(() => {
  //   const last = lastSecondRef.current;
  //   const nextThreshold = last + secondInterVal;
  //   setMessage(`목표 속도보다 ${paceDiff}초 ${winning ? "빨라요" : "느려요"}`);

  //   if (seconds >= nextThreshold) {
  //     // 안내
  //     const rounded = Math.floor(seconds / 100) * 100;
  //     Speech.speak(`${rounded}미터 달렸어요!`, {
  //       language: "ko-KR",
  //     });

  //     // 기준 거리 갱신
  //     lastSecondRef.current =
  //       Math.floor(runDistance / feedbackInterval) * feedbackInterval;
  //   }
  // }, [seconds]);
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
