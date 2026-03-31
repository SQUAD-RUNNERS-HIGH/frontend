import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Modal } from "../../../component/Modal";
import { ProtectedRoute } from "@/component/ProtectedRoute";
import { fetchCourses } from "@/lib/map/fetchCourses";
import { useQuery } from "@tanstack/react-query";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useLocationStore } from "@/store/useLocationStore";
import { useShallow } from "zustand/react/shallow";
import { useRunningStore } from "@/store/useRunningStore";
import { useCourseStore } from "@/store/useCourseStore";
import { useMapCamera } from "@/hooks/useMapCamera";
import MapMarkers from "@/component/MapMarkers";
import CourseMarkers from "@/component/CourseMarkers";
import { MapControls } from "@/component/MapControls";

export default function MapViewScreen() {
  const [region, setRegion] = useState<Region>();
  const [isKeyBoardShow, setIsKeyBoardShow] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["courses", region],
    queryFn: () => fetchCourses(region!),
    enabled: !!region,
  });

  useLocationTracking();
  const { mapRef, animateToLocation, fitToCoordinates } = useMapCamera();

  const { myLocation } = useLocationStore(
    useShallow((state) => ({
      myLocation: state.myLocation,
    }))
  );
  const {
    selectedCourseId,
    currentCourses,
    setCurrentCourses,
    setSelectedCourseId,
    setIsDropdownVisible,
  } = useCourseStore(
    useShallow((state) => ({
      selectedCourseId: state.selectedCourseId,
      currentCourses: state.currentCourses,
      setCurrentCourses: state.setCurrentCourses,
      setSelectedCourseId: state.setSelectedCourseId,
      setIsDropdownVisible: state.setIsDropdownVisible,
    }))
  );

  const {
    runningStatus,
    setRunningInfo,
    setRunningStatus,
  } = useRunningStore(
    useShallow((state) => ({
      runningStatus: state.runningStatus,
      setRunningInfo: state.setRunningInfo,
      setRunningStatus: state.setRunningStatus,
    }))
  );
  console.log(process.env.EXPO_PUBLIC_API_URL);
  const isRunning = runningStatus === "go" || runningStatus === "countdown";

  // 키보드 이벤트 처리
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyBoardShow(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyBoardShow(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // 선택된 코스가 없을 때 러닝 상태 초기화
  useEffect(() => {
    if (selectedCourseId === "") {
      setRunningStatus("idle");
    }
  }, [selectedCourseId, setRunningStatus]);

  // 코스 데이터 업데이트
  useEffect(() => {
    if (data) {
      setCurrentCourses(data.courseResponses);
    }
  }, [data, setCurrentCourses]);

  const selectedCourse = currentCourses?.find(
    (course) => course.courseId === selectedCourseId
  );

  const polylineCoordinates =
    selectedCourse?.coordinates?.[0]?.map(([longitude, latitude]) => ({
      latitude,
      longitude,
    })) ?? [];

  const handleMapPress = () => {
    if (selectedCourseId !== "" && region && !isRunning) {
      setSelectedCourseId("");
      mapRef.current?.animateToRegion(region);
    }
    if (!isKeyBoardShow) {
      setIsDropdownVisible(false);
    }
  };

  const handleCoursePress = useCallback((courseId: string, coordinates: number[][]) => {
    const formattedCoordinates = coordinates.map(([lng, lat]) => ({
      latitude: lat,
      longitude: lng,
    }));
    fitToCoordinates(formattedCoordinates);
  }, [fitToCoordinates]);

  const handleSoloRunPress = async () => {
    if (myLocation) {
      await animateToLocation(myLocation);
      setRunningInfo({ mode: "solo" });
      setRunningStatus("prepare");
      setSelectedCourseId("solo");
    }
  };

  const handleLocationPress = async () => {
    if (myLocation) {
      await animateToLocation(myLocation);
    }
  };

  if (!myLocation) return null;

  return (
    <ProtectedRoute isAuthPage={false}>
      <View style={styles.rootContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: myLocation.latitude,
            longitude: myLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onMapReady={() => {
            if (mapRef.current && myLocation) {
              const initialRegion = {
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              };
              mapRef.current.animateToRegion(initialRegion, 0);
              setRegion(initialRegion);
            }
          }}
          onPress={handleMapPress}
          onRegionChangeComplete={(region) => {
            if (selectedCourseId === "") {
              setRegion(region);
            }
          }}
        >
          <MapMarkers isRunning={isRunning} />
          <CourseMarkers onCoursePress={handleCoursePress} />
          
          {/* 선택된 코스의 Polyline */}
          {selectedCourseId !== "" && selectedCourseId !== "solo" && (
            <Polyline
              coordinates={polylineCoordinates}
              strokeColor="#4169E1"
              strokeWidth={4}
            />
          )}
        </MapView>

        <MapControls
          selectedCourseId={selectedCourseId}
          myLocation={myLocation}
          onSoloRunPress={handleSoloRunPress}
          onLocationPress={handleLocationPress}
        />

        <Modal />
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    position: "relative",
  },
  map: {
    flex: 1,
    width: "100%",
    zIndex: 1,
  },
});