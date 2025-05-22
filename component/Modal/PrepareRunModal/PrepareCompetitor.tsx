import { fetchCompetitor } from "@/lib/map/fetchCompetitor";
import { fetchCourseDetail } from "@/lib/map/fetchCourseDetail";
import { useStomp } from "@/hooks/running/useStomp";
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
import Button from "../../Button";
import { apiClient } from "@/api/apiClient";
import { useLocationStore } from "@/store/useLocationStore";
import { useShallow } from "zustand/react/shallow";
import { useRunningStore } from "@/store/useRunningStore";
import { useCourseStore } from "@/store/useCourseStore";
import { useStompStore } from "@/store/useStompStore";
const PrepareCompetitor = ({ totalDistance }: { totalDistance: number }) => {
  const selectedCourseId = useCourseStore(state => state.selectedCourseId);
  const client = useStompStore(state => state.client);
  const { runningInfo, setRunningStatus } = useRunningStore(
    useShallow((state) => ({
      runningInfo: state.runningInfo,
      setRunningStatus: state.setRunningStatus,
    }))
  );
  const { myLocation, stompLocation } = useLocationStore(
    useShallow((state) => ({
      myLocation: state.myLocation,
      stompLocation: state.stompLocation,
    }))
  );
  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courseDetail", selectedCourseId],
    queryFn: () => {
      return fetchCourseDetail(selectedCourseId);
    },
    enabled: !!(
      selectedCourseId &&
      selectedCourseId !== "solo" &&
      runningInfo.mode === "competitor"
    ), // selectedCourse가 있을 때만 실행,
    staleTime: 100000,
  });
  const {
    data,
    isSuccess: completeCompetitorRecord,
    error: errorCompetitorRecord,
  } = useQuery({
    queryKey: ["courseHistory", runningInfo.id, selectedCourseId],
    queryFn: () => fetchCompetitor(runningInfo.id, selectedCourseId),
    staleTime: 100000,
    enabled: !!(
      selectedCourseId &&
      selectedCourseId !== "solo" &&
      runningInfo.mode === "competitor"
    ), // selectedCourse가 있을 때만 실행,
  });
  const { connected, sendLocation } = useStomp();
  useEffect(() => {
    if (client && myLocation && connected) {
      sendLocation(myLocation);
    }
  }, [myLocation, connected]);
  return (
    <>
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
      {connected ? (
        <>
          {stompLocation?.runningStatus === "ONGOING" ? (
            <>
              <Text style={[styles.modalDepscription2, { fontWeight: 700 }]}>
                {data?.competitorUserName}님과 러닝을 시작합니다.
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
      )}
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

export default PrepareCompetitor;
