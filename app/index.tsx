import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
export default function Index() {
  const coordinates = [
    { latitude: 37.78825, longitude: -122.4324 },
    { latitude: 37.78875, longitude: -122.4358 },
    { latitude: 37.78925, longitude: -122.4382 },
  ];
  return (
    <View style = {styles.rootContainer}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Polyline
          coordinates={coordinates}
          strokeColor="#FF0000" // 빨간색
          strokeWidth={4}
        />
      </MapView>
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
