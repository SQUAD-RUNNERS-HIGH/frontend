import { useQuery } from "@tanstack/react-query";
import { useLocation } from "./useLocation";
import { fetchCompetitor } from "../(tabs)/map/_lib/fetchCompetitor";
import { useEffect, useRef, useState } from "react";
import { getDistance, getPathLength } from "geolib";
import { location } from "../_types";
import { convertSpeedToPace } from "../_lib/convertSpeedToPace";
import { useStomp } from "./useStomp";
export const useCompetitorRunning = () => {
  const {
    running,
    selectedCourse,
    runningLocation,
    currentCourses,
    myLocation,
    setRunningRecord,
    preRunning,
  } = useLocation();
  const { sendLocation } = useStomp();
  const {
    data,
    isSuccess: completeCompetitorRecord,
    error: errorCompetitorRecord,
  } = useQuery({
    queryKey: ["courseHistory", running, selectedCourse],
    queryFn: () => fetchCompetitor(running, selectedCourse),
  });
  const [currentCourse, setCurrentCourse] = useState<location[] | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [speed, setSpeed] = useState<string>("00'00\"");
  const [progress, setProgress] = useState<number[]>([]);
  const [competitorProgress, setCompetitorProgress] = useState<number>(0);
  const [traveledDistance, setTraveledDistance] = useState(0); // 유저 실제 이동 거리 (m)
  const prevLocation = useRef<location | null>(null);
  const [distanceToCompetitor, setDistanceToCompetitor] = useState<number>(0);
  const [winning, setWinning] = useState<boolean>(true);

  useEffect(() => {
    if (selectedCourse) {
      setRunningRecord({
        runningTime: 0,
        progress: [],
        courseId: selectedCourse,
      });
    }
    if (currentCourses) {
      setCurrentCourse(
        currentCourses
          ?.find((course) => course.courseId === selectedCourse)
          .coordinates[0].map(([longitude, latitude]) => ({
            latitude,
            longitude,
          }))
      );
    }
    if (completeCompetitorRecord) {
      if (selectedCourse) {
        setRunningRecord({
          runningTime: 0,
          progress: [],
          courseId: selectedCourse,
        });
      }
    }
  }, [completeCompetitorRecord]);
  useEffect(() => {
    if (completeCompetitorRecord && !preRunning) {
      // ✅ 조건 추가
      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        if (myLocation) {
          sendLocation(myLocation);
        }
        setSpeed(convertSpeedToPace(myLocation?.speed));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [completeCompetitorRecord, preRunning]); // 의존성 배열에 preRunning 추가
  useEffect(() => {
    if (currentCourse && currentCourse.length > 1) {
      const total = getPathLength(currentCourse);
      setTotalDistance(total);
    }
  }, [currentCourse]);
  useEffect(() => {
    if (runningLocation) {
      if (prevLocation.current) {
        if (runningLocation?.runningStatus === "ONGOING") {
          const distance = getDistance(
            {
              latitude: prevLocation.current.latitude,
              longitude: prevLocation.current.longitude,
            },
            {
              latitude: runningLocation?.latitude,
              longitude: runningLocation?.longitude,
            }
          );
          setTraveledDistance((prev) => {
            const newTraveledDistance = prev + distance;
            return newTraveledDistance;
          });
        }
      }
      prevLocation.current = runningLocation;
    }
  }, [runningLocation]);

  useEffect(() => {
    const newProgress = totalDistance
      ? (traveledDistance / totalDistance) * 100
      : 0;
    setProgress((prev) => [...prev, Number(newProgress.toFixed(2))]);
  }, [seconds]);

  useEffect(() => {
    if (data && seconds > 0 && seconds - 1 < data?.progress.length) {
      const newCompetitorProgress = data?.progress[seconds - 1] ?? 0;
      const newCompetitorDistance =
        totalDistance * (Math.min(newCompetitorProgress, 100) / 100);
      setCompetitorProgress(newCompetitorProgress);
      setWinning(traveledDistance >= newCompetitorDistance);
      setDistanceToCompetitor(
        Math.abs(newCompetitorDistance - traveledDistance)
      );
    }
    setRunningRecord({
      runningTime: seconds,
      progress: progress,
      courseId: selectedCourse,
    });
  }, [progress]);
  return {
    data,
    speed,
    seconds,
    winning,
    distanceToCompetitor,
    competitorProgress,
    completeCompetitorRecord,
  };
};
