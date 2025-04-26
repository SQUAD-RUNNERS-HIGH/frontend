import { BackHandler, StyleSheet, ToastAndroid, View } from "react-native";
import React, { useEffect, useState } from "react";
import { InfoModal } from "./InfoModal";
import { SelectedModal } from "./SelectedModal";
import { useLocation } from "../../_hooks/useLocation";
import { useBackHandler } from "@/app/_hooks/useBackHandler";
import { RunningModal } from "./RunningModal";
import { PreRunOverlay } from "../PreRunOverlay";
import PrepareRunModal from "./PrepareRunModal";
import ResultModal from "./ResultModal";
export function Modal() {
  const [theme, setTheme] = useState<string>("info");
  const {
    isRunning,
    selectedCourse,
    runningRecord,
    setSelectedCourse,
    preRunning,
    client,
    setPreRunning,
    runningInfo,
  } = useLocation();

  useEffect(() => {
    if (selectedCourse !== "") {
      setTheme("info");
    }
  }, [selectedCourse]);

  useBackHandler(setSelectedCourse, theme, setTheme);
  return (
    <>
      {selectedCourse !== "" && (
        <>
          <View
            style={[
              styles.rootContainer,
              isRunning && styles.runningModalBackground,
            ]}
          >
            {theme === "info" && !isRunning && (
              <InfoModal setTheme={setTheme} />
            )}
            {theme === "select" && !isRunning && (
              <SelectedModal setTheme={setTheme} />
            )}
            {isRunning && <RunningModal />}
          </View>
          {isRunning && preRunning && (
            <PreRunOverlay
              onFinish={() => {
                setPreRunning(false);
              }}
            />
          )}
          {!isRunning && runningInfo !== "" && !runningInfo.includes('Finish') && (
            <PrepareRunModal />
          )}
          {!isRunning &&
            runningInfo.includes("Finish") &&
            runningRecord && <ResultModal />}
        </>
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
