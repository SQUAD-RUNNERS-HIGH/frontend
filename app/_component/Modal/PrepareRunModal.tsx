import { fetchCompetitor } from "@/app/(tabs)/map/_lib/fetchCompetitor";
import { useLocation } from "@/app/_hooks/useLocation";
import { useStomp } from "@/app/_hooks/useStomp";
import { location } from "@/app/_types";
import { useQuery } from "@tanstack/react-query";
import { getPathLength } from "geolib";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import Button from "../Button";
import { fetchCourseDetail } from "@/app/(tabs)/map/_lib/fetchCourseDetail";
const PrepareRunModal = () => {
  const {
    runningInfo,
    setRunningInfo,
    selectedCourse,
    myLocation,
    runningLocation,
    currentCourses,
    setIsRunning,
    setPreRunning,
  } = useLocation();
  const {
    data,
    isSuccess: completeCompetitorRecord,
    error: errorCompetitorRecord,
  } = useQuery({
    queryKey: ["courseHistory", runningInfo, selectedCourse],
    queryFn: () => fetchCompetitor(runningInfo, selectedCourse),
    staleTime: 100000,
  });
  const { connected, sendLocation } = useStomp();
  const [totalDistance, setTotalDistance] = useState<number>();
  const [courseCoordinates, setCourseCoordinates] = useState<location[]>();
  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courseDetail", selectedCourse],
    queryFn: () => fetchCourseDetail(selectedCourse),
    enabled: !!selectedCourse, // selectedCourse가 있을 때만 실행,
    staleTime: 6000,
  });
  useEffect(() => {
    if (currentCourses) {
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
  useEffect(() => {
    if (courseCoordinates) {
      const total = getPathLength(courseCoordinates);
      setTotalDistance(total);
    }
  }, [courseCoordinates]);

  useEffect(() => {
    if (connected && myLocation) {
      sendLocation(myLocation);
    }
  }, [myLocation]);
  useEffect(() => {
    if (runningLocation) {
      console.log(runningLocation);
    }
  }, [runningLocation]);
  return (
    <Modal
      animationType="slide" // fade, slide, none 가능
      transparent={true} // 배경을 투명하게 설정
      visible={runningInfo !== ""}
      onRequestClose={() => setRunningInfo("")} // 안드로이드 뒤로가기 대응
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setRunningInfo("")}
      ></Pressable>
      <View style={styles.modalPosition}>
        <View style={styles.modalContainer}>
          {completeCompetitorRecord ? (
            <>
              <Text style={styles.modalDepscription}>{detail?.courseName}</Text>
              <Text style={styles.modalDepscription2}>
                {Number(totalDistance).toFixed(0)}m
              </Text>
              <Text style={styles.modalDepscription2}>
                {Number(data?.runningTime).toFixed(0)}초 동안 뛰었어요.
              </Text>
            </>
          ) : (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          {runningLocation?.runningStatus === "ONGOING" ? (
            <>
              <Text style={[styles.modalDepscription2, { fontWeight: 700 }]}>
                {data?.competitorUserName}님과 러닝을 시작합니다.
              </Text>

              <Button
                style={{ marginTop: 6, width: "100%" }}
                onPress={() => {
                  setPreRunning(true);
                  setIsRunning(true);
                }}
              >
                러닝 시작!
              </Button>
            </>
          ) : (
            <Text style={styles.courseText}>현재 위치가 코스에서 떨어져있습니다.</Text>
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
    marginTop:12,
    marginBottom:12,

  },
});

export default PrepareRunModal;
