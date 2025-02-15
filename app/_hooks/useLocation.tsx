import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

interface locationDeltaType {
  latitudeDelta: number;
  longitudeDelta: number;
}
// 타입 정의
interface LocationContextType {
  location: Location.LocationObjectCoords | null;
  permissionStatus: Location.LocationPermissionResponse | null;
  startLocationTracking: () => void;
  stopLocationTracking: () => void;
  running: boolean;
  setRunning: React.Dispatch<SetStateAction<boolean>>;
  locationDelta: locationDeltaType;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [subscription, setSubscription] =
    useState<Location.LocationSubscription | null>(null);
  const [permissionStatus, requestPermission] =
    Location.useForegroundPermissions();
  const [locationDelta, setLocationDelta] = useState<locationDeltaType>({
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
  });
  const [running, setRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const askPermission = async () => {
    if (!permissionStatus || !permissionStatus.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        return Alert.alert("위치 권한 필요", "위치 권한을 허용해주세요.");
      }
    }
  };
 
  // 위치 추적 중지 (setInterval 정리)
  const stopRunning = async () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    await startLocationTracking();
  };
  // 위치 추적 시작
  const startLocationTracking = async () => {
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: running? 500:3000, // 3초마다 업데이트
        distanceInterval: running? 1: 5, // 5m 이동마다 업데이트
      },
      (newLocation) => {
        setLocation(newLocation.coords);
      }
    );
    setSubscription(sub);
  };

  // 위치 추적 중지 (구독 해제)
  const stopLocationTracking = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };
  useEffect(() => {
    askPermission();
  }, []);
  return (
    <LocationContext.Provider
      value={{
        running,
        setRunning,
        location,
        permissionStatus,
        startLocationTracking,
        stopLocationTracking,
        locationDelta,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
