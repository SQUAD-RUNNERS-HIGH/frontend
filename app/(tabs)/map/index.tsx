import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, Keyboard } from "react-native";
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
import { CourseResponse, location } from "@/app/_types";
import MyLocation from "@/assets/images/svg/Mylocation";
import { fetchCourses } from "./_lib/fetchCourses";
export default function Index() {
  const [location, setLocation] = useState<location>();
  const {
    selectedCourse,
    searchedLocation,
    myLocation,
    running,
    setSelectedCourse,
    setIsDropdownVisible,
    setRunning,
    startLocationTracking,
    stopLocationTracking,
  } = useLocation();
  const mapRef = useRef<MapView>(null);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [isKeyBoardShow, setIsKeyBoardShow] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyBoardShow(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyBoardShow(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  useEffect(() => {
    if (selectedCourse === '') {
      setRunning(false);
    }
  }, [selectedCourse]);
  useEffect(() => {
    if(searchedLocation) {
      mapRef.current?.animateToRegion(searchedLocation);
    }
  },[searchedLocation])
  useEffect(() => {
    async function updateCourses() {
      if (location) {
        const response = await fetchCourses(location);
        setCourses(response.courseResponses);
      }
    }
    updateCourses();
  }, [location]);
  // 러닝 시
  useEffect(() => {
    // 지도 중심을 새로운 위치로 이동
    if (running && myLocation) {
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
  }, [running, myLocation]);

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
                setLocation({latitude:myLocation?.latitude, longitude: myLocation?.longitude})
              }
            }}
            onPress={() => {
              setSelectedCourse('');
              if(isKeyBoardShow) {
                setIsDropdownVisible(false);
              }
            }}
            onRegionChangeComplete={(location) => {
              setLocation({
                latitude: location.latitude,
                longitude: location.longitude,
              });
            }}
          >
            <View style={{ flex: 1 }}>
              <Marker
                coordinate={{
                  latitude: myLocation?.latitude,
                  longitude: myLocation?.longitude,
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
                if(!course) return;
                const courseStart: LatLng = {
                  longitude: course?.coordinates[0][0][0],
                  latitude: course?.coordinates[0][0][1],
                };
                return (
                  <Marker
                    key={index}
                    coordinate={courseStart}
                    style = {{zIndex:3}}
                    onPress={async () => {
                      setSelectedCourse(course.courseId);
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
              {selectedCourse !== '' && (
                <Polyline
                  coordinates={courses?.find(course => course.courseId === selectedCourse).coordinates[0].map(
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
              selectedCourse !== '' && styles.whenModal,
            ]}
          >
            <MyLocation />
          </Pressable>
        )}
        <Modal
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
