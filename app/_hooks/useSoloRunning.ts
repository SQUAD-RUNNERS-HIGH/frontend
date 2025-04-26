import { useEffect, useState } from "react";
import { useLocation } from "./useLocation";
import { location } from "@/app/_types";
import { getDistance } from "geolib";
import { isSoloRunningRecord } from "../_lib/discriminateRecordType";

export const useSoloRunning = () => {
  const {
    myLocation,
    preRunning,
    setRunDistance,
    runningRecord,
    setRunningRecord,
  } = useLocation();
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState<location[]>([]);
  useEffect(() => {
    if (preRunning && myLocation) {
      setRunningRecord({
        runningTime: 0,
        courseName: "",
        coordinates: [[[myLocation?.latitude, myLocation?.longitude]]],
      });
    }
    if (!preRunning && myLocation) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        setProgress((prev) => [
          ...prev,
          { latitude: myLocation?.latitude, longitude: myLocation?.longitude },
        ]);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [preRunning]);

  useEffect(() => {
    if (progress.length >= 2) {
      const distance = getDistance(
        progress[progress.length - 1],
        progress[progress.length - 2]
      );
      setRunDistance((prev) => prev + distance);
      // 좌표 추가 업데이트
      if (runningRecord) {
        const newRunningRecord = [...runningRecord.coordinates[0]]; // 복사
        newRunningRecord.push([
          progress[progress.length - 1].latitude,
          progress[progress.length - 1].longitude,
        ]);
        setRunningRecord({
          runningTime: seconds,
          courseName: runningRecord.courseName, // 기존 값 유지
          coordinates: [newRunningRecord],
        });
      }
    }
  }, [progress]);

  return { seconds, progress };
};
