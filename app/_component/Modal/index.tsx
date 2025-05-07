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
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
export function Modal() {
  const [theme, setTheme] = useState<string>("");
  const {
    selectedCourse,
    setSelectedCourse,
  } = useLocation();
  const {isRunning, runningRecord, preRunning, runningInfo, setPreRunning } = useRunningStore(
    useShallow((state) => ({
      isRunning: state.isRunning,
      runningRecord: state.runningRecord,
      preRunning: state.preRunning,
      setPreRunning: state.setPreRunning,
      runningInfo: state.runningInfo,
    }))
  )
  useEffect(() => {
    if (selectedCourse !== "" && !runningInfo.includes("solo")) {
      setTheme("info");
    }
    if (selectedCourse === "solo" && runningInfo.includes("solo")) {
      setTheme("");
    }
  }, [selectedCourse, runningInfo]);

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
            {theme.includes("select") && !isRunning && (
              <SelectedModal theme = {theme} setTheme={setTheme} />
            )}
            {isRunning && <RunningModal />}
          </View>

          {!isRunning && runningInfo.includes("Finish") && runningRecord && (
            <ResultModal />
          )}
        </>
      )}
      {isRunning && preRunning && (
        <PreRunOverlay
          onFinish={() => {
            setPreRunning(false);
          }}
        />
      )}
      {!isRunning && runningInfo !== "" && !runningInfo.includes("Finish") && (
        <PrepareRunModal />
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
