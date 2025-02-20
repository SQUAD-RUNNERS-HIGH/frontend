import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Image } from "react-native";
import { coordinates } from "../../_constants";
import { Modal } from "../../_component/Modal";
import { useLocation } from "../../_hooks/useLocation";
import { ProtectedRoute } from "@/app/_component/ProtectedRoute";
import { CourseResponse, CourseResponses, location } from "@/app/_types";
import { fetchUserLocation } from "./_lib/fetchUserLocation";
import { LocationObjectCoords } from "expo-location";
import { fetchCourses } from "./_lib/fetchCourses";

export default function Index() {
  const [selectedCourse, setSelectedCourse] = useState<number>(-1);
  const {
    location,
    locationDelta,
    startLocationTracking,
    stopLocationTracking,
  } = useLocation();
  const prevLocationRef = useRef<LocationObjectCoords | null>(null);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  async function onChangeLoation(){
    if (!location) return;

    const { latitude, longitude } = location;
    const prevLocation = prevLocationRef.current;

    if (!prevLocation || prevLocation.latitude !== latitude || prevLocation.longitude !== longitude) {
      await fetchUserLocation({ latitude, longitude });
      const response = await fetchCourses({latitude,longitude});
      setCourses(response.courseResponses);
    }

    prevLocationRef.current = location; // 현재 location을 저장하여 다음에 비교할 수 있도록 설정
  }
  // 위치 추적 시작
  useEffect(() => {
    onChangeLoation();
  }, [location, fetchUserLocation]);

  useEffect(() => {
    startLocationTracking();
    return () =>{
      stopLocationTracking();
    }
  },[])
  return (
    <ProtectedRoute isAuthPage={false}>
      <View style={styles.rootContainer}>
        {location && (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location?.latitude,
              longitude: location?.longitude,
              latitudeDelta: locationDelta?.latitudeDelta || 0.02,
              longitudeDelta: locationDelta?.longitudeDelta || 0.02,
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
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      longitude: course.coordinates[0][0][0],
                      latitude: course.coordinates[0][0][1],
                    }}
                    onPress={() => {
                      setSelectedCourse(index);
                    }}
                    title={`코스 ${index + 1}`}
                    description={`코스 ${index + 1} 상세보기`}
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
        <Modal
          selectedCourse={selectedCourse}
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
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  map: {
    flex: 1,
    width: "100%",
    zIndex: 1,
  },
});
function startRunning() {
  throw new Error("Function not implemented.");
}
