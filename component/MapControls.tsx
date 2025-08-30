import React from "react";
import { Pressable, Image, StyleSheet } from "react-native";
import MyLocation from "@/assets/images/svg/Mylocation";

interface MapControlsProps {
  selectedCourseId: string;
  myLocation: { latitude: number; longitude: number } | null;
  onSoloRunPress: () => void;
  onLocationPress: () => void;
}

export const MapControls = ({
  selectedCourseId,
  myLocation,
  onSoloRunPress,
  onLocationPress,
}: MapControlsProps) => {
  if (!myLocation) return null;

  return (
    <>
      {/* 솔로 러닝 버튼 */}
      <Pressable
        onPress={onSoloRunPress}
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

      {/* 내 위치로 이동 버튼 */}
      <Pressable
        onPress={onLocationPress}
        style={[
          styles.locationContainer,
          selectedCourseId !== "" && styles.whenModal,
        ]}
      >
        <MyLocation />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
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