import { useCallback, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import {
  AppState,
  AppStateStatus,
  DeviceEventEmitter,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import { useAlertStore } from "@/store/useAlertStore";
import {
  BACKGROUND_LOCATION_TASK,
  BG_LOCATION_KEY,
  BG_RUNNING_FLAG_KEY,
  BG_SECONDS_OFFSET_KEY,
} from "@/tasks/locationTask";
import {
  BACKGROUND_LOCATION_SYNC_EVENT,
  syncBackgroundLocations,
} from "@/lib/syncBackgroundLocations";
import {
  isCompetitorRunningRecord,
  isSoloRunningRecord,
} from "@/lib/discriminateRecordType";
import { useCourseStore } from "@/store/useCourseStore";
import {
  BG_NOTIFICATION_METRICS_KEY,
  BG_NOTIFICATION_UPDATED_AT_KEY,
  buildBackgroundLocationOptions,
  RUNNING_NOTIFICATION_UPDATE_INTERVAL_MS,
} from "@/lib/runningNotification";

const setNotificationMetrics = async ({
  distance,
  seconds,
}: {
  distance: number;
  seconds: number;
}) => {
  await AsyncStorage.setItem(
    BG_NOTIFICATION_METRICS_KEY,
    JSON.stringify({ distance, seconds })
  );
};

const updateRunningNotification = async ({
  distance,
  seconds,
}: {
  distance: number;
  seconds: number;
}) => {
  await setNotificationMetrics({ distance, seconds });
  await AsyncStorage.setItem(BG_NOTIFICATION_UPDATED_AT_KEY, String(Date.now()));

  await Location.startLocationUpdatesAsync(
    BACKGROUND_LOCATION_TASK,
    buildBackgroundLocationOptions({ distance, seconds })
  );
};

export const useLocationTracking = () => {
  const subscription = useRef<Location.LocationSubscription | null>(null);
  const appState = useRef(AppState.currentState);
  const syncingRef = useRef(false);
  const lastNotificationUpdateAt = useRef(0);
  const showError = useAlertStore((s) => s.showError);
  const setMyLocation = useLocationStore((s) => s.setMyLocation);
  const runningStatus = useRunningStore((state) => state.runningStatus);
  const runDistance = useRunningStore((state) => state.runDistance);
  const seconds = useRunningStore((state) => state.seconds);
  const isRunning = runningStatus === "go" || runningStatus === "countdown";

  const stopForegroundTracking = useCallback(() => {
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }
  }, []);

  const ensureForegroundPermission = useCallback(async () => {
    const permission = await Location.getForegroundPermissionsAsync();
    if (permission.granted) return true;

    const requested = await Location.requestForegroundPermissionsAsync();
    if (!requested.granted) {
      showError({
        title: "위치 권한 필요",
        description: "앱을 사용하려면 위치 권한을 허용해주세요.",
      });
      return false;
    }

    return true;
  }, [showError]);

  const ensureBackgroundPermission = useCallback(async () => {
    const permission = await Location.getBackgroundPermissionsAsync();
    if (permission.granted) return true;

    const requested = await Location.requestBackgroundPermissionsAsync();
    if (!requested.granted) {
      showError({
        title: "백그라운드 위치 권한 필요",
        description:
          "러닝 기록을 위해 백그라운드 위치 권한을 '항상 허용'으로 설정해주세요.",
      });
      return false;
    }

    return true;
  }, [showError]);

  const ensureAndroidNotificationPermission = useCallback(async () => {
    if (Platform.OS !== "android" || Platform.Version < 33) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    showError({
      title: "알림 권한 필요",
      description:
        "러닝 중 Android 상태 알림을 보려면 알림 권한을 허용해주세요.",
    });
    return false;
  }, [showError]);

  const startForegroundTracking = useCallback(async () => {
    const hasPermission = await ensureForegroundPermission();
    if (!hasPermission) return;

    stopForegroundTracking();

    const sub = await Location.watchPositionAsync(
      {
        accuracy: isRunning
          ? Location.Accuracy.BestForNavigation
          : Location.Accuracy.High,
        timeInterval: isRunning ? 2000 : 3000,
        distanceInterval: isRunning ? 1 : 5,
      },
      (newLocation) => {
        setMyLocation(newLocation.coords);
      }
    );
    subscription.current = sub;
  }, [ensureForegroundPermission, isRunning, setMyLocation, stopForegroundTracking]);

  const startBackgroundTracking = useCallback(async () => {
    const hasForegroundPermission = await ensureForegroundPermission();
    if (!hasForegroundPermission) return;

    const hasBackgroundPermission = await ensureBackgroundPermission();
    if (!hasBackgroundPermission) return;

    const hasNotificationPermission =
      await ensureAndroidNotificationPermission();
    if (!hasNotificationPermission) return;

    await AsyncStorage.setItem(BG_RUNNING_FLAG_KEY, "true");
    const runningState = useRunningStore.getState();
    await setNotificationMetrics({
      distance: runningState.runDistance,
      seconds: runningState.seconds,
    });

    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_LOCATION_TASK
    ).catch(() => false);

    if (!hasStarted) {
      await updateRunningNotification({
        distance: runningState.runDistance,
        seconds: runningState.seconds,
      });
      lastNotificationUpdateAt.current = Date.now();
    }
  }, [
    ensureAndroidNotificationPermission,
    ensureBackgroundPermission,
    ensureForegroundPermission,
  ]);

  const stopBackgroundTracking = useCallback(async (clearLocations = false) => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      BACKGROUND_LOCATION_TASK
    ).catch(() => false);

    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK).catch(
        () => undefined
      );
    }

    const keys = [
      BG_RUNNING_FLAG_KEY,
      BG_SECONDS_OFFSET_KEY,
      BG_NOTIFICATION_METRICS_KEY,
      BG_NOTIFICATION_UPDATED_AT_KEY,
    ];
    if (clearLocations) keys.push(BG_LOCATION_KEY);
    await AsyncStorage.multiRemove(keys);
  }, []);

  const applyBackgroundSync = useCallback(async () => {
    if (syncingRef.current) return;
    syncingRef.current = true;

    try {
      const result = await syncBackgroundLocations();
      if (
        result.newDistance <= 0 &&
        result.secondsElapsed <= 0 &&
        result.locations.length === 0
      ) {
        return;
      }

      const runningState = useRunningStore.getState();
      if (runningState.runningStatus !== "go") return;

      const nextSeconds = runningState.seconds + result.secondsElapsed;
      if (result.secondsElapsed > 0) {
        runningState.setSeconds(nextSeconds);
      }

      if (result.locations.length > 0) {
        const lastLocation = result.locations[result.locations.length - 1];
        setMyLocation({
          latitude: lastLocation.latitude,
          longitude: lastLocation.longitude,
        } as Location.LocationObjectCoords);
      }

      if (result.newDistance > 0) {
        const previousDistance = runningState.runDistance;
        runningState.setRunDistance((prev) => prev + result.newDistance);

        const record = runningState.runningRecord;
        if (record && isSoloRunningRecord(record)) {
          runningState.setRunningRecord({
            ...record,
            runningTime: nextSeconds,
            coordinates: [[...record.coordinates[0], ...result.newCoords]],
            progress: [...record.progress, ...result.segmentDistances],
          });
          DeviceEventEmitter.emit(BACKGROUND_LOCATION_SYNC_EVENT, {
            locations: result.locations.slice(1),
          });
        } else if (record && isCompetitorRunningRecord(record)) {
          const totalDistance = useCourseStore.getState().totalDistance;
          if (totalDistance > 0) {
            let distance = previousDistance;
            const syncedProgress = result.segmentDistances.map((segment) => {
              distance += segment;
              return Number((distance / totalDistance).toFixed(4));
            });

            runningState.setRunningRecord({
              ...record,
              runningTime: nextSeconds,
              progress: [...record.progress, ...syncedProgress],
            });
          } else {
            runningState.setRunningRecord({
              ...record,
              runningTime: nextSeconds,
            });
          }
        }
      }
    } finally {
      syncingRef.current = false;
    }
  }, [setMyLocation]);

  useEffect(() => {
    ensureForegroundPermission();
  }, [ensureForegroundPermission]);

  useEffect(() => {
    startForegroundTracking();

    if (isRunning) {
      startBackgroundTracking();
    } else {
      stopBackgroundTracking(runningStatus === "finished");
    }

    return () => {
      stopForegroundTracking();
    };
  }, [
    isRunning,
    runningStatus,
    startBackgroundTracking,
    startForegroundTracking,
    stopBackgroundTracking,
    stopForegroundTracking,
  ]);

  useEffect(() => {
    if (Platform.OS !== "android" || !isRunning) return;

    const now = Date.now();
    if (
      now - lastNotificationUpdateAt.current <
      RUNNING_NOTIFICATION_UPDATE_INTERVAL_MS
    ) {
      return;
    }

    Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK)
      .then((hasStarted) => {
        if (!hasStarted || AppState.currentState !== "active") return;
        lastNotificationUpdateAt.current = now;
        return updateRunningNotification({ distance: runDistance, seconds });
      })
      .catch(() => undefined);
  }, [isRunning, runDistance, seconds]);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      const wasActive = appState.current === "active";
      appState.current = nextAppState;

      if (nextAppState !== "active" && isRunning) {
        if (!wasActive) return;

        const runningState = useRunningStore.getState();
        await AsyncStorage.multiSet([
          [BG_SECONDS_OFFSET_KEY, Date.now().toString()],
          [BG_RUNNING_FLAG_KEY, "true"],
          [
            BG_NOTIFICATION_METRICS_KEY,
            JSON.stringify({
              distance: runningState.runDistance,
              seconds: runningState.seconds,
            }),
          ],
        ]);

        if (Platform.OS === "android") {
          const hasStarted = await Location.hasStartedLocationUpdatesAsync(
            BACKGROUND_LOCATION_TASK
          ).catch(() => false);

          if (hasStarted) {
            await updateRunningNotification({
              distance: runningState.runDistance,
              seconds: runningState.seconds,
            }).catch(() => undefined);
            lastNotificationUpdateAt.current = Date.now();
          }
        }

        const currentLocation = useLocationStore.getState().myLocation;
        if (currentLocation) {
          await AsyncStorage.setItem(
            BG_LOCATION_KEY,
            JSON.stringify([
              {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                timestamp: Date.now(),
              },
            ])
          );
        } else {
          await AsyncStorage.removeItem(BG_LOCATION_KEY);
        }
        return;
      }

      if (nextAppState === "active") {
        if (isRunning && !wasActive) {
          await applyBackgroundSync();
        }

        if (!isRunning) {
          startForegroundTracking();
        }
      }
    };

    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      appStateSubscription.remove();
    };
  }, [applyBackgroundSync, isRunning, startForegroundTracking]);
};
