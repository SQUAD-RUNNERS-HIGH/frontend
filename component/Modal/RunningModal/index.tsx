import { StyleSheet, View, Text, Alert } from "react-native";
import Button from "../../Button";
import React, { SetStateAction, useEffect } from "react";
import CompetitorRunning from "./CompetitorRunning";
import SoloRunning from "./SoloRunning";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
export function RunningModal() {
  const {
    setRunDistance,
    runningInfo,
    setRunningInfo,
    setRunningStatus
  } = useRunningStore(
    useShallow((state) => ({
      setRunDistance: state.setRunDistance,
      runningInfo: state.runningInfo,
      setRunningInfo: state.setRunningInfo,
      setRunningStatus: state.setRunningStatus
    }))
  );
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

  return (
    <>
      {/* {runningInfo !== "solo" &&
        !isNaN(Number(runningInfo)) &&
        runningInfo !== "finish" && (
          <>
            <CrewRunning />
          </>
        )}*/}
      {runningInfo.mode === 'competitor' && (
          <>
            <CompetitorRunning />
          </>
        )}
      {runningInfo.mode === 'solo'&& (
        <>
          <SoloRunning />
        </>
      )}

      <View style={styles.buttonContainer}>
        <Button
          onPress={async () => {
            const exit = await confirmExit();
            if (exit) {
              setRunningStatus('finished');
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
