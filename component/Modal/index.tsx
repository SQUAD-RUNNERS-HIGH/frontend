import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { InfoModal } from "./InfoModal";
import { SelectedModal } from "./SelectedModal";
import { useBackHandler } from "@/hooks/useBackHandler";
import { RunningModal } from "./RunningModal";
import { PreRunOverlay } from "../PreRunOverlay";
import PrepareRunModal from "./PrepareRunModal";
import ResultModal from "./ResultModal";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useCourseStore } from "@/store/useCourseStore";
export function Modal() {
  const [theme, setTheme] = useState<string>("");
  const { selectedCourseId, setSelectedCourseId } = useCourseStore(
    useShallow((state) => ({
      selectedCourseId: state.selectedCourseId,
      setSelectedCourseId: state.setSelectedCourseId,
    }))
  );
  const {
  runningStatus,
  runningRecord,
  runningInfo,
  setRunningStatus,
} = useRunningStore(
  useShallow((state) => ({
    runningStatus: state.runningStatus,
    runningRecord: state.runningRecord,
    runningInfo: state.runningInfo,
    setRunningStatus: state.setRunningStatus,
  }))
);
  useEffect(() => {
    if (selectedCourseId !== "" && runningStatus !== 'go') {
      setTheme("info");
    }
    if (selectedCourseId === "solo" && runningInfo.mode === "solo" && runningStatus === 'go') {
      setTheme("");
    }
  }, [selectedCourseId, runningInfo]);
  const isRunning = runningStatus === 'go' || runningStatus === 'countdown';
  useBackHandler(setSelectedCourseId, theme, setTheme);
  return (
    <>
      {selectedCourseId !== "" && (
        <>
          <View
            style={[
              styles.rootContainer,
              runningStatus === 'go' && styles.runningModalBackground,
            ]}
          >
            {theme === "info" && runningStatus === 'idle' && !isRunning && (
              <InfoModal setTheme={setTheme} />
            )}
            {theme.includes("select") && !isRunning && (
              <SelectedModal theme={theme} setTheme={setTheme} />
            )}
            {isRunning && <RunningModal />}
          </View>

          {runningStatus === 'prepare' && runningInfo.mode && (
            <PrepareRunModal />
          )}

          {runningStatus === 'countdown' && (
            <PreRunOverlay
              onFinish={() => {
                setRunningStatus('go');
              }}
            />
          )}
          {runningStatus === 'finished' && runningRecord && <ResultModal />}
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
