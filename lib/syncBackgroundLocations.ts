import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BG_LOCATION_KEY,
  BG_RUNNING_METRICS_KEY,
  BG_SECONDS_OFFSET_KEY,
  BackgroundLocationPoint,
} from "@/tasks/locationTask";
import { getFilteredRunningDistance } from "@/lib/runningLocationFilter";
import { parseBackgroundRunningMetrics } from "@/lib/backgroundRunningMetrics";

export const BACKGROUND_LOCATION_SYNC_EVENT = "background-location-sync";

export type BackgroundLocationSyncResult = {
  newDistance: number;
  newCoords: [number, number][];
  locations: BackgroundLocationPoint[];
  segmentDistances: number[];
  secondsElapsed: number;
};

const EMPTY_RESULT: BackgroundLocationSyncResult = {
  newDistance: 0,
  newCoords: [],
  locations: [],
  segmentDistances: [],
  secondsElapsed: 0,
};

const parseLocations = (raw: string | null): BackgroundLocationPoint[] => {
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

export async function syncBackgroundLocations(): Promise<BackgroundLocationSyncResult> {
  const [rawLocations, rawOffset, rawMetrics] = await AsyncStorage.multiGet([
    BG_LOCATION_KEY,
    BG_SECONDS_OFFSET_KEY,
    BG_RUNNING_METRICS_KEY,
  ]).then((entries) => entries.map(([, value]) => value));

  const locations = parseLocations(rawLocations);
  const offset = rawOffset ? Number(rawOffset) : NaN;
  const metrics = parseBackgroundRunningMetrics(rawMetrics);
  const secondsElapsed = Number.isFinite(offset)
    ? Math.max(0, Math.floor((Date.now() - offset) / 1000))
    : 0;

  await AsyncStorage.multiRemove([
    BG_LOCATION_KEY,
    BG_SECONDS_OFFSET_KEY,
    BG_RUNNING_METRICS_KEY,
  ]);

  if (locations.length === 0) {
    return {
      ...EMPTY_RESULT,
      newDistance: Math.max(0, metrics.distance - metrics.baseDistance),
      secondsElapsed: Math.max(0, metrics.seconds - metrics.baseSeconds),
    };
  }

  const segmentDistances: number[] = [];
  const acceptedLocations: BackgroundLocationPoint[] = [locations[0]];
  let previousAcceptedLocation = locations[0];
  let newDistance = 0;

  for (let index = 1; index < locations.length; index += 1) {
    const nextLocation = locations[index];
    const distance = getFilteredRunningDistance(
      previousAcceptedLocation,
      nextLocation
    );

    if (distance <= 0) continue;

    segmentDistances.push(distance);
    acceptedLocations.push(nextLocation);
    newDistance += distance;
    previousAcceptedLocation = nextLocation;
  }

  return {
    newDistance:
      metrics.distance > 0
        ? Math.max(0, metrics.distance - metrics.baseDistance)
        : newDistance,
    newCoords: acceptedLocations
      .slice(1)
      .map(({ longitude, latitude }) => [longitude, latitude]),
    locations: acceptedLocations,
    segmentDistances,
    secondsElapsed:
      metrics.seconds > 0
        ? Math.max(0, metrics.seconds - metrics.baseSeconds)
        : secondsElapsed,
  };
}
