import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, Keyboard } from "react-native";
import MapView, {
  LatLng,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { Image } from "react-native";
import { Modal } from "../../../component/Modal";
import { ProtectedRoute } from "@/component/ProtectedRoute";
import MyLocation from "@/assets/images/svg/Mylocation";
import { fetchCourses } from "@/lib/map/fetchCourses";
import { useQuery } from "@tanstack/react-query";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useLocationStore } from "@/store/useLocationStore";
import { useShallow } from "zustand/react/shallow";
import { useRunningStore } from "@/store/useRunningStore";
import { useCourseStore } from "@/store/useCourseStore";
import { useAuthStore } from "@/store/useAuthStore";
import CustomMarker from "@/assets/images/svg/CustomMarker";
export default function Index() {
  const [region, setRegion] = useState<Region>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["courses", region],
    queryFn: () => fetchCourses(region),
    enabled: !!region,
  });
  useLocationTracking();
  const userId = useAuthStore((state) => state.userId);
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
    runningInfo,
    runningStatus,
    crewRunningParticipants,
    setRunningInfo,
    setRunningStatus,
  } = useRunningStore(
    useShallow((state) => ({
      runningInfo: state.runningInfo,
      runningStatus: state.runningStatus,
      crewRunningParticipants: state.crewRunningParticipants,
      setRunningInfo: state.setRunningInfo,
      setRunningStatus: state.setRunningStatus,
    }))
  );

  const { myLocation, stompLocation, mapLocation } = useLocationStore(
    useShallow((state) => ({
      myLocation: state.myLocation,
      stompLocation: state.stompLocation,
      mapLocation: state.mapLocation,
    }))
  );
  const mapRef = useRef<MapView>(null);
  const [isKeyBoardShow, setIsKeyBoardShow] = useState(false);
  const isRunning = runningStatus === "go" || runningStatus === "countdown";
  const myMarkerLocation =
    userId && isRunning && stompLocation
      ? runningInfo.mode === "crew"
        ? {
            latitude: crewRunningParticipants.get(userId)?.latitude,
            longitude: crewRunningParticipants.get(userId)?.longitude,
          }
        : {
            latitude: stompLocation?.latitude,
            longitude: stompLocation?.longitude,
          }
      : { latitude: myLocation?.latitude, longitude: myLocation?.longitude };
