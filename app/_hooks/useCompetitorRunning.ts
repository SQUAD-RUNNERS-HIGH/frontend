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
    runningInfo,
    selectedCourse,
    runningLocation,
    currentCourses,
    myLocation,
    setRunningRecord,
    preRunning,
    setRunDistance,
    runDistance,
  } = useLocation();
  const { sendLocation } = useStomp();
  const { data } = useQuery({
    queryKey: ["courseHistory", runningInfo, selectedCourse],
    queryFn: () => fetchCompetitor(runningInfo, selectedCourse),
    staleTime: 100000,
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
  const [index, setIndex] = useState<number>(0);
  useEffect(() => {
    if (selectedCourse) {
      setRunningRecord({
        runningTime: 0,
        progress: [0],
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
  }, []);
  useEffect(() => {
    if (data && !preRunning) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [data, preRunning]);
  useEffect(() => {
    if (myLocation && !preRunning && data) {
      const interval = setInterval(() => {
        if (index < data?.progress.length-1) {
          setIndex((prev) => prev + 1);
        }
        sendLocation(myLocation);

        setSpeed(convertSpeedToPace(myLocation?.speed));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [myLocation, preRunning, data]);
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
          setRunDistance((prev) => prev + distance);
        }
      }
      prevLocation.current = runningLocation;
    }
  }, [runningLocation]);

  useEffect(() => {
    if (totalDistance > 0 && index > 0) {
      const newProgress = runDistance / totalDistance;
      setProgress((prevProgress) => [
        ...prevProgress,
        Number(newProgress.toFixed(4)),
      ]);
    }
  }, [index, runDistance, totalDistance]);

  useEffect(() => {
    if (data && index >= 0 && data?.progress.length >= 1) {
      const rawCompetitorProgress = data?.progress[index] ?? 0;
      const safeCompetitorProgress = isNaN(rawCompetitorProgress)
        ? 0
        : rawCompetitorProgress;
      const newCompetitorDistance =
        Number((totalDistance * safeCompetitorProgress).toFixed(0));
      setCompetitorProgress(Number(safeCompetitorProgress.toFixed(4)));
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
  }, [progress, index, totalDistance, traveledDistance]);

  return {
    data,
    speed,
    seconds,
    index,
    winning,
    distanceToCompetitor,
    competitorProgress,
    totalDistance,
  };
};
