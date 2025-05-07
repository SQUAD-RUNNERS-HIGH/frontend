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
import { CourseResponse, runningLocation, soloRunningRecord, competitorRunningRecord, Participant } from "../_types";
import { Client } from "@stomp/stompjs";

// 타입 정의
interface LocationContextType {
  myLocation: LocationObjectCoords | null;
  permissionStatus: Location.LocationPermissionResponse | null;
  startLocationTracking: () => void;
  stopLocationTracking: () => void;
  runningInfo: string;
  searchedLocation: Region | null;
  currentCourses: CourseResponse[] | null;
  runningLocation: runningLocation | null;
  setRunningLocation: React.Dispatch<SetStateAction<runningLocation | null>>;
  setCurrentCourses: React.Dispatch<SetStateAction<CourseResponse[] | null>>;
  setSearchedLocation: React.Dispatch<SetStateAction<Region | null>>;
  setRunningInfo: React.Dispatch<SetStateAction<string>>;
  selectedCourse: string;
  setSelectedCourse: React.Dispatch<SetStateAction<string>>;
  isDropdownVisible: boolean;
  setIsDropdownVisible: React.Dispatch<SetStateAction<boolean>>;
  setMyLocation: React.Dispatch<SetStateAction<LocationObjectCoords | null>>;
  runningRecord: soloRunningRecord | competitorRunningRecord | null;
  setRunningRecord: React.Dispatch<SetStateAction<soloRunningRecord | competitorRunningRecord | null>>;
  preRunning: boolean;
  setPreRunning: React.Dispatch<SetStateAction<boolean>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<SetStateAction<boolean>>;
  client: React.MutableRefObject<Client | null>;
  runDistance: number;
  setRunDistance: React.Dispatch<SetStateAction<number>>;
  runningParticipants: Participant[]
  setRunningParticipants: React.Dispatch<SetStateAction<Participant[]>>
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
  const [runningParticipants, setRunningParticipants] = useState<Participant[]>([]);
  const [subscription, setSubscription] =
    useState<Location.LocationSubscription | null>(null);
  const [permissionStatus, requestPermission] =
    Location.useForegroundPermissions();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [runningInfo, setRunningInfo] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runDistance, setRunDistance] = useState<number>(0);
  const client= useRef<Client | null>(null);
  const [runningLocation, setRunningLocation] =
    useState<runningLocation | null>(null);
  const [currentCourses, setCurrentCourses] = useState<CourseResponse[] | null>(
    null
  );
  const [runningRecord, setRunningRecord] = useState<runningRecord | null>(
    null
  );
  const [preRunning, setPreRunning] = useState<boolean>(false);
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
        timeInterval: isRunning ? 500 : 3000, // 3초마다 업데이트
        distanceInterval: isRunning ? 1 : 5, // 5m 이동마다 업데이트
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
    if (client.current && !isRunning) {
      if (runningInfo === "" || runningInfo === "finish") {
        client.current.deactivate();
        client.current = null;
      }
    }
  }, [runningInfo, isRunning]);
  useEffect(() => {
    askPermission();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        isRunning,
        setIsRunning,
        runningInfo,
        setRunningInfo,
        myLocation,
        setMyLocation,
        runningLocation,
        setRunningLocation,
        currentCourses,
        setCurrentCourses,
        permissionStatus,
        startLocationTracking,
        stopLocationTracking,
        selectedCourse,
        setSelectedCourse,
        searchedLocation,
        setSearchedLocation,
        isDropdownVisible,
        setIsDropdownVisible,
        runningRecord,
        setRunningRecord,
        preRunning,
        setPreRunning,
        client,
        runDistance,
        setRunDistance,
        runningParticipants,
        setRunningParticipants,
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
