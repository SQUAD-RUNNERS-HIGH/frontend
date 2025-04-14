import { useQuery } from "@tanstack/react-query";
import { useLocation } from "./useLocation";
import { useEffect, useRef, useState } from "react";
import { getDistance, getPathLength } from "geolib";
import { location } from "../_types";
import { convertSpeedToPace } from "../_lib/convertSpeedToPace";
import MyLocation from "@/assets/images/svg/Mylocation";

export const useRunning = (sendLocation: (location: location) => void) => {
  const { selectedCourse, correctedLocation, currentCourses, myLocation } = useLocation();
  const [currentCourse, setCurrentCourse] = useState<location[] | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [speed, setSpeed] = useState<string>("00'00\"");
  const [savedRecord, setSavedRecord] = useState<number[]>([]);
  const [traveledDistance, setTraveledDistance] = useState(0); // 유저 실제 이동 거리 (m)
  const prevLocation = useRef<location | null>(null);
  // const progress = Math.min(seconds / dummyData, 1);

  useEffect(() => {
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
      if(myLocation) {
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
    if (correctedLocation) {
      if (prevLocation.current) {
        const distance = getDistance(prevLocation.current, correctedLocation);
   
        setTraveledDistance((prev) => {
          const newTraveledDistance = prev + distance;
          // 진행률 계산
          // 진행률 저장 (savedRecord는 배열로 저장한다고 가정)
          return newTraveledDistance;
        });
      }
  
      prevLocation.current = correctedLocation;
    }
  }, [correctedLocation]);
  
  useEffect(() => {
              const progress = totalDistance ? (traveledDistance / totalDistance) * 100 : 0;

    setSavedRecord((prev) => [...prev, Number(progress.toFixed(2))]);
  },[traveledDistance])
  return { seconds, speed, totalDistance, traveledDistance, savedRecord };
};
