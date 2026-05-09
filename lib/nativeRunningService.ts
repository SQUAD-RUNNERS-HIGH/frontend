import { NativeModules, Platform } from "react-native";

type NativeRunningServiceModule = {
  start(distance: number, seconds: number, pace: string): Promise<void>;
  update(distance: number, seconds: number, pace: string): Promise<void>;
  stop(): Promise<void>;
  getSnapshot(): Promise<NativeRunningSnapshot>;
};

export type NativeRunningSnapshot = {
  isRunning: boolean;
  distance: number;
  seconds: number;
  pace: string;
};

const nativeModule = NativeModules
  .RunningForegroundServiceModule as NativeRunningServiceModule | undefined;

const NATIVE_SERVICE_START_CHECK_DELAY_MS = 150;
const NATIVE_SERVICE_START_CHECK_RETRIES = 3;

export const isNativeRunningServiceAvailable = () =>
  Platform.OS === "android" && !!nativeModule;

export const startNativeRunningService = async ({
  distance,
  seconds,
  pace,
}: {
  distance: number;
  seconds: number;
  pace: string;
}) => {
  if (!isNativeRunningServiceAvailable()) return false;

  await nativeModule?.start(distance, seconds, pace);
  return true;
};

export const updateNativeRunningMetrics = async ({
  distance,
  seconds,
  pace,
}: {
  distance: number;
  seconds: number;
  pace: string;
}) => {
  if (!isNativeRunningServiceAvailable()) return false;

  await nativeModule?.update(distance, seconds, pace);
  return true;
};

export const stopNativeRunningService = async () => {
  if (!isNativeRunningServiceAvailable()) return false;

  await nativeModule?.stop();
  return true;
};

export const getNativeRunningSnapshot = async () => {
  if (!isNativeRunningServiceAvailable()) return null;

  return nativeModule?.getSnapshot() ?? null;
};

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const isNativeRunningServiceRunning = async () => {
  const snapshot = await getNativeRunningSnapshot();
  return snapshot?.isRunning ?? false;
};

export const ensureNativeRunningServiceStarted = async ({
  distance,
  seconds,
  pace,
}: {
  distance: number;
  seconds: number;
  pace: string;
}) => {
  const started = await startNativeRunningService({ distance, seconds, pace });
  if (!started) {
    return false;
  }

  for (let attempt = 0; attempt < NATIVE_SERVICE_START_CHECK_RETRIES; attempt += 1) {
    if (await isNativeRunningServiceRunning()) {
      return true;
    }

    await wait(NATIVE_SERVICE_START_CHECK_DELAY_MS);
  }

  return false;
};
