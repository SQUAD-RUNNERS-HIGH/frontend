import { ProgressBar } from "react-native-paper";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useLocation } from "@/app/_hooks/useLocation";
import { useCompetitorRunning } from "@/app/_hooks/useCompetitorRunning";
import BlinkingText from "../../BlinkingText";
import RunningInfo from "./RunningInfo";
const CompetitorRunning = () => {
  const { runningLocation, runningRecord } = useLocation();
  const {speed, seconds, winning, distanceToCompetitor, loadingCompetitorRecord} = useCompetitorRunning();
  return (
    <>
      {loadingCompetitorRecord ? (
            <>
              <RunningInfo seconds={seconds} rest={2.5} speed={speed} />
              <ProgressBar
                progress={runningRecord?.progress[-1]}
                color="#6200ee"
                style={styles.progressBar}
              />
          {runningLocation?.runningStatus === "ESCAPED" && (
            <BlinkingText vibrate tts>
              코스에서 벗어났습니다.
            </BlinkingText>
          )}
        </>
      ):(<></>)}
    </>
  );
};
const styles = StyleSheet.create({
  progressBar: {
    height: 16,
    borderRadius: 12,
  },
});
export default CompetitorRunning;
