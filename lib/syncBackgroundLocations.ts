import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDistance } from "geolib";
import {
  BG_LOCATION_KEY,
  BG_SECONDS_OFFSET_KEY,
  BackgroundLocationPoint,
} from "@/tasks/locationTask";

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
  const [rawLocations, rawOffset] = await AsyncStorage.multiGet([
    BG_LOCATION_KEY,
    BG_SECONDS_OFFSET_KEY,
  ]).then((entries) => entries.map(([, value]) => value));

  const locations = parseLocations(rawLocations);
  const offset = rawOffset ? Number(rawOffset) : NaN;
  const secondsElapsed = Number.isFinite(offset)
    ? Math.max(0, Math.floor((Date.now() - offset) / 1000))
    : 0;

  await AsyncStorage.multiRemove([BG_LOCATION_KEY, BG_SECONDS_OFFSET_KEY]);

  if (locations.length === 0) {
    return { ...EMPTY_RESULT, secondsElapsed };
  }

  const segmentDistances: number[] = [];
  let newDistance = 0;

  for (let index = 1; index < locations.length; index += 1) {
    const distance = getDistance(locations[index - 1], locations[index]);
    segmentDistances.push(distance);
    newDistance += distance;
  }

  return {
    newDistance,
    newCoords: locations
      .slice(1)
      .map(({ longitude, latitude }) => [longitude, latitude]),
    locations,
    segmentDistances,
    secondsElapsed,
  };
}
