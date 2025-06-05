import { useEffect, useRef, useState } from "react";
import { location } from "@/types";
import { getDistance } from "geolib";
import { isSoloRunningRecord } from "../../lib/discriminateRecordType";
import { convertSpeedToPace } from "../../lib/convertSpeedToPace";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import useInterval from "./useInterval";
import { useCourseStore } from "@/store/useCourseStore";
import { useStomp } from "./useStomp";

export const useSoloCourseRunning = () => {
  const {
    runningStatus,
    setRunDistance,
    runningRecord,
    setRunningRecord,
    runDistance,
    seconds,
    setSeconds,
  } = useRunningStore(
    useShallow((state) => ({
      runningStatus: state.runningStatus,
      setRunDistance: state.setRunDistance,
      runningRecord: state.runningRecord,
      setRunningRecord: state.setRunningRecord,
      runDistance: state.runDistance,
      seconds: state.seconds,
      setSeconds: state.setSeconds,
    }))
  );
  const prevLocation = useRef<location | null>(null);
  const stompLocation = useLocationStore((state) => state.stompLocation);
  const { sendLocation } = useStomp();
  const { selectedCourseId, totalDistance } = useCourseStore(
    useShallow((state) => ({
      selectedCourseId: state.selectedCourseId,
      totalDistance: state.totalDistance,
    }))
  );
  const myLocation = useLocationStore((state) => state.myLocation);
  const [progress, setProgress] = useState<number[]>([]);
  const [speed, setSpeed] = useState<string>(`0'00''`);
  useInterval(() => {
    if (runningStatus === "go") {
      setSeconds((prev) => prev + 1);
    }
  }, 1000);
  useEffect(() => {
    if (runningStatus === "countdown" && myLocation) {
      setRunningRecord({
        runningTime: 0,
        progress: [0],
        courseId: selectedCourseId,
      });
    }
  }, [myLocation]); // ★ myLocation 추가
  useInterval(() => {
    if (runningStatus === "go" && myLocation) {
      if (runDistance > 0) {
        setSpeed(convertSpeedToPace(myLocation?.speed!));
      }
      sendLocation(myLocation);
    }
  }, 500);

  useEffect(() => {
    if (stompLocation) {
      if (prevLocation.current) {
        if (stompLocation?.runningStatus === "ONGOING") {
          const distance = getDistance(
            {
              latitude: prevLocation.current.latitude,
              longitude: prevLocation.current.longitude,
            },
            {
              latitude: stompLocation?.latitude,
              longitude: stompLocation?.longitude,
            }
          );
          setRunDistance((prev) => prev + distance);
        }
      }
      prevLocation.current = stompLocation;
    }
  }, [stompLocation]);

  useEffect(() => {
    if (totalDistance > 0) {
      const newProgress = runDistance / totalDistance;
      setProgress((prevProgress) => [
        ...prevProgress,
        Number(newProgress.toFixed(4)),
      ]);
    }
  }, [runDistance, totalDistance]);

  useEffect(() => {
    if (progress) {
      setRunningRecord({
        runningTime: seconds,
        progress: progress,
        courseId: selectedCourseId,
      });
    }
  }, [progress, runDistance]);
  return { speed, progress };
};
