import * as Location from "expo-location";
import { calculatePaceFromDistance } from "@/lib/convertSpeedToPace";
import { formatTime } from "@/lib/formatTime";

export const RUNNING_NOTIFICATION_UPDATE_INTERVAL_MS = 10000;
export const BG_NOTIFICATION_UPDATED_AT_KEY = "@bg_notification_updated_at";

export type RunningNotificationMetrics = {
  distance: number;
  seconds: number;
  useForegroundService?: boolean;
};

export const formatRunningDistance = (distance: number) => {
  return `${(Math.max(0, distance) / 1000).toFixed(2)}km`;
};

export const buildRunningNotificationBody = ({
  distance,
  seconds,
}: RunningNotificationMetrics) => {
  const pace = calculatePaceFromDistance(distance, seconds);
  return `${formatRunningDistance(distance)} | ${formatTime(seconds)} | ${pace}`;
};

export const buildBackgroundLocationOptions = ({
  distance,
  seconds,
  useForegroundService = true,
}: RunningNotificationMetrics): Location.LocationTaskOptions => ({
  accuracy: Location.Accuracy.BestForNavigation,
  timeInterval: 2000,
  distanceInterval: 1,
  pausesUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: true,
  ...(useForegroundService
    ? {
        foregroundService: {
          notificationTitle: "Running",
          notificationBody: buildRunningNotificationBody({ distance, seconds }),
          notificationColor: "#4169E1",
          killServiceOnDestroy: false,
        },
      }
    : {}),
});
