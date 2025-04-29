import { fetchCompetitor } from "@/app/(tabs)/map/_lib/fetchCompetitor";
import { useLocation } from "@/app/_hooks/useLocation";
import { useStomp } from "@/app/_hooks/useStomp";
import { location } from "@/app/_types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPathLength } from "geolib";
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
import { fetchSaveRecord } from "@/app/(tabs)/map/_lib/fetchSaveRecord";
import FormInput from "../FormInput";
import Input from "../Input";
import { isCompetitorRunningRecord, isSoloRunningRecord } from "@/app/_lib/discriminateRecordType";
import { fetchSaveCourses } from "@/app/(tabs)/map/_lib/fetchSaveCourse";

const ResultModal = () => {
  const {
    runningInfo,
    setRunningInfo,
    selectedCourse,
    runningRecord,
    setRunningRecord,
    runDistance,
    currentCourses,
    setSelectedCourse,
  } = useLocation();
  const [courseCoordinates, setCourseCoordinates] = useState<location[]>();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (currentCourses && selectedCourse !== 'solo') {
      setCourseCoordinates(
        currentCourses
          .find((course) => course.courseId === selectedCourse)
          .coordinates[0].map(([longitude, latitude]) => ({
            latitude,
            longitude,
          }))
      );
    }
  }, [selectedCourse]);

  const handleSaveRecord = async () => {
    if (runningRecord) {
      setIsLoading(true);
      try {
        if (runningInfo === "competitorFinish"&& isCompetitorRunningRecord(runningRecord)) {
          await fetchSaveRecord(runningRecord);
        }
        if (runningInfo === "soloFinish"&& isSoloRunningRecord(runningRecord)) {
          const totalDistance = runningRecord?.progress.reduce((sum, val) => sum + val, 0);

          // 2. 누적합을 이용해 누적 비율 계산
          const cumulativeRatios: number[] = [];
          let cumulativeSum = 0;
          
          for (let i = 0; i < runningRecord?.progress.length; i++) {
            cumulativeSum += runningRecord?.progress[i];
            cumulativeRatios.push(totalDistance > 0 ? Number((cumulativeSum / totalDistance).toFixed(4)) : 0);
          }
          
          const response = await fetchSaveCourses({courseName:runningRecord?.courseName, coordinates: runningRecord?.coordinates, runningTime: runningRecord?.runningTime, progress: cumulativeRatios});
          queryClient.invalidateQueries({ queryKey: ['courses'] });
        }
        setRunningInfo("");
        setSelectedCourse("");
      } catch (error) {
        Alert.alert(`기록 저장 실패: ${error}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={runningInfo !== ""}
      onRequestClose={() => {}}
    >
      <Pressable style={styles.modalOverlay}></Pressable>
      <View style={styles.modalPosition}>
        <View style={styles.modalContainer}>
          {runningInfo === "soloFinish" &&   runningRecord && isSoloRunningRecord(runningRecord) && (
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
          <Text style={styles.modalDepscription2}>
            <Text style={{ fontWeight: "500" }}>
              {Number(runningRecord?.runningTime).toFixed(0)}초
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
              <Button
                style={{ marginTop: 6, width: "100%" }}
                onPress={handleSaveRecord}
              >
                기록 저장
              </Button>
              <Button
                style={{ marginTop: 6, width: "100%", paddingHorizontal: 12 }}
                onPress={() => {
                  setRunningInfo("");
                  setSelectedCourse("");
                }}
              >
                저장하지 않고 종료
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
