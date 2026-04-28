import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

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
  } catch {
    // Background tasks must fail quietly; foreground sync can continue later.
  }
});
