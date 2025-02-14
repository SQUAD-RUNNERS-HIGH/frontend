import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Image } from "react-native";
import { coordinates } from "./_constants";
import { Modal } from "./_component/Modal";
import { useLocation } from "./_hooks/useLocation";
export default function Index() {
  const [selectedCourse, setSelectedCourse] = useState<number>(-1);
  const [course, setCourse] = useState<
    { latitude: number; longitude: number }[] | null
  >(null);
  const convertedCoordinates = coordinates.map((a) =>
    a.map(([longitude, latitude]) => ({
      latitude,
      longitude,
    }))
  );
  const {
    location,
    locationDelta,
    startLocationTracking,
    stopLocationTracking,
    
  } = useLocation();
  // 위치 추적 시작
  useEffect(() => {
    startLocationTracking();
    return () => stopLocationTracking();
  }, []);
  return (
    <View style={styles.rootContainer}>
      {location && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            latitudeDelta: locationDelta.latitudeDelta,
            longitudeDelta: locationDelta.longitudeDelta,
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
            {coordinates.map((course, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    longitude: course[0][0],
                    latitude: course[0][1],
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
                coordinates={coordinates[selectedCourse].map(
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

