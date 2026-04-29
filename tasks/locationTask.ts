import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { getDistance } from "geolib";
import {
  BG_NOTIFICATION_METRICS_KEY,
  BG_NOTIFICATION_UPDATED_AT_KEY,
  buildBackgroundLocationOptions,
  parseRunningNotificationMetrics,
  RUNNING_NOTIFICATION_UPDATE_INTERVAL_MS,
} from "@/lib/runningNotification";

export const BACKGROUND_LOCATION_TASK = "BACKGROUND_LOCATION_TASK";
export const BG_LOCATION_KEY = "@bg_locations";
export const BG_RUNNING_FLAG_KEY = "@bg_running_active";
export const BG_SECONDS_OFFSET_KEY = "@bg_seconds_offset";

export type BackgroundLocationPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
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

const calculateDistance = (locations: BackgroundLocationPoint[]) => {
  let distance = 0;

  for (let index = 1; index < locations.length; index += 1) {
    distance += getDistance(locations[index - 1], locations[index]);
  }

  return distance;
};

const updateAndroidForegroundNotification = async ({
  locations,
  backgroundStartedAt,
}: {
  locations: BackgroundLocationPoint[];
  backgroundStartedAt: string;
}) => {
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

  const baseMetrics = parseRunningNotificationMetrics(
    await AsyncStorage.getItem(BG_NOTIFICATION_METRICS_KEY)
  );
  const offset = Number(backgroundStartedAt);
  const backgroundSeconds = Number.isFinite(offset)
    ? Math.max(0, Math.floor((now - offset) / 1000))
    : 0;

  await AsyncStorage.setItem(BG_NOTIFICATION_UPDATED_AT_KEY, String(now));
  await Location.startLocationUpdatesAsync(
    BACKGROUND_LOCATION_TASK,
    buildBackgroundLocationOptions({
      distance: baseMetrics.distance + calculateDistance(locations),
      seconds: baseMetrics.seconds + backgroundSeconds,
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
    }));

  if (points.length === 0) return;

  try {
    const raw = await AsyncStorage.getItem(BG_LOCATION_KEY);
    const stored = parseStoredLocations(raw);
    const updated = [...stored, ...points].slice(-MAX_BACKGROUND_LOCATIONS);
    await AsyncStorage.setItem(BG_LOCATION_KEY, JSON.stringify(updated));
    await updateAndroidForegroundNotification({
      locations: updated,
      backgroundStartedAt,
    });
  } catch {
    // Background tasks must fail quietly; foreground sync can continue later.
  }
});
