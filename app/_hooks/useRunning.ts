import { useLocation } from "./useLocation";
import { useEffect, useRef, useState } from "react";
import { getDistance, getPathLength } from "geolib";
import { location } from "../_types";
import { convertSpeedToPace } from "../_lib/convertSpeedToPace";

export const useRunning = (sendLocation: (location: location) => void) => {
  const { selectedCourse, runningLocation, currentCourses, myLocation, setRunningRecord } =
    useLocation();
  const [currentCourse, setCurrentCourse] = useState<location[] | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [speed, setSpeed] = useState<string>("00'00\"");
  const [progress, setProgress] = useState<number[]>([]);
  const [traveledDistance, setTraveledDistance] = useState(0); // 유저 실제 이동 거리 (m)
  const prevLocation = useRef<location | null>(null);
  useEffect(() => {
    if(selectedCourse) {
      setRunningRecord({ runningTime: 0, progress: [], courseId: selectedCourse})
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
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
      if (myLocation) {
        sendLocation(myLocation);
      }
      setSpeed(convertSpeedToPace(myLocation?.speed));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentCourse && currentCourse.length > 1) {
      const total = getPathLength(currentCourse);
      setTotalDistance(total);
    }
  }, [currentCourse]);

  useEffect(() => {
    if (runningLocation) {
      if (prevLocation.current) {
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
          // 진행률 계산
          // 진행률 저장 (savedRecord는 배열로 저장한다고 가정)
          return newTraveledDistance;
        });
      } 
      else {

      }
      prevLocation.current = runningLocation;
    }
  }, [runningLocation]);

  useEffect(() => {
    const progress = totalDistance
      ? (traveledDistance / totalDistance) * 100
      : 0;
    if (seconds % 2===0) {
      setProgress((prev) => [...prev, Number(progress.toFixed(2))]);
    }
  }, [traveledDistance]);

  useEffect(() => {
    console.log('progress',progress);
    setRunningRecord({ runningTime: seconds, progress: progress, courseId: selectedCourse})
  }, [seconds, progress]);

  return { seconds, speed, totalDistance, traveledDistance };
};
