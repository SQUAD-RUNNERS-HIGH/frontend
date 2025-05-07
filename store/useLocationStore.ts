import { CourseResponse, runningLocation } from "@/app/_types";
import {
  LocationObjectCoords,
  LocationPermissionResponse,
  LocationSubscription,
} from "expo-location";
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { Region } from "react-native-maps/lib/sharedTypes";
import {create} from 'zustand';
interface LocationState {
  myLocation: LocationObjectCoords | null;
  setMyLocation: (loc: LocationObjectCoords | null) => void;

  permissionStatus: LocationPermissionResponse | null;
  setPermissionStatus: (perm: LocationPermissionResponse | null) => void;

  mapLocation: Region | null;
  setMapLocation: (region: Region | null) => void;

  stompLocation: runningLocation | null;
  setStompLocation: (loc: runningLocation | null) => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  // 초기값들
  myLocation: null,
  permissionStatus: null,
  mapLocation: null,
  stompLocation: null,
  participantLocation: {},

  // setters
  setMyLocation: (loc) => set({ myLocation: loc }),
  setPermissionStatus: (perm) => set({ permissionStatus: perm }),
  setMapLocation: (region) => set({ mapLocation: region }),
  setStompLocation: (loc) => set({ stompLocation: loc }),
  // 위치 권한 요청
  askPermission: async () => {
    const { permissionStatus } = get();
    if (!permissionStatus || !permissionStatus.granted) {
      const perm = await Location.requestForegroundPermissionsAsync();
      set({ permissionStatus: perm });
      if (!perm.granted) {
        Alert.alert('위치 권한 필요', '위치 권한을 허용해주세요.');
      }
    }
  }, 
}));