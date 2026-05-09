import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {
  BG_NOTIFICATION_UPDATED_AT_KEY,
  buildBackgroundLocationOptions,
  RUNNING_NOTIFICATION_UPDATE_INTERVAL_MS,
} from "@/lib/runningNotification";
import {
  getFilteredRunningDistance,
  getFilteredRunningSpeed,
} from "@/lib/runningLocationFilter";
import {
  buildBackgroundRunningMetrics,
  parseBackgroundRunningMetrics,
} from "@/lib/backgroundRunningMetrics";
import {
  getNativeRunningSnapshot,
  isNativeRunningServiceAvailable,
  updateNativeRunningMetrics,
} from "@/lib/nativeRunningService";
import { convertSpeedToPace } from "@/lib/convertSpeedToPace";

export const BACKGROUND_LOCATION_TASK = "BACKGROUND_LOCATION_TASK";
export const BG_LOCATION_KEY = "@bg_locations";
export const BG_RUNNING_FLAG_KEY = "@bg_running_active";
export const BG_SECONDS_OFFSET_KEY = "@bg_seconds_offset";
export const BG_RUNNING_METRICS_KEY = "@bg_running_metrics";

export type BackgroundLocationPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number | null;
  speed: number | null;
};

// About 2h 45m at the current 2s collection interval.
const MAX_BACKGROUND_LOCATIONS = 5000;

const parseStoredLocations = (raw: string | null): BackgroundLocationPoint[] => {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (point): point is BackgroundLocationPoint =>
        typeof point?.latitude === "number" &&
        typeof point?.longitude === "number" &&
        typeof point?.timestamp === "number"
    );
  } catch {
    return [];
  }
};

const updateAndroidForegroundNotification = async ({
  distance,
  seconds,
  pace,
}: {
  distance: number;
  seconds: number;
  pace: string;
}) => {
  if (isNativeRunningServiceAvailable()) {
    await updateNativeRunningMetrics({ distance, seconds, pace }).catch(
      () => false
    );

    const nativeSnapshot = await getNativeRunningSnapshot().catch(() => null);
    if (nativeSnapshot?.isRunning) {
      return;
    }
  }

  const now = Date.now();
  const lastUpdated = Number(
    await AsyncStorage.getItem(BG_NOTIFICATION_UPDATED_AT_KEY)
  );

  if (
    Number.isFinite(lastUpdated) &&
    now - lastUpdated < RUNNING_NOTIFICATION_UPDATE_INTERVAL_MS
  ) {
    return;
  }

  await AsyncStorage.setItem(BG_NOTIFICATION_UPDATED_AT_KEY, String(now));
  await Location.startLocationUpdatesAsync(
    BACKGROUND_LOCATION_TASK,
    buildBackgroundLocationOptions({
      distance,
      seconds,
      useForegroundService: true,
    })
  );
};

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
  if (error || !data) return;

  const isRunning = await AsyncStorage.getItem(BG_RUNNING_FLAG_KEY);
  if (isRunning !== "true") return;

  const backgroundStartedAt = await AsyncStorage.getItem(BG_SECONDS_OFFSET_KEY);
  if (!backgroundStartedAt) return;

  const { locations } = data as { locations?: Location.LocationObject[] };
  if (!Array.isArray(locations) || locations.length === 0) return;

  const points = locations
    .filter(
      (location) =>
        typeof location?.coords?.latitude === "number" &&
        typeof location?.coords?.longitude === "number"
    )
    .map((location) => ({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: location.timestamp,
      accuracy:
        typeof location.coords.accuracy === "number"
          ? location.coords.accuracy
          : null,
      speed:
        typeof location.coords.speed === "number" ? location.coords.speed : null,
    }));

  if (points.length === 0) return;

  try {
    const [rawLocations, rawMetrics] = await AsyncStorage.multiGet([
      BG_LOCATION_KEY,
      BG_RUNNING_METRICS_KEY,
    ]).then((entries) => entries.map(([, value]) => value));
    const stored = parseStoredLocations(rawLocations);
    const metrics = parseBackgroundRunningMetrics(rawMetrics);
    const offset = Number(backgroundStartedAt);
    const elapsedSeconds = Number.isFinite(offset)
      ? Math.max(0, Math.floor((Date.now() - offset) / 1000))
      : 0;

    let nextMetrics = buildBackgroundRunningMetrics({
      ...metrics,
      seconds: metrics.baseSeconds + elapsedSeconds,
    });
    const updatedLocations = [...stored];

    let previousAcceptedLocation =
      typeof nextMetrics.lastLatitude === "number" &&
      typeof nextMetrics.lastLongitude === "number"
        ? {
            latitude: nextMetrics.lastLatitude,
            longitude: nextMetrics.lastLongitude,
            timestamp: nextMetrics.lastTimestamp ?? 0,
          }
        : stored[stored.length - 1] ?? null;

    if (!previousAcceptedLocation && points.length > 0) {
      const anchor = points[0];
      updatedLocations.push(anchor);
      previousAcceptedLocation = anchor;
      nextMetrics = buildBackgroundRunningMetrics({
        ...nextMetrics,
        lastLatitude: anchor.latitude,
        lastLongitude: anchor.longitude,
        lastTimestamp: anchor.timestamp,
      });
    }

    for (const point of points) {
      if (!previousAcceptedLocation) continue;

      const distance = getFilteredRunningDistance(previousAcceptedLocation, point);
      if (distance <= 0) continue;

      updatedLocations.push(point);
      previousAcceptedLocation = point;
      nextMetrics = buildBackgroundRunningMetrics({
        ...nextMetrics,
        distance: nextMetrics.distance + distance,
        lastLatitude: point.latitude,
        lastLongitude: point.longitude,
        lastTimestamp: point.timestamp,
      });
    }

    const trimmedLocations = updatedLocations.slice(-MAX_BACKGROUND_LOCATIONS);
    const latestPoint = points[points.length - 1];
    const currentPace = latestPoint
      ? convertSpeedToPace(getFilteredRunningSpeed(latestPoint))
      : nextMetrics.pace;
    const nextPace = currentPace === `00'00"` ? nextMetrics.pace : currentPace;

    await AsyncStorage.multiSet([
      [BG_LOCATION_KEY, JSON.stringify(trimmedLocations)],
      [BG_RUNNING_METRICS_KEY, JSON.stringify(nextMetrics)],
    ]);
    await updateAndroidForegroundNotification({
      distance: nextMetrics.distance,
      seconds: nextMetrics.seconds,
      pace: nextPace,
    });
  } catch {
    // Background tasks must fail quietly; foreground sync can continue later.
  }
});
