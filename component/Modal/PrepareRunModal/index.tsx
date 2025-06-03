import { fetchCompetitor } from "@/lib/map/fetchCompetitor";
import { useStomp } from "@/hooks/running/useStomp";
import { location } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getPathLength } from "geolib";
import { useEffect, useState } from "react";
import { Modal, Pressable, View, StyleSheet } from "react-native";
import PrepareCompetitor from "./PrepareCompetitor";
import PrepareSolo from "./PrepareSolo";
import { fetchCourseDetail } from "@/lib/map/fetchCourseDetail";
import { PrepareCrew } from "./PrepareCrew";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useCourseStore } from "@/store/useCourseStore";
import { useStompStore } from "@/store/useStompStore";
import PrepareSoloCourse from "./PrepareSoloCourse";
const PrepareRunModal = () => {
  const { selectedCourseId, currentCourses, setTotalDistance } = useCourseStore(
    useShallow((state) => ({
      selectedCourseId: state.selectedCourseId,
      currentCourses: state.currentCourses,
      setTotalDistance: state.setTotalDistance,
    }))
  );
  const { runningInfo, runningStatus, setRunningStatus } =
    useRunningStore(
      useShallow((state) => ({
        runningInfo: state.runningInfo,
        runningStatus: state.runningStatus,
        setRunningStatus: state.setRunningStatus,
      }))
    );
  const client = useStompStore((state) => state.client);

  const [courseCoordinates, setCourseCoordinates] = useState<location[]>();

  useEffect(() => {
    if (courseCoordinates && runningInfo.mode !== "solo") {
      const total = getPathLength(courseCoordinates);
      setTotalDistance(total);
    }
  }, [courseCoordinates]);
  useEffect(() => {
    if (currentCourses && runningInfo.mode !== "solo") {
      setCourseCoordinates(
        currentCourses
          .find((course) => course.courseId === selectedCourseId)
          .coordinates[0].map(([longitude, latitude]) => ({
            latitude,
            longitude,
          }))
      );
    }
  }, [selectedCourseId]);

  return (
    <Modal
      animationType="fade" // fade, slide, none 가능
      transparent={true} // 배경을 투명하게 설정
      visible={runningStatus === "prepare"}
      onRequestClose={() => {
        setRunningStatus("idle");
        client?.deactivate();
      }} // 안드로이드 뒤로가기 대응
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => {
          setRunningStatus("idle");
          client?.deactivate();
        }}
      ></Pressable>
      <View style={styles.modalPosition}>
        <View style={styles.modalContainer}>
          {runningInfo.mode === "solo" && <PrepareSolo />}
              {runningInfo.mode === "soloCourse" && <PrepareSoloCourse />}
          {runningInfo.mode === "competitor" && (
            <PrepareCompetitor  />
          )}
          {runningInfo.mode === "crew" && (
            <PrepareCrew />
          )}
        </View>
      </View>
    </Modal>
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
  spinnerContainer: {
    marginVertical: 12,
  },
  courseText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 12,
  },
});

export default PrepareRunModal;
