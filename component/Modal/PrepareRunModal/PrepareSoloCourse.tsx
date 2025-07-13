import { Text, StyleSheet, View } from "react-native";
import Button from "../../Button";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useCourseStore } from "@/store/useCourseStore";
import { useLocationStore } from "@/store/useLocationStore";
import { useStomp } from "@/hooks/running/useStomp";
import MyLocation from "@/assets/images/svg/Mylocation";
import { useEffect } from "react";
import { useStompStore } from "@/store/useStompStore";
const PrepareSoloCourse = () => {
  const { selectedCourseId, setSelectedCourseId } = useCourseStore(
    useShallow((state) => ({
      selectedCourseId: state.selectedCourseId,
      setSelectedCourseId: state.setSelectedCourseId,
    }))
  );
  const { sendLocation, connected } = useStomp();
  const myLocation = useLocationStore((state) => state.myLocation);
  const client = useStompStore((state) => state.client);
  const { setRunningStatus, setRunningInfo } = useRunningStore(
    useShallow((state) => ({
      setRunningStatus: state.setRunningStatus,
      setRunningInfo: state.setRunningInfo,
    }))
  );
  useEffect(() => {
    if (client && myLocation && connected) {
      sendLocation(myLocation);
    }
  }, [myLocation, connected]);
  const stompLocation = useLocationStore((state) => state.stompLocation);
  return (
    <>
      <Text style={styles.modalDepscription2}>
        현재 위치를 기준으로 러닝을 시작합니다.
      </Text>
      <Text style={styles.modalDepscription}>러닝을 시작하시겠어요?</Text>
    
      {stompLocation?.runningStatus === "ONGOING" ? (
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            setRunningStatus("countdown");
          }}
          style={styles.button}
        >
          러닝 시작!
        </Button>
        <Button
          onPress={() => {
            setRunningStatus("idle");
            if (selectedCourseId === "solo") {
              setSelectedCourseId("");
              client?.deactivate();
            }
          }}
          style={styles.button}
        >
          취소
        </Button>
      </View>
      ): (
        <Text style={{ color: "red", marginBottom: 4, fontSize: 18 }}>
          코스에서 벗어났습니다
        </Text>
      )}
    </>
  );
};
export default PrepareSoloCourse;
const styles = StyleSheet.create({
  modalDepscription: {
    fontWeight: 500,
    fontSize: 20,
    lineHeight: 28,
    color: "#000000",
  },
  modalDepscription2: {
    fontWeight: 300,
    fontSize: 16,
    lineHeight: 28,
    color: "#000000",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
    paddingHorizontal: 48,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
  runButton: {
    width: "100%",
    backgroundColor: "#6200EE",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
