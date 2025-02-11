import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from 'expo-location';


export default function Index() {
  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  // const [coordinates, setCoordinates] = useState([
  //   // 기본 경로 데이터
  //   { latitude: 37.78825, longitude: -122.4324 },
  //   { latitude: 37.78875, longitude: -122.4358 },
  //   { latitude: 37.78925, longitude: -122.4382 },
  // ]);

  const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null); // 위치 구독 객체
  const [permissionStatus, requestPermission] = Location.useForegroundPermissions();

  // 위치 추적 시작
  const startLocationTracking = async () => {
    if (!permissionStatus?.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        return Alert.alert("위치 권한 필요", "위치 권한을 허용해주세요.");
      }
    }

    // 위치 추적 시작
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000, // 1초마다 업데이트
        distanceInterval: 5, // 5m 이동마다 업데이트
      },
      (newLocation) => {
        setLocation(newLocation.coords);
      }
    );
    setSubscription(sub);
  };

  // 위치 추적 중지 (구독 해제)
  const stopLocationTracking = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  useEffect(() => {
    startLocationTracking();
    return () => stopLocationTracking(); // 컴포넌트 언마운트 시 추적 중단
  }, []);

  return (
    <View style = {styles.rootContainer}>
      {location && (
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location?.latitude,
          longitude: location?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* <Polyline
          coordinates={coordinates}
          strokeColor="#FF0000" // 빨간색
          strokeWidth={4}
        /> */}
      </MapView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  rootContainer: {
    width:'100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  map:{
    flex:1,
    width: '100%',
    height: '100%',
  }
})
