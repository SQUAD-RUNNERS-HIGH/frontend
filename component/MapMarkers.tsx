// components/MapMarkers.tsx
import React from "react";
import { Marker } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useRunningStore } from "@/store/useRunningStore";
import { useLocationStore } from "@/store/useLocationStore";
import { useShallow } from "zustand/react/shallow";
import CircleMarker from "@/assets/images/svg/CircleMarker";
import { hexToRgba } from "@/lib/hexToRgba";
import { myMarkerColor } from "@/constants";

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

export const MapMarkers = ({ isRunning }: MapMarkersProps) => {
  const { userId, username } = useAuthStore(useShallow((state) => ({ userId: state.userId, username: state.username })));

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

  const myMarkerLocation = userId && isRunning && stompLocation
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
    .filter(([id, participant]) => id !== userId)
    .map(([_, participant]) => participant);

  const isCrewRunning = isRunning && runningInfo.mode === "crew";

  const myNickNameBackground = hexToRgba(myMarkerColor, 0.6);
  if (!myLocation) return null;

  return (
    <>
      {/* 내 위치 마커 */}
      <Marker
        coordinate={{
          latitude: myMarkerLocation.latitude!,
          longitude: myMarkerLocation.longitude!,
        }}
        style={{ zIndex: 10, alignItems: 'center', justifyContent: 'center' }}
      >
        <View style={[styles.bubble, { backgroundColor: myNickNameBackground }]}>
          <Text style={styles.nicknameText}>{username}</Text>
        </View>
        <CircleMarker />
      </Marker>

      {/* 크루 러닝 시 다른 참가자들 마커 */}
      {isCrewRunning &&
        restCrewMarkerLocation?.map((participant) => {
          // 참가자의 userId로 색상 결정
          const colorIndex = getColorIndexByUserId(participant.userId);
          const crewColor = CREW_COLORS[colorIndex];
          const crewNickNameBackground = hexToRgba(crewColor, 0.6);
          return (
            <Marker
              key={participant.userId}
              coordinate={{
                latitude: participant.latitude,
                longitude: participant.longitude,
              }}
              style={{ zIndex: 10 }}
            >
              <View style={[styles.bubble, { backgroundColor: crewNickNameBackground }]}>
                <Text style={styles.nicknameText}>{participant.username}</Text>
              </View>
              <CircleMarker color={crewColor} />
            </Marker>
          );
        })}
    </>
  );
};

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // 반투명 검정 배경
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4, // 마커 아이콘과의 간격
  },
  nicknameText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
})