// components/MapMarkers.tsx
import React, { useRef, useEffect } from "react";
import { Marker, AnimatedRegion } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useRunningStore } from "@/store/useRunningStore";
import { useLocationStore } from "@/store/useLocationStore";
import { useShallow } from "zustand/react/shallow";
import CircleMarker from "@/assets/images/svg/CircleMarker";
import { hexToRgba } from "@/lib/hexToRgba";
import { myMarkerColor } from "@/constants";
import { crewRunningLocation } from "@/types";

interface MapMarkersProps {
  isRunning: boolean;
}

// 1. 크루원에게 할당할 색상 팔레트 정의
const CREW_COLORS = [
  "#1E90FF", // DodgerBlue
  "#FF4500", // OrangeRed
  "#32CD32", // LimeGreen
  "#FFD700", // Gold
  "#FF69B4", // HotPink
  "#00CED1", // DarkTurquoise
];

// userId의 각 문자 코드 값을 더한 후 색상 배열 길이로 나누어 항상 동일한 인덱스를 반환
const getColorIndexByUserId = (userId: string | number): number => {
  const id = String(userId);
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash += id.charCodeAt(i);
  }
  return hash % CREW_COLORS.length;
};

const ANIMATION_DURATION = 2000;

const MyMarker = ({
  location,
  username,
  color,
}: {
  location: { latitude: number; longitude: number };
  username: string;
  color: string;
}) => {
  const animatedCoord = useRef(
    new AnimatedRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  ).current;

  useEffect(() => {
    animatedCoord
      .timing({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      })
      .start();
  }, [location.latitude, location.longitude]);

  return (
    <Marker.Animated
      coordinate={animatedCoord}
      style={{ zIndex: 10, alignItems: "center", justifyContent: "center" }}
    >
      <View style={[styles.bubble, { backgroundColor: hexToRgba(color, 0.6) }]}>
        <Text style={styles.nicknameText}>{username}</Text>
      </View>
      <CircleMarker />
    </Marker.Animated>
  );
};

const CrewMemberMarker = ({
  participant,
}: {
  participant: crewRunningLocation;
}) => {
  const colorIndex = getColorIndexByUserId(participant.userId);
  const crewColor = CREW_COLORS[colorIndex];

  const animatedCoord = useRef(
    new AnimatedRegion({
      latitude: participant.latitude,
      longitude: participant.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  ).current;

  useEffect(() => {
    animatedCoord
      .timing({
        latitude: participant.latitude,
        longitude: participant.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      })
      .start();
  }, [participant.latitude, participant.longitude]);

  return (
    <Marker.Animated coordinate={animatedCoord} style={{ zIndex: 10 }}>
      <View
        style={[
          styles.bubble,
          { backgroundColor: hexToRgba(crewColor, 0.6) },
        ]}
      >
        <Text style={styles.nicknameText}>{participant.username}</Text>
      </View>
      <CircleMarker color={crewColor} />
    </Marker.Animated>
  );
};

const MapMarkers = ({ isRunning }: MapMarkersProps) => {
  const { userId, username } = useAuthStore(
    useShallow((state) => ({ userId: state.userId, username: state.username }))
  );

  const { runningInfo, crewRunningParticipants } = useRunningStore(
    useShallow((state) => ({
      runningInfo: state.runningInfo,
      crewRunningParticipants: state.crewRunningParticipants,
    }))
  );

  const { myLocation, stompLocation } = useLocationStore(
    useShallow((state) => ({
      myLocation: state.myLocation,
      stompLocation: state.stompLocation,
    }))
  );

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

  const restCrewMarkerLocation = Array.from(
    crewRunningParticipants.entries()
  )
    .filter(([id]) => id !== userId)
    .map(([, participant]) => participant);

  const isCrewRunning = isRunning && runningInfo.mode === "crew";

  if (!myLocation) return null;

  const hasValidMyLocation =
    myMarkerLocation.latitude != null && myMarkerLocation.longitude != null;

  return (
    <>
      {/* 내 위치 마커 */}
      {hasValidMyLocation && (
        <MyMarker
          location={{
            latitude: myMarkerLocation.latitude!,
            longitude: myMarkerLocation.longitude!,
          }}
          username={username ?? ""}
          color={myMarkerColor}
        />
      )}

      {/* 크루 러닝 시 다른 참가자들 마커 */}
      {isCrewRunning &&
        restCrewMarkerLocation?.map((participant) => (
          <CrewMemberMarker
            key={participant.userId}
            participant={participant}
          />
        ))}
    </>
  );
};

export default React.memo(MapMarkers);

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  nicknameText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
