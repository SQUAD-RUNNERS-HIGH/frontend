import { StyleSheet, View, Alert } from "react-native";
import Button from "../../Button";
import React from "react";
import CompetitorRunning from "./CompetitorRunning";
import SoloRunning from "./SoloRunning";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useStompStore } from "@/store/useStompStore";
import CrewRunning from "./CrewRunning";
import SoloCourseRunning from "./SoloCourseRunning";
import { useLayoutStore } from "@/store/useLayoutStore";
export function RunningModal() {
  const { setCrewRunningPrepareParticipant, runningInfo, setRunningStatus } =
    useRunningStore(
      useShallow((state) => ({
        seconds: state.seconds,
        runningInfo: state.runningInfo,
        setRunningInfo: state.setRunningInfo,
        setRunningStatus: state.setRunningStatus,
        setCrewRunningPrepareParticipant: state.setCrewRunningPrepareParticipant
      }))
    );
  const client = useStompStore((state) => state.client);
  const setClient = useStompStore((state) => state.setClient);
  const isSmall = useLayoutStore(state => state.isSmall);

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
      {runningInfo.mode === "crew" && (
        <>
          <CrewRunning />
        </>
      )}
      {runningInfo.mode === "competitor" && (
        <>
          <CompetitorRunning />
        </>
      )}
      {runningInfo.mode === "solo" && (
        <>
          <SoloRunning />
        </>
      )}
      {runningInfo.mode === "soloCourse" && (
        <>
          <SoloCourseRunning />
        </>
      )}

      <View style={[styles.buttonContainer,isSmall&&{marginTop:12, marginBottom:12}]}>
        <Button
          onPress={async () => {
            const exit = await confirmExit();
            if (exit) {
              setRunningStatus("finished");
              if (client) {
                setCrewRunningPrepareParticipant([]);
                client.deactivate();
                setClient(null);
              }
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
    marginTop: 16,
    marginBottom:-4,
  },
  courseMessage: {
    width: "100%",
    textAlign: "center",
    color: "red",
  },
});
