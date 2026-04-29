import { useEffect, useRef, useState } from "react";
import { DeviceEventEmitter } from "react-native";
import { location } from "@/types";
import { isSoloRunningRecord } from "../../lib/discriminateRecordType";
import { calculatePaceFromDistance } from "../../lib/convertSpeedToPace";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import useInterval from "./useInterval";
import {
  BACKGROUND_LOCATION_SYNC_EVENT,
} from "@/lib/syncBackgroundLocations";
import { BackgroundLocationPoint } from "@/tasks/locationTask";
import {
  getFilteredRunningDistance,
  hasNewerLocationTimestamp,
} from "@/lib/runningLocationFilter";

export const useSoloRunning = () => {
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
  const myLocation = useLocationStore((state) => state.myLocation);
  const [progress, setProgress] = useState<location[]>([]);
  const [speed, setSpeed] = useState<string>(`0'00''`);
  const [recentDistanceBuffer, setRecentDistanceBuffer] = useState<
    { timestamp: number; distance: number }[]
  >([]);
  const skipSyncedProgressEffect = useRef(false);
  const lastProgressTimestamp = useRef(0);
  const lastAcceptedLocation = useRef<location | null>(null);
  const PACE_WINDOW_SECONDS = 10;
  useEffect(() => {
    if (runningStatus === "go") {
      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [runningStatus]);
  // useInterval(() => {
  //   if (runningStatus === "go" && myLocation) {
  //       setProgress((prev) => [
  //         ...prev,
  //         { latitude: myLocation.latitude, longitude: myLocation.longitude },
  //       ]);
  //     }
  // },500)
  // 기존 progress 관련 useEffect 제거하고 useInterval만 사용
  useInterval(() => {
    if (
      runningStatus === "go" &&
      myLocation &&
      runningRecord &&
      isSoloRunningRecord(runningRecord)
    ) {
      const newLocation = {
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
        accuracy: myLocation.accuracy,
        speed: myLocation.speed,
        timestamp: myLocation.timestamp,
      };

      if (!hasNewerLocationTimestamp(lastProgressTimestamp.current, newLocation)) {
        return;
      }

      lastProgressTimestamp.current = newLocation.timestamp;

      if (!lastAcceptedLocation.current) {
        lastAcceptedLocation.current = newLocation;
        setProgress((prev) => [...prev, newLocation]);
        return;
      }

      const filteredDistance = getFilteredRunningDistance(
        lastAcceptedLocation.current,
        newLocation
      );

      if (filteredDistance <= 0) {
        return;
      }

      lastAcceptedLocation.current = newLocation;
      setProgress((prev) => {
        const newProgress = [...prev, newLocation];
        return newProgress;
      });
    }
  }, 2000);
  useEffect(() => {
    if (runningStatus === "countdown" && myLocation) {
      lastAcceptedLocation.current = {
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
      };
      setRunningRecord({
        runningTime: 0,
        courseName: "",
        coordinates: [[[myLocation.longitude, myLocation.latitude]]],
        progress: [],
      });
    }
  }, [myLocation]);
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      BACKGROUND_LOCATION_SYNC_EVENT,
      ({ locations }: { locations?: BackgroundLocationPoint[] }) => {
        if (!Array.isArray(locations) || locations.length === 0) return;

        skipSyncedProgressEffect.current = true;
        const lastLocation = locations[locations.length - 1];
        if (lastLocation) {
          lastAcceptedLocation.current = {
            latitude: lastLocation.latitude,
            longitude: lastLocation.longitude,
          };
        }
        setProgress((prev) => [
          ...prev,
          ...locations.map(({ latitude, longitude }) => ({
            latitude,
            longitude,
          })),
        ]);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // 거리 기반 페이스 계산
  useEffect(() => {
    if (skipSyncedProgressEffect.current) return;

    if (progress.length >= 2 && runningStatus === "go") {
      const now = Date.now();
      const distance = getFilteredRunningDistance(
        progress[progress.length - 1],
        progress[progress.length - 2]
      );

      if (distance <= 0) {
        return;
      }

      // 최근 거리 버퍼 업데이트 (10초 윈도우 유지)
      const newBuffer = [
        ...recentDistanceBuffer,
        { timestamp: now, distance },
      ].filter((item) => now - item.timestamp <= PACE_WINDOW_SECONDS * 1000);

      setRecentDistanceBuffer(newBuffer);

      // 최근 10초 총 거리와 경과 시간 계산
      if (newBuffer.length >= 2) {
        const totalRecentDistance = newBuffer.reduce(
          (sum, item) => sum + item.distance,
          0
        );
        const elapsedSeconds =
          (now - newBuffer[0].timestamp) / 1000;

        if (elapsedSeconds > 0) {
          const pace = calculatePaceFromDistance(
            totalRecentDistance,
            elapsedSeconds
          );
          setSpeed(pace);
        }
      }
    }
  }, [progress, runningStatus]);

  useEffect(() => {
    if (skipSyncedProgressEffect.current) {
      skipSyncedProgressEffect.current = false;
      return;
    }

    if (progress.length >= 2) {
      const distance = getFilteredRunningDistance(
        progress[progress.length - 1],
        progress[progress.length - 2]
      );

      if (distance <= 0) {
        return;
      }

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
  // useEffect(() => {
  //   if (progress.length >= 2) {
  //     const distance = getDistance(
  //       progress[progress.length - 1],
  //       progress[progress.length - 2]
  //     );

  //     // 전체 거리 업데이트
  //     setRunDistance((prev) => prev + distance);

  //     if (runningRecord && isSoloRunningRecord(runningRecord)) {
  //       const newCoordinates = [...runningRecord.coordinates[0]];
  //       newCoordinates.push([
  //         progress[progress.length - 1].longitude,
  //         progress[progress.length - 1].latitude,
  //       ]);

  //       // 진행률 비율 계산

  //       const newProgress = [...runningRecord.progress];
  //       newProgress.push(distance);

  //       setRunningRecord({
  //         runningTime: seconds,
  //         courseName: runningRecord.courseName,
  //         coordinates: [newCoordinates],
  //         progress: newProgress,
  //       });
  //     }
  //   }
  // }, [progress]);
  return { speed, progress };
};
