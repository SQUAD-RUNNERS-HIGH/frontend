import { View, Text, StyleSheet } from "react-native";
import Button from "../../Button";
import Checkbox from "expo-checkbox";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useStompStore } from "@/store/useStompStore";
import { useStomp } from "@/hooks/running/useStomp";
import { useEffect, useState } from "react";
import useInterval from "@/hooks/running/useInterval";

export const PrepareCrew = () => {
  const client = useStompStore((state) => state.client);
  const { sendLocation } = useStomp();
  const [isReady, setIsReady] = useState(false);
  const [allReady, setAllReady] = useState(false);
  const { myLocation, stompLocation } = useLocationStore(
    useShallow((state) => ({
      myLocation: state.myLocation,
      stompLocation: state.stompLocation,
    }))
  );
  const { crewRunningPrepareParticipant, setRunningStatus } = useRunningStore(
    useShallow((state) => ({
      crewRunningPrepareParticipant: state.crewRunningPrepareParticipant,
      setRunningStatus: state.setRunningStatus,
    }))
  );

  useInterval(
    () => {
      sendLocation(myLocation, isReady);
    },
    myLocation ? 1000 : null
  );

  useEffect(() => {
    sendLocation(myLocation, isReady);
  }, [isReady]);
  useEffect(() => {
    if (
      crewRunningPrepareParticipant.length > 0 &&
      crewRunningPrepareParticipant.every((item) => item.isReady === true)
    ) {
      setAllReady(true);
    }
  }, [crewRunningPrepareParticipant]);
  useEffect(() => {
    if (allReady) {
      client?.deactivate();
      setRunningStatus("countdown");
    }
  }, [allReady]);
  return (
    <>
      <Text style={styles.modalTitle}>주변 크루원</Text>
      <View style={styles.crewContainer}>
        {crewRunningPrepareParticipant.map((crew) => (
          <View style={styles.crew} key={crew.userId}>
            <Text>{crew.username}</Text>
            <View style={styles.checkBoxContainer}>
              <Text style={styles.checkBoxName}>준비</Text>
              <Checkbox style={styles.checkBox} value={crew.isReady} />
            </View>
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <Text style={styles.description}>
          함께할 크루원은 30m 이내로 가까이 모여주세요
        </Text>
        <Button
          onPress={() => {
            setIsReady((prev) => !prev);
          }}
          style={styles.button}
        >
          {isReady ? "준비취소" : "준비하기"}
        </Button>
      </View>
      {/* {connected ? (
        <>
          {stompLocation?.runningStatus === "ONGOING" ? (
            <>
              <Text style={[styles.modalDepscription2, { fontWeight: 700 }]}>
                러닝을 시작합니다.
              </Text>

              <Button
                style={{ marginTop: 6, width: "100%" }}
                onPress={() => {
                  setRunningStatus('countdown');
                }}
              >
                러닝 시작!
              </Button>
            </>
          ) : (
            <Text style={styles.courseText}>
              현재 위치가 코스에서 떨어져있습니다.
            </Text>
          )}
        </>
      ) : (
        <Text>서버와 연결하는 중...</Text>
      )} */}
    </>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 배경
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalPosition: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    backgroundColor: "white",
    zIndex: 20,
    maxHeight: 616,
    borderRadius: 12,
  },
  modalContainer: {
    padding: 24,
    paddingHorizontal: 40,
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    zIndex: 20,
    gap: 10,
  },
  modalTitle: {
    fontWeight: 700,
    fontSize: 20,
    lineHeight: 28,
    color: "#000000",
    marginBottom: 24,
  },
  modalDepscription2: {
    fontWeight: 300,
    fontSize: 16,
    lineHeight: 28,
    color: "#000000",
  },
  crewContainer: {
    gap: 12,
  },
  crew: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    alignItems: "center",
  },
  courseText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  crewName: {
    minWidth: 100,
  },
  checkBox: {
    padding: 0,
    width: 20,
    height: 20,
  },
  checkBoxName: {
    fontSize: 14,
    lineHeight: 14,
  },
  checkBoxContainer: {
    flexDirection: "row",
    gap: 16,
    alignContent: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 42,
    gap: 32,
    alignItems: "center",
  },
  description: {
    color: "#4B5563",
  },
  button: {
    width: "100%",
  },
});
