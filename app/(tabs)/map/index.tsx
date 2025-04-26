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
import { Modal } from "../../_component/Modal";
import { useLocation } from "../../_hooks/useLocation";
import { ProtectedRoute } from "@/app/_component/ProtectedRoute";
import { CourseResponse } from "@/app/_types";
import MyLocation from "@/assets/images/svg/Mylocation";
import { fetchCourses } from "./_lib/fetchCourses";
import RunningInfo from "@/app/_component/Modal/RunningModal/RunningInfo";
export default function Index() {
  const [region, setRegion] = useState<Region>();
  const {
    selectedCourse,
    currentCourses,
    setCurrentCourses,
    searchedLocation,
    myLocation,
    runningInfo,
    runningLocation,
    setRunningInfo,
    isRunning,
    setSelectedCourse,
    setIsDropdownVisible,
    setIsRunning,
    startLocationTracking,
    stopLocationTracking,
  } = useLocation();
  const mapRef = useRef<MapView>(null);
  const [isKeyBoardShow, setIsKeyBoardShow] = useState(false);
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
    if (selectedCourse === "") {
      setIsRunning(false);
    }
  }, [selectedCourse]);
  useEffect(() => {
    if (searchedLocation) {
      mapRef.current?.animateToRegion(searchedLocation);
    }
  }, [searchedLocation]);
  useEffect(() => {
    async function updateCourses() {
      if (region) {
        const response = await fetchCourses(region);
        setCurrentCourses(response.courseResponses);
      }
    }
    updateCourses();
  }, [region]);
  // 러닝 시
  useEffect(() => {
    // 지도 중심을 새로운 위치로 이동
    if (isRunning && runningLocation&&myLocation) {
      mapRef.current?.animateCamera({
        center: {
          latitude: runningLocation?.latitude,
          longitude: runningLocation?.longitude,
        },
        pitch: 0, // 기울기 (0~90도)
        heading: runningLocation?.heading, // 방향 (나아가는 방향)
        altitude: runningLocation?.altitude, // 고도
        zoom: 18, // 줌 레벨
      });
    }
    if (isRunning && !runningLocation&& myLocation) {
      mapRef.current?.animateCamera({
        center: {
          latitude: myLocation?.latitude,
          longitude: myLocation?.longitude,
        },
        pitch: 0, // 기울기 (0~90도)
        heading: myLocation?.heading, // 방향 (나아가는 방향)
        altitude: myLocation?.altitude, // 고도
        zoom: 18, // 줌 레벨
      });
    }
  }, [isRunning, myLocation, runningLocation]);

  // 위치 추적 시작
  useEffect(() => {
    startLocationTracking();
    return () => {
      stopLocationTracking();
    };
  }, []);
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
              if (selectedCourse !== "" && region && !isRunning) {
                setSelectedCourse("");
                mapRef.current?.animateToRegion(region);
              }
              if (!isKeyBoardShow) {
                setIsDropdownVisible(false);
              }
            }}
            onRegionChangeComplete={(region) => {
              if (selectedCourse === "") {
                setRegion(region);
              }
            }}
          >
            <View style={{ flex: 1 }}>
              <Marker
                coordinate={{
                  latitude:
                    (isRunning && runningLocation)
                      ? runningLocation?.latitude
                      : myLocation?.latitude,
                  longitude:
                    (isRunning && runningLocation)
                      ? runningLocation?.longitude
                      : myLocation?.longitude,
                }}
                style={{ zIndex: 3 }}
              >
                <Image
                  width={20}
                  height={20}
                  source={require("@/assets/images/marker.png")}
                />
              </Marker>
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
                      setSelectedCourse(course.courseId);
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
              {selectedCourse !== "" && selectedCourse !=='solo' && runningInfo !== 'solo' && (
                <Polyline
                  coordinates={currentCourses
                    ?.find((course) => course.courseId === selectedCourse)
                    .coordinates[0].map(([longitude, latitude]) => ({
                      latitude,
                      longitude,
                    }))}
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
                const { center, zoom, ...rest } = currentCamera;
                mapRef.current?.animateCamera(
                  {
                    center: {
                      longitude: myLocation?.longitude,
                      latitude: myLocation?.latitude,
                    },
                    zoom,
                    ...rest,
                  },
                  { duration: 1000 }
                );
              }
              setRunningInfo('solo');
              setSelectedCourse('solo');
            }}
            style={[
              styles.runningContainer,
              selectedCourse !== "" && selectedCourse !== 'solo' && {display:'none'},
            ]}
          >
            <Image
      source={require('@/assets/images/solo_running.png')}
      style={{ width: 14, height: 14 }}
    />
          </Pressable>
        )}
        {myLocation && (
          <Pressable
            onPress={async () => {
              const currentCamera = await mapRef.current?.getCamera();
              if (currentCamera) {
                const { center, zoom, ...rest } = currentCamera;
                mapRef.current?.animateCamera(
                  {
                    center: {
                      longitude: myLocation?.longitude,
                      latitude: myLocation?.latitude,
                    },
                    zoom,
                    ...rest,
                  },
                  { duration: 1000 }
                );
              }
            }}
            style={[
              styles.locationContainer,
              selectedCourse !== "" && styles.whenModal,
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
