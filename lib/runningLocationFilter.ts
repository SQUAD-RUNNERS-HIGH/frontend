import { getDistance } from "geolib";

type LocationSample = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  speed?: number | null;
  timestamp?: number;
};

export const MIN_RUNNING_MOVEMENT_METERS = 2;
export const MAX_RUNNING_ACCURACY_METERS = 35;
export const STATIONARY_SPEED_THRESHOLD = 0.8;
export const STATIONARY_DISTANCE_THRESHOLD = 5;

export const hasNewerLocationTimestamp = (
  previousTimestamp: number,
  nextLocation: LocationSample | null | undefined
) => {
  if (typeof nextLocation?.timestamp !== "number") return false;
  return nextLocation.timestamp > previousTimestamp;
};

export const getFilteredRunningDistance = (
  previousLocation: LocationSample | null | undefined,
  nextLocation: LocationSample | null | undefined
) => {
  if (!previousLocation || !nextLocation) return 0;

  if (
    typeof nextLocation.accuracy === "number" &&
    nextLocation.accuracy > MAX_RUNNING_ACCURACY_METERS
  ) {
    return 0;
  }

  const distance = getDistance(previousLocation, nextLocation);
  if (distance < MIN_RUNNING_MOVEMENT_METERS) {
    return 0;
  }

  if (
    typeof nextLocation.speed === "number" &&
    nextLocation.speed >= 0 &&
    nextLocation.speed < STATIONARY_SPEED_THRESHOLD &&
    distance < STATIONARY_DISTANCE_THRESHOLD
  ) {
    return 0;
  }

  return distance;
};
