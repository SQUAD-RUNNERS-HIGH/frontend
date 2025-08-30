// hooks/useMapCamera.ts
import { useRef, useEffect } from "react";
import MapView from "react-native-maps";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";

export const useMapCamera = () => {
  const mapRef = useRef<MapView>(null);
  
  const { myLocation, stompLocation, mapLocation } = useLocationStore(
    useShallow((state) => ({
      myLocation: state.myLocation,
      stompLocation: state.stompLocation,
      mapLocation: state.mapLocation,
    }))
  );

  const { runningStatus, runningInfo } = useRunningStore(
    useShallow((state) => ({
      runningStatus: state.runningStatus,
      runningInfo: state.runningInfo,
    }))
  );

  const isRunning = runningStatus === "go" || runningStatus === "countdown";

  // 맵 위치 변경 효과
  useEffect(() => {
    if (mapLocation) {
      mapRef.current?.animateToRegion(mapLocation);
    }
  }, [mapLocation]);

  // 러닝 중 카메라 애니메이션
  useEffect(() => {
    if (isRunning && stompLocation && myLocation && runningInfo.mode !== "solo") {
      mapRef.current?.animateCamera({
        center: {
          latitude: stompLocation.latitude,
          longitude: stompLocation.longitude,
        },
        pitch: 60,
        heading: myLocation.heading,
        altitude: myLocation.altitude,
        zoom: 19,
      });
    }

    if (isRunning && runningInfo.mode === "solo" && myLocation) {
      mapRef.current?.animateCamera({
        center: {
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
        },
        pitch: 60,
        heading: myLocation.heading,
        altitude: myLocation.altitude,
        zoom: 18,
      });
    }

    if (runningStatus === "finished" && myLocation) {
      mapRef.current?.animateCamera(
        {
          center: {
            longitude: myLocation.longitude,
            latitude: myLocation.latitude,
          },
          zoom: 16,
          pitch: 0,
          altitude: myLocation.altitude,
        },
        { duration: 1000 }
      );
    }
  }, [runningStatus, myLocation, stompLocation, runningInfo.mode, isRunning]);

  const animateToLocation = async (location: { latitude: number; longitude: number }) => {
    const currentCamera = await mapRef.current?.getCamera();
    if (currentCamera && location) {
      const { center, zoom, pitch, ...rest } = currentCamera;
      mapRef.current?.animateCamera(
        {
          center: {
            longitude: location.longitude,
            latitude: location.latitude,
          },
          zoom: 16,
          pitch: 0,
          ...rest,
        },
        { duration: 1000 }
      );
    }
  };

  const fitToCoordinates = (coordinates: Array<{ latitude: number; longitude: number }>) => {
    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 100,
        right: 50,
        bottom: 250,
        left: 50,
      },
      animated: true,
    });
  };

  return {
    mapRef,
    animateToLocation,
    fitToCoordinates,
  };
};