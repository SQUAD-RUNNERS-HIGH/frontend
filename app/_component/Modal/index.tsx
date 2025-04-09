import { BackHandler, StyleSheet, ToastAndroid, View } from "react-native";
import React, { useEffect, useState } from "react";
import { InfoModal } from "./InfoModal";
import { SelectedModal } from "./SelectedModal";
import { RunningModal } from "./RunningModal";
import { useLocation } from "../../_hooks/useLocation";
import { useBackHandler } from "@/app/_hooks/useBackHandler";

export function Modal() {
  const [theme, setTheme] = useState<string>("info");
  const { running, selectedCourse, setRunning, setSelectedCourse } =
    useLocation();

  useEffect(() => {
    if (selectedCourse !== "") {
      setTheme("info");
    }
  }, [selectedCourse]);
  useBackHandler(running, setRunning, setSelectedCourse, theme, setTheme);

  return (
    <>
      {selectedCourse !== "" && (
        <View
          style={[
            styles.rootContainer,
            running !== '' && styles.runningModalBackground,
          ]}
        >
          {theme === "running" && running !== '' && (
            <RunningModal setTheme={setTheme} />
          )}
          {theme === "info" && running === '' && <InfoModal setTheme={setTheme} />}
          {theme === "select" && running === '' && (
            <SelectedModal setTheme={setTheme} />
          )}
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  rootContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    gap: 16,
    width: "100%",
    zIndex: 3,
    position: "absolute",
    bottom: 0,
    borderRadius: "12px 12px 0px 0px",
  },
  runningModalBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  container: {
    flexDirection: "row",
    gap: 20,
  },
  imageContainer: {
    flex: 1,
    gap: 12,
  },
  info: {
    color: "#6B7280",
  },
  value: {
    color: "#000000",
    fontWeight: 600,
  },
  background: {
    width: "100%",
    flex: 1,
    backgroundColor: "#D8D8D8",
  },
  textContainer: {
    flex: 1,
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 28,
  },
});
