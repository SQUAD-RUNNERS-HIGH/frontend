import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { LocationObjectCoords } from "expo-location";
import { fetchUserLocation } from "../(tabs)/map/_lib/fetchUserLocation";
import { Region } from "react-native-maps";

// 타입 정의
interface LocationContextType {
  myLocation: Location.LocationObjectCoords | null;
  permissionStatus: Location.LocationPermissionResponse | null;
  startLocationTracking: () => void;
  stopLocationTracking: () => void;
  running: string;
  searchedLocation: Region | null;
  setSearchedLocation: React.Dispatch<SetStateAction<Region | null>>;
  setRunning: React.Dispatch<SetStateAction<string>>;
  selectedCourse: string;
  setSelectedCourse: React.Dispatch<SetStateAction<string>>;
  isDropdownVisible: boolean;
  setIsDropdownVisible: React.Dispatch<SetStateAction<boolean>>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchedLocation, setSearchedLocation] = useState<Region | null>(null);
  const [myLocation, setMyLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [subscription, setSubscription] =
    useState<Location.LocationSubscription | null>(null);
  const [permissionStatus, requestPermission] =
    Location.useForegroundPermissions();
  const prevLocationRef = useRef<LocationObjectCoords | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [isDropdownVisible,setIsDropdownVisible] = useState<boolean>(false);
  const [running, setRunning] = useState<string>('');

  const askPermission = async () => {
    if (!permissionStatus || !permissionStatus.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        return Alert.alert("위치 권한 필요", "위치 권한을 허용해주세요.");
      }
    }
  };
  async function onChangeLoation() {
    if (!myLocation) return;

    const { latitude, longitude } = myLocation;
    const prevLocation = prevLocationRef.current;

    if (
      !prevLocation ||
      prevLocation.latitude !== latitude ||
      prevLocation.longitude !== longitude
    ) {
      await fetchUserLocation({ latitude, longitude });
    }
    prevLocationRef.current = myLocation; // 현재 location을 저장하여 다음에 비교할 수 있도록 설정
  }
  // 위치 추적 시작
  const startLocationTracking = async () => {
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: running ? 500 : 3000, // 3초마다 업데이트
        distanceInterval: running ? 1 : 5, // 5m 이동마다 업데이트
      },
      (newLocation) => {
        setMyLocation(newLocation.coords);
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
  useEffect(() => {
    onChangeLoation();
  }, [myLocation]);
  return (
    <LocationContext.Provider
      value={{
        running,
        setRunning,
        myLocation,
        permissionStatus,
        startLocationTracking,
        stopLocationTracking,
        selectedCourse,
        setSelectedCourse,
        searchedLocation,
        setSearchedLocation,
        isDropdownVisible,
        setIsDropdownVisible,
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
