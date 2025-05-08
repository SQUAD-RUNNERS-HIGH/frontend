import { useEffect, useState } from "react";
import { location } from "@/app/_types";
import { getDistance } from "geolib";
import { isSoloRunningRecord } from "../_lib/discriminateRecordType";
import { convertSpeedToPace } from "../_lib/convertSpeedToPace";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";

export const useSoloRunning = () => {

  const {
    preRunning,
    setRunDistance,
    runningRecord,
    setRunningRecord,
    runDistance,
  } = useRunningStore(
    useShallow((state) => ({
      preRunning: state.preRunning,
      setRunDistance: state.setRunDistance,
      runningRecord: state.runningRecord,
      setRunningRecord: state.setRunningRecord,
      runDistance: state.runDistance,
    }))
  );
  const myLocation = useLocationStore(state => state.myLocation);
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState<location[]>([]);
  const [speed, setSpeed] = useState<string>(`0'00''`);
  useEffect(() => {
    if (!preRunning) {

      const interval = setInterval(() => {
        setSeconds(prev => prev+1);
       
      }, 1000);
      return () => {
        clearInterval(interval);
      }
    }
  }, [preRunning])
  useEffect(() => {
    if (preRunning && myLocation) {
      setRunningRecord({
        runningTime: 0,
        courseName: "",
        coordinates: [[[myLocation.longitude, myLocation.latitude]]],
        progress: [],
      });
    }

    if (!preRunning && myLocation) {
      setSpeed(convertSpeedToPace(myLocation?.speed));
      const interval = setInterval(() => {
        setProgress((prev) => [
          ...prev,
          { latitude: myLocation.latitude, longitude: myLocation.longitude },
        ]);
      }, 500);
      return () => {
        clearInterval(interval);
      }
    }
  }, [myLocation]); // ★ myLocation 추가

  useEffect(() => {
    if (progress.length >= 2) {
      const distance = getDistance(
        progress[progress.length - 1],
        progress[progress.length - 2]
      );

      // 전체 거리 업데이트
      setRunDistance((prev) => prev + distance);

      if (runningRecord && isSoloRunningRecord(runningRecord)) {
        const newCoordinates = [...runningRecord.coordinates[0]];
        newCoordinates.push([
          progress[progress.length - 1].longitude,
          progress[progress.length - 1].latitude,
        ]);

        // 진행률 비율 계산

        const newProgress = [...runningRecord.progress];
        newProgress.push(distance);

        setRunningRecord({
          runningTime: seconds,
          courseName: runningRecord.courseName,
          coordinates: [newCoordinates],
          progress: newProgress,
        });
      }
    }
  }, [progress]);
  return { speed, seconds, progress };
};
