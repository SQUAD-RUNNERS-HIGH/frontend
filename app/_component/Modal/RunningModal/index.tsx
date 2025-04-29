import { StyleSheet, View, Text, Alert } from "react-native";
import Button from "../../Button";
import React, { SetStateAction, useEffect } from "react";
import { useLocation } from "@/app/_hooks/useLocation";
import { apiClient } from "@/api/apiClient";
import CompetitorRunning from "./CompetitorRunning";
import SoloRunning from "./SoloRunning";

export function RunningModal() {
  const { setRunDistance, runningInfo,  setRunningInfo, setIsRunning } = useLocation();
 
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
      {runningInfo !== "solo" && isNaN(Number(runningInfo)) && runningInfo !=='finish' && (
        <>
          <CompetitorRunning />
        </>
      )}
      {runningInfo === "solo" && (
        <>
          <SoloRunning />
        </>
      )}

      <View style={styles.buttonContainer}>
        <Button
          onPress={async () => {
            const exit = await confirmExit();
            if (exit) {
              setRunDistance(0);
              if(runningInfo === 'solo') {
                setRunningInfo('soloFinish');
              }
              if(runningInfo !== 'solo' && isNaN(Number(runningInfo))) {
                setRunningInfo('competitorFinish');
              }
              setIsRunning(false);           
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
