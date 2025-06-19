import { location } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import Button from "../Button";
import { fetchSaveRecord } from "@/lib/map/fetchSaveRecord";
import Input from "../Input";
import {
  isCompetitorRunningRecord,
  isSoloRunningRecord,
} from "@/lib/discriminateRecordType";
import { fetchSaveCourses } from "@/lib/map/fetchSaveCourse";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useCourseStore } from "@/store/useCourseStore";
import { useAlertStore } from "@/store/useAlertStore";
import { finishRunning } from "@/lib/finishRunning";

const ResultModal = () => {
  const { selectedCourseId, currentCourses, setSelectedCourseId } =
    useCourseStore(
      useShallow((state) => ({
        selectedCourseId: state.selectedCourseId,
        currentCourses: state.currentCourses,
        setSelectedCourseId: state.setSelectedCourseId,
      }))
    );
  const {
    runningInfo,
    setRunningInfo,
    runningRecord,
    setRunningRecord,
    runDistance,
    setRunDistance,
    runningStatus,
    seconds,
    setRunningStatus,
    crewRunningParticipants,
    resetCrewRunningParticipants,
  } = useRunningStore(
    useShallow((state) => ({
      runningInfo: state.runningInfo,
      setRunningInfo: state.setRunningInfo,
      runningRecord: state.runningRecord,
      setRunningRecord: state.setRunningRecord,
      runDistance: state.runDistance,
      setRunDistance: state.setRunDistance,
      runningStatus: state.runningStatus,
      setRunningStatus: state.setRunningStatus,
      seconds: state.seconds,
      crewRunningParticipants: state.crewRunningParticipants,
      resetCrewRunningParticipants: state.resetCrewRunningParticipants,
    }))
  );
  const [courseCoordinates, setCourseCoordinates] = useState<location[]>();
  const showError = useAlertStore((s) => s.showError);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (currentCourses && selectedCourseId !== "solo") {
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
  console.log()
  const handleSaveRecord = async () => {
    if (runningRecord) {
      setIsLoading(true);
      try {
        if (
          runningStatus === "finished" && isCompetitorRunningRecord(runningRecord) && (
          runningInfo.mode === "competitor" 
           ||
          runningInfo.mode === 'soloCourse')
        ) {
          await fetchSaveRecord(runningRecord);
          queryClient.invalidateQueries({ queryKey: ["personalRanks"] });
        }
        if (
          runningStatus === "finished" &&
          runningInfo.mode === "solo" &&
          isSoloRunningRecord(runningRecord)
        ) {
          const totalDistance = runningRecord?.progress.reduce(
            (sum, val) => sum + val,
            0
          );

          // 2. 누적합을 이용해 누적 비율 계산
          const cumulativeRatios: number[] = [];
          let cumulativeSum = 0;

          for (let i = 0; i < runningRecord?.progress.length; i++) {
            cumulativeSum += runningRecord?.progress[i];
            cumulativeRatios.push(
              totalDistance > 0
                ? Number((cumulativeSum / totalDistance).toFixed(4))
                : 0
            );
          }

          const response = await fetchSaveCourses({
            courseName: runningRecord?.courseName,
            coordinates: runningRecord?.coordinates,
            runningTime: runningRecord?.runningTime,
            progress: cumulativeRatios,
          });
          queryClient.invalidateQueries({ queryKey: ["courses"] });
        }
        setRunningStatus("idle");
        setSelectedCourseId("");
        finishRunning();
        resetCrewRunningParticipants();
      } catch (error) {
        showError({ title: "기록 저장 실패", description: `${error}` });
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={runningStatus === "finished"}
      onRequestClose={() => {}}
    >
      <Pressable style={styles.modalOverlay}></Pressable>
      <View style={styles.modalPosition}>
        <View style={styles.modalContainer}>
          {runningStatus === "finished" &&
            runningRecord &&
            isSoloRunningRecord(runningRecord) &&
            runningInfo.mode === "solo" && (
              <Input
                type="text"
                onChange={(text) => {
                  if (isSoloRunningRecord(runningRecord)) {
                    setRunningRecord((prev) => ({
                      ...prev,
                      courseName: text,
                    }));
                  }
                }}
                value={runningRecord?.courseName}
                placeholder="코스 이름을 입력하세요."
              />
            )}
          {runningInfo.mode === "crew" && (
            <Text style={styles.modalDepscription2}>
              <Text style={{ fontWeight: "500" }}>
                크루원 {crewRunningParticipants.size}명
              </Text>{" "}
              끼리
            </Text>
          )}
          <Text style={styles.modalDepscription2}>
            <Text style={{ fontWeight: "500" }}>
              {Number(seconds).toFixed(0)}초
            </Text>{" "}
            동안
          </Text>
          <Text style={styles.modalDepscription2}>
            <Text style={{ fontWeight: "500" }}>
              {Number(runDistance).toFixed(0)}m
            </Text>{" "}
            뛰었어요.
          </Text>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#000"
              style={{ marginTop: 16 }}
            />
          ) : (
            <>
              {runningInfo.mode !== "crew" && (
                <Button
                  style={{ marginTop: 6, width: "100%" }}
                  onPress={handleSaveRecord}
                >
                  기록 저장
                </Button>
              )}
              <Button
                style={{ marginTop: 12, width: "100%", paddingHorizontal: 12 }}
                onPress={() => {
                  setRunningStatus("idle");
                  setSelectedCourseId("");
                  setRunDistance(0);
                  finishRunning();
                  resetCrewRunningParticipants();
                }}
              >
                {runningInfo.mode !== "crew" ? "저장하지 않고 종료" : "종료"}
              </Button>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ResultModal;

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
    paddingHorizontal: 60,
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    zIndex: 20,
    gap: 10,
    width: "100%",
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
