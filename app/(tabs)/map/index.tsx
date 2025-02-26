import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MapView, {
  LatLng,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { Image } from "react-native";
import { Modal } from "../../_component/Modal";
import { useLocation } from "../../_hooks/useLocation";
import { ProtectedRoute } from "@/app/_component/ProtectedRoute";
import { CourseResponse } from "@/app/_types";
import { fetchUserLocation } from "./_lib/fetchUserLocation";
import { LocationObjectCoords } from "expo-location";
import { fetchCourses } from "./_lib/fetchCourses";
import MyLocation from "@/assets/images/svg/Mylocation";

export default function Index() {
  const [selectedCourse, setSelectedCourse] = useState<number>(-1);
  const {
    location,
    locationDelta,
    running,
    setRunning,
    startLocationTracking,
    stopLocationTracking,
  } = useLocation();
  const mapRef = useRef<MapView>(null);
  const prevLocationRef = useRef<LocationObjectCoords | null>(null);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  async function onChangeLoation() {
    if (!location) return;

    const { latitude, longitude } = location;
    const prevLocation = prevLocationRef.current;

    if (
      !prevLocation ||
      prevLocation.latitude !== latitude ||
      prevLocation.longitude !== longitude
    ) {
      await fetchUserLocation({ latitude, longitude });
      const response = await fetchCourses({ latitude, longitude });
      setCourses(response.courseResponses);
    }
    prevLocationRef.current = location; // 현재 location을 저장하여 다음에 비교할 수 있도록 설정
  }
  useEffect(() => {
    if(selectedCourse === -1) {
      setRunning(false);
    }
  },[selectedCourse]);

  // 위치 추적 시작
  useEffect(() => {
    onChangeLoation();
  }, [location, fetchUserLocation]);
  useEffect(() => {
    startLocationTracking();
    return () => {
      stopLocationTracking();
    };
  }, []);
  return (
    <ProtectedRoute isAuthPage={false}>
      <View style={styles.rootContainer}>
        {location && (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
            onLayout={() => {
              if (mapRef.current) {
                mapRef.current.animateToRegion(
                  {
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  },
                  0
                );
              }
            }}
            onPress={() => {
              setSelectedCourse(-1);
            }}
          >
            <View style={{ flex: 1 }}>
              <Marker
                coordinate={{
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                }}
                style={{ zIndex: 3 }}
              >
                <Image
                  width={20}
                  height={20}
                  source={require("@/assets/images/marker.png")}
                />
              </Marker>
              {courses?.map((course, index) => {
                const courseStart: LatLng = {
                  longitude: course?.coordinates[0][0][0],
                  latitude: course?.coordinates[0][0][1],
                };
                return (
                  <Marker
                    key={index}
                    coordinate={courseStart}
                    onPress={() => {
                      setSelectedCourse(index);
                      if (mapRef.current) {
                        const formattedCoordinates = courses[
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
              {selectedCourse !== -1 && (
                <Polyline
                  coordinates={courses[selectedCourse].coordinates[0].map(
                    ([longitude, latitude]) => ({
                      latitude,
                      longitude,
                    })
                  )}
                  strokeColor="#4169E1"
                  strokeWidth={4}
                />
              )}
            </View>
          </MapView>
        )}
        {location && (
          <Pressable
            onPress={() => {
              mapRef.current?.animateToRegion(
                {
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                },
                1000
              );
            }}
            style={[
              styles.locationContainer,
              selectedCourse !== -1 && styles.whenModal,
            ]}
          >
            <MyLocation />
          </Pressable>
        )}
        <Modal
          selectedCourse={selectedCourse}
          selectedId={courses[selectedCourse]?.courseId || ""}
          setSelectedCourse={setSelectedCourse}
        />
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
  whenModal: {
    bottom: 268,
  },
});
