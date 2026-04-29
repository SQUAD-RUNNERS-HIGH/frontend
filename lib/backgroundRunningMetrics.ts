import { calculatePaceFromDistance } from "@/lib/convertSpeedToPace";

export type BackgroundRunningMetrics = {
  baseDistance: number;
  baseSeconds: number;
  distance: number;
  seconds: number;
  pace: string;
  lastLatitude: number | null;
  lastLongitude: number | null;
  lastTimestamp: number | null;
};

const EMPTY_METRICS: BackgroundRunningMetrics = {
  baseDistance: 0,
  baseSeconds: 0,
  distance: 0,
  seconds: 0,
  pace: `00'00"`,
  lastLatitude: null,
  lastLongitude: null,
  lastTimestamp: null,
};

export const buildBackgroundRunningMetrics = (
  partial: Partial<BackgroundRunningMetrics>
): BackgroundRunningMetrics => {
  const nextDistance = Math.max(0, partial.distance ?? 0);
  const nextSeconds = Math.max(0, partial.seconds ?? 0);

  return {
    ...EMPTY_METRICS,
    ...partial,
    baseDistance: Math.max(0, partial.baseDistance ?? nextDistance),
    baseSeconds: Math.max(0, partial.baseSeconds ?? nextSeconds),
    distance: nextDistance,
    seconds: nextSeconds,
    pace: calculatePaceFromDistance(nextDistance, nextSeconds),
  };
};

export const parseBackgroundRunningMetrics = (raw: string | null) => {
  if (!raw) return buildBackgroundRunningMetrics({});

  try {
    const parsed = JSON.parse(raw);
    return buildBackgroundRunningMetrics({
      baseDistance:
        typeof parsed?.baseDistance === "number" ? parsed.baseDistance : 0,
      baseSeconds:
        typeof parsed?.baseSeconds === "number" ? parsed.baseSeconds : 0,
      distance: typeof parsed?.distance === "number" ? parsed.distance : 0,
      seconds: typeof parsed?.seconds === "number" ? parsed.seconds : 0,
      lastLatitude:
        typeof parsed?.lastLatitude === "number" ? parsed.lastLatitude : null,
      lastLongitude:
        typeof parsed?.lastLongitude === "number" ? parsed.lastLongitude : null,
      lastTimestamp:
        typeof parsed?.lastTimestamp === "number" ? parsed.lastTimestamp : null,
    });
  } catch {
    return buildBackgroundRunningMetrics({});
  }
};
