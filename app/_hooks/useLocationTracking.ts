import { useEffect, useRef } from "react";
import * as Location from "expo-location";
import { Alert, AppState } from "react-native";
import { useLocationStore } from "@/store/useLocationStore";
import { useLocation } from "./useLocation";
import { useRunningStore } from "@/store/useRunningStore";
export const useLocationTracking = () => {
  const subscription = useRef<Location.LocationSubscription | null>(null);
  const [permissionStatus, requestPermission] =
    Location.useForegroundPermissions();
  const setMyLocation = useLocationStore((s) => s.setMyLocation);
  const isRunning  = useRunningStore(state => state.isRunning);
  const askPermission = async () => {
    if (!permissionStatus || !permissionStatus.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        Alert.alert("위치 권한 필요", "위치 권한을 허용해주세요.");
      }
    }
  };

  const startLocationTracking = async () => {
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: isRunning ? 500 : 3000,
        distanceInterval: isRunning ? 1 : 5,
      },
      (newLocation) => {
        setMyLocation(newLocation.coords);
      }
    );
    subscription.current = sub;
  };

  const stopLocationTracking = () => {
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }
  };

  useEffect(() => {
    askPermission();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        startLocationTracking();
      } else {
        stopLocationTracking();
      }
    });

    return () => {
      stopLocationTracking();
      sub.remove();
    };
  }, [isRunning]);
};
