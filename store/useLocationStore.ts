import { CourseResponse, runningLocation } from "@/types";
import {
  LocationObjectCoords,
  LocationPermissionResponse,
  LocationSubscription,
} from "expo-location";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { Region } from "react-native-maps/lib/sharedTypes";
import { create } from "zustand";
interface LocationState {
  myLocation: LocationObjectCoords | null;
  setMyLocation: (loc: LocationObjectCoords | null) => void;

  permissionStatus: LocationPermissionResponse | null;
  setPermissionStatus: (perm: LocationPermissionResponse | null) => void;

  mapLocation: Region | null;
  setMapLocation: (region: Region | null) => void;

  stompLocation: runningLocation | null;
  setStompLocation: (
    loc: runningLocation | ((prev: runningLocation | null) => runningLocation)
  ) => void;
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
  setStompLocation: (locOrUpdater) =>
    set((state) => ({
      stompLocation:
        typeof locOrUpdater === "function"
          ? locOrUpdater(state.stompLocation)
          : locOrUpdater,
    })),
}));
