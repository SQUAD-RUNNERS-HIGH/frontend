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
import { Region } from "react-native-maps";
import { CourseResponse, runningLocation, runningRecord } from "../_types";
import { fetchSaveRecord } from "../(tabs)/map/_lib/fetchSaveRecord";

// 타입 정의
interface LocationContextType {
  myLocation: LocationObjectCoords | null;
  permissionStatus: Location.LocationPermissionResponse | null;
  startLocationTracking: () => void;
  stopLocationTracking: () => void;
  running: string;
  searchedLocation: Region | null;
  currentCourses: CourseResponse[] | null;
  runningLocation: runningLocation | null;
  setRunningLocation: React.Dispatch<SetStateAction<runningLocation | null>>;
  setCurrentCourses: React.Dispatch<SetStateAction<CourseResponse[] | null>>;
  setSearchedLocation: React.Dispatch<SetStateAction<Region | null>>;
  setRunning: React.Dispatch<SetStateAction<string>>;
  selectedCourse: string;
  setSelectedCourse: React.Dispatch<SetStateAction<string>>;
  isDropdownVisible: boolean;
  setIsDropdownVisible: React.Dispatch<SetStateAction<boolean>>;
  setMyLocation: React.Dispatch<SetStateAction<LocationObjectCoords | null>>;
  stopRunning: () => void;
  runningRecord: runningRecord | null;
  setRunningRecord: React.Dispatch<SetStateAction<runningRecord | null>>
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
  const [myLocation, setMyLocation] = useState<LocationObjectCoords | null>(
    null
  );
  const [subscription, setSubscription] =
    useState<Location.LocationSubscription | null>(null);
  const [permissionStatus, requestPermission] =
    Location.useForegroundPermissions();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [running, setRunning] = useState<string>("");
  const [runningLocation, setRunningLocation] =
    useState<runningLocation | null>(null);
  const [currentCourses, setCurrentCourses] = useState<CourseResponse[] | null>(
    null
  );
  const [runningRecord, setRunningRecord] = useState<runningRecord | null>(
    null
  );
  const askPermission = async () => {
    if (!permissionStatus || !permissionStatus.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        return Alert.alert("위치 권한 필요", "위치 권한을 허용해주세요.");
      }
    }
  };
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

  // 러닝 종료
  const stopRunning = async () => {
    if (!runningRecord) {
      Alert.alert("러닝기록을 로드하는데 실패했습니다.");
    } else {
      Alert.alert(`${runningRecord?.progress}`);
      await fetchSaveRecord(runningRecord);

    }
    setRunning("");
    setSelectedCourse("");
  };
  useEffect(() => {
    askPermission();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        running,
        setRunning,
        myLocation,
        setMyLocation,
        runningLocation,
        setRunningLocation,
        currentCourses,
        setCurrentCourses,
        permissionStatus,
        startLocationTracking,
        stopLocationTracking,
        stopRunning,
        selectedCourse,
        setSelectedCourse,
        searchedLocation,
        setSearchedLocation,
        isDropdownVisible,
        setIsDropdownVisible,
        runningRecord,
        setRunningRecord,

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
