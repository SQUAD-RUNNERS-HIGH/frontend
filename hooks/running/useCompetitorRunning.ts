import { useQuery } from "@tanstack/react-query";
import { fetchCompetitor } from "../../lib/map/fetchCompetitor";
import { useEffect, useRef, useState } from "react";
import useInterval from "./useInterval";
import { getPathLength } from "geolib";
import { location } from "../../types";
import { convertSpeedToPace } from "../../lib/convertSpeedToPace";
import { useStomp } from "./useStomp";
import { useLocationStore } from "@/store/useLocationStore";
import { useShallow } from "zustand/react/shallow";
import { useRunningStore } from "@/store/useRunningStore";
import { useCourseStore } from "@/store/useCourseStore";
import {
  getFilteredRunningDistance,
  hasNewerLocationTimestamp,
} from "@/lib/runningLocationFilter";
export const useCompetitorRunning = () => {
  const { selectedCourseId, currentCourses, totalDistance, setTotalDistance } = useCourseStore(
    useShallow((state) => ({
      selectedCourseId: state.selectedCourseId,
      currentCourses: state.currentCourses,
      totalDistance: state.totalDistance,
      setTotalDistance: state.setTotalDistance,
    }))
  );
  const {
    runningInfo,
    setRunningRecord,
    runningStatus,
    setRunDistance,
    runDistance,
    seconds,
    setSeconds
  } = useRunningStore(
    useShallow((state) => ({
      runningInfo: state.runningInfo,
      setRunningRecord: state.setRunningRecord,
      runningStatus: state.runningStatus,
      setRunDistance: state.setRunDistance,
      runDistance: state.runDistance,
      seconds: state.seconds,
      setSeconds: state.setSeconds,
    }))
  );
  const {myLocation, stompLocation} = useLocationStore(
    useShallow((state) => ({
      myLocation: state.myLocation,
      stompLocation: state.stompLocation
    }))
  )
  const { sendLocation } = useStomp();
  const { data } = useQuery({
    queryKey: ["courseHistory", runningInfo.id, selectedCourseId],
    queryFn: () => fetchCompetitor(runningInfo.id, selectedCourseId),
    staleTime: 100000,
  });
  const [currentCourse, setCurrentCourse] = useState<location[] | null>(null);
  const [speed, setSpeed] = useState<string>("00'00\"");
  const [progress, setProgress] = useState<number[]>([]);
  const [competitorProgress, setCompetitorProgress] = useState<number>(0);
  const prevLocation = useRef<location | null>(null);
  const lastSentTimestamp = useRef(0);
  const [distanceToCompetitor, setDistanceToCompetitor] = useState<number>(0);
  const [winning, setWinning] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);
  useEffect(() => {
    if (selectedCourseId) {
      setRunningRecord({
        runningTime: 0,
        progress: [0],
        courseId: selectedCourseId,
      });
    }
    if (currentCourses) {
      setCurrentCourse(
        currentCourses
          ?.find((course) => course.courseId === selectedCourseId)
          .coordinates[0].map(([longitude, latitude]) => ({
            latitude,
            longitude,
          }))
      );
    }
  }, []);
  useInterval(
    () => {
      setSeconds((prev) => prev + 1);
    },
    data && runningStatus === 'go' ? 1000 : null
  );
  useInterval(
    () => {
      if (myLocation) {
        if (index < (data?.progress.length ?? 1) - 1) {
          setIndex((prev) => prev + 1);
        }
        if (hasNewerLocationTimestamp(lastSentTimestamp.current, myLocation)) {
          lastSentTimestamp.current = myLocation.timestamp;
          sendLocation(myLocation);
        }
        setSpeed(convertSpeedToPace(myLocation?.speed ?? 0));
      }
    },
    data && runningStatus === 'go' ? 500 : null
  );
  useEffect(() => {
    if (currentCourse && currentCourse.length > 1) {
      const total = getPathLength(currentCourse);
      setTotalDistance(total);
    }
  }, [currentCourse]);

  useEffect(() => {
    if (stompLocation) {
      if (prevLocation.current) {
        if (stompLocation?.runningStatus === "ONGOING") {
          const distance = getFilteredRunningDistance(
            {
              latitude: prevLocation.current.latitude,
              longitude: prevLocation.current.longitude,
            },
            {
              latitude: stompLocation?.latitude,
              longitude: stompLocation?.longitude,
              accuracy: stompLocation?.accuracy,
              speed: stompLocation?.speed,
            }
          );
          if (distance <= 0) {
            prevLocation.current = stompLocation;
            return;
          }
          setRunDistance((prev) => prev + distance);
        }

      }
      prevLocation.current = stompLocation;

    }
  }, [stompLocation]);

  useEffect(() => {
    if (totalDistance > 0 && index > 0) {
      const newProgress = runDistance / totalDistance;
      setProgress((prevProgress) => [
        ...prevProgress,
        Number(newProgress.toFixed(4)),
      ]);
    }
  }, [index]);

  useEffect(() => {
    if (data && index >= 0 && data?.progress.length >= 1) {
      const rawCompetitorProgress = data?.progress[index] ?? 0;
      const safeCompetitorProgress = isNaN(rawCompetitorProgress)
        ? 0
        : rawCompetitorProgress;
      const newCompetitorDistance =
        Number((totalDistance * safeCompetitorProgress).toFixed(0));
      setCompetitorProgress(Number(safeCompetitorProgress.toFixed(4)));
      setWinning(runDistance >= newCompetitorDistance);
      setDistanceToCompetitor(
        Math.abs(newCompetitorDistance - runDistance)
      );
    }
    setRunningRecord({
      runningTime: seconds,
      progress: progress,
      courseId: selectedCourseId,
    });
  }, [progress, index, totalDistance, runDistance]);
  return {
    data,
    speed,
    index,
    winning,
    distanceToCompetitor,
    competitorProgress,
  };
};