const restCrewMarkerLocation = Array.from(crewRunningParticipants.entries())
  .filter(([id, participant]) => id !== userId) // userId는 숫자일 수 있어서 문자열로 변환
  .map(([_, participant]) => participant);  
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
  useEffect(() => {
    if (selectedCourseId === "") {
      setRunningStatus("idle");
    }
  }, [selectedCourseId]);
  useEffect(() => {
    if (mapLocation) {
      mapRef.current?.animateToRegion(mapLocation);
    }
  }, [mapLocation]);

  useEffect(() => {
    if (data) {
      setCurrentCourses(data.courseResponses);
    }
  }, [data]);
  // 러닝 시
  useEffect(() => {
    // 지도 중심을 새로운 위치로 이동

    if (
      isRunning &&
      stompLocation &&
      myLocation &&
      runningInfo.mode !== "solo"
    ) {
      mapRef.current?.animateCamera({
        center: {
          latitude: myMarkerLocation?.latitude!,
          longitude: myMarkerLocation?.longitude!,
        },
        pitch: 60, // 기울기 (0~90도)
        heading: myLocation?.heading, // 방향 (나아가는 방향)
        altitude: myLocation?.altitude, // 고도
        zoom: 19, // 줌 레벨
      });
    }
    if (isRunning && runningInfo.mode === "solo" && myLocation) {
      mapRef.current?.animateCamera({
        center: {
          latitude: myLocation?.latitude,
          longitude: myLocation?.longitude,
        },
        pitch: 60, // 기울기 (0~90도)
        heading: myLocation?.heading, // 방향 (나아가는 방향)
        altitude: myLocation?.altitude, // 고도
        zoom: 18, // 줌 레벨
      });
    }
    if (runningStatus === "finished") {
      mapRef.current?.animateCamera(
        {
          center: {
            longitude: myLocation?.longitude,
            latitude: myLocation?.latitude,
          },
          zoom: 16,
          pitch: 0,
          altitude: myLocation?.altitude,
        },
        { duration: 1000 }
      );
    }
  }, [runningStatus, myLocation, stompLocation]);

  const isCrewRunning = isRunning && runningInfo.mode === "crew";

  const selectedCourse = currentCourses?.find(
    (course) => course.courseId === selectedCourseId
  );

  const polylineCoordinates =
    selectedCourse?.coordinates?.[0]?.map(([longitude, latitude]) => ({
      latitude,
      longitude,
    })) ?? []; // fallback to empty array if not found
  return (
    <ProtectedRoute isAuthPage={false}>
      <View style={styles.rootContainer}>
        {myLocation && (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: myLocation?.latitude,
              longitude: myLocation?.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onMapReady={() => {
              if (mapRef.current) {
                mapRef.current.animateToRegion(
                  {
                    latitude: myLocation?.latitude,
                    longitude: myLocation?.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  },
                  0
                );
                setRegion({
                  latitude: myLocation?.latitude,
                  longitude: myLocation?.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
              }
            }}
            onPress={() => {
              if (selectedCourseId !== "" && region && !isRunning) {
                setSelectedCourseId("");
                mapRef.current?.animateToRegion(region);
              }
              if (!isKeyBoardShow) {
                setIsDropdownVisible(false);
              }
            }}
            onRegionChangeComplete={(region) => {
              if (selectedCourseId === "") {
                setRegion(region);
              }
            }}
          >
            <View style={{ flex: 1 }}>
              {myLocation && (
                <Marker
                  coordinate={{
                    latitude: myMarkerLocation.latitude!,
                    longitude: myMarkerLocation.longitude!,
                  }}
                  style={{ zIndex: 3 }}
                >
                  <Image
                    width={20}
                    height={20}
                    source={require("@/assets/images/marker.png")}
                  />
                </Marker>
              )}
              {isCrewRunning &&
                restCrewMarkerLocation?.map(
                  (participant) => (
                    <Marker
                      key={participant?.userId}
                      coordinate={{
                        latitude: participant?.latitude,
                        longitude: participant?.longitude,
                      }}
                      style={{ zIndex: 3 }}
                    >
                      <Image
                        width={20}
                        height={20}
                        source={require("@/assets/images/crewMarker.png")}
                      />
                    </Marker>
                  )
                )}

              {currentCourses?.map((course, index) => {
                if (!course) return;
                const courseStart: LatLng = {
                  longitude: course?.coordinates[0][0][0],
                  latitude: course?.coordinates[0][0][1],
                };
                return (
                  <Marker
                    key={index}
                    coordinate={courseStart}
                    style={{ zIndex: 3 }}
                    onPress={async () => {
                      setSelectedCourseId(course.courseId);
                      setIsDropdownVisible(false);
                      if (mapRef.current) {
                        const formattedCoordinates = currentCourses[
                          index
                        ].coordinates[0].map(([lng, lat]) => ({
                          latitude: lat,
                          longitude: lng,
                        }));
                        mapRef.current.fitToCoordinates(formattedCoordinates, {
                          edgePadding: {
                            top: 100,
                            right: 50,
                            bottom: 250,
                            left: 50,
                          },
                          animated: true,
                        });
                      }
                    }}
                    pinColor="#8A2BE2"
                  />
                );
              })}
              {/* 선택된 코스의 Polyline 그리기 */}
              {selectedCourseId !== "" && selectedCourseId !== "solo" && (
                <Polyline
                  coordinates={polylineCoordinates}
                  strokeColor="#4169E1"
                  strokeWidth={4}
                />
              )}
            </View>
          </MapView>
        )}
        {myLocation && (
          <Pressable
            onPress={async () => {
              const currentCamera = await mapRef.current?.getCamera();
              if (currentCamera) {
                const { center, zoom, pitch, ...rest } = currentCamera;
                mapRef.current?.animateCamera(
                  {
                    center: {
                      longitude: myLocation?.longitude,
                      latitude: myLocation?.latitude,
                    },
                    zoom: 16,
                    pitch: 0,
                    ...rest,
                  },
                  { duration: 1000 }
                );
              }
              setRunningInfo({ mode: "solo" });
              setRunningStatus("prepare");
              setSelectedCourseId("solo");
            }}
            style={[
              styles.runningContainer,
              selectedCourseId !== "" &&
                selectedCourseId !== "solo" && { display: "none" },
            ]}
          >
            <Image
              source={require("@/assets/images/solo_running.png")}
              style={{ width: 14, height: 14 }}
            />
          </Pressable>
        )}
        {myLocation && (
          <Pressable
            onPress={async () => {
              const currentCamera = await mapRef.current?.getCamera();
              if (currentCamera) {
                const { center, zoom, pitch, ...rest } = currentCamera;
                mapRef.current?.animateCamera(
                  {
                    center: {
                      longitude: myLocation?.longitude,
                      latitude: myLocation?.latitude,
                    },
                    zoom: 16,
                    pitch: 0,
                    ...rest,
                  },
                  { duration: 1000 }
                );
              }
            }}
            style={[
              styles.locationContainer,
              selectedCourseId !== "" && styles.whenModal,
            ]}
          >
            <MyLocation />
          </Pressable>
        )}

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
  locationContainer: {
    backgroundColor: "white",
    zIndex: 2,
    padding: 17,
    position: "absolute",
    bottom: 38,
    right: 17,
  },
  runningContainer: {
    backgroundColor: "white",
    zIndex: 2,
    padding: 17,
    position: "absolute",
    bottom: 38,
    left: 17,
  },
  whenModal: {
    bottom: 268,
  },
});
