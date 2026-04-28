import * as Location from "expo-location";
import { calculatePaceFromDistance } from "@/lib/convertSpeedToPace";
import { formatTime } from "@/lib/formatTime";

export const RUNNING_NOTIFICATION_UPDATE_INTERVAL_MS = 15000;

type RunningNotificationMetrics = {
  distance: number;
  seconds: number;
};

export const formatRunningDistance = (distance: number) => {
  return `${(Math.max(0, distance) / 1000).toFixed(2)}km`;
};

export const buildRunningNotificationBody = ({
  distance,
  seconds,
}: RunningNotificationMetrics) => {
  const pace = calculatePaceFromDistance(distance, seconds);
  return `거리 ${formatRunningDistance(distance)} · 시간 ${formatTime(seconds)} · 페이스 ${pace}`;
};

export const buildBackgroundLocationOptions = ({
  distance,
  seconds,
}: RunningNotificationMetrics): Location.LocationTaskOptions => ({
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 2000,
  distanceInterval: 1,
  pausesUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: true,
  foregroundService: {
    notificationTitle: "러닝 중",
    notificationBody: buildRunningNotificationBody({ distance, seconds }),
    notificationColor: "#4169E1",
    killServiceOnDestroy: false,
  },
});
