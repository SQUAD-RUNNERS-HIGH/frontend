import { ProgressBar } from "react-native-paper";
import { StyleSheet, View, Text, Alert } from "react-native";
import { useLocation } from "@/app/_hooks/useLocation";
import { useCompetitorRunning } from "@/app/_hooks/useCompetitorRunning";
import BlinkingText from "../../BlinkingText";
import RunningInfo from "./RunningInfo";
import ProgressList from "../../ProgressList";
import { RunningText } from "../../RunningText";
import { useEffect, useState } from "react";
const CompetitorRunning = () => {
  const { runningLocation, runningRecord ,runDistance } = useLocation();
  const {
    data,
    speed,
    seconds,
    winning,
    distanceToCompetitor,
    competitorProgress,
    completeCompetitorRecord,
    totalDistance,
  } = useCompetitorRunning();
  
  return (
    <>
      {completeCompetitorRecord &&
      data &&
      runningRecord &&
      runningRecord?.progress.length >= 1 ? (
        <>
          <RunningInfo seconds={seconds} rest={totalDistance - runDistance} speed={speed} />
          <ProgressList
            records={[
              {
                progress: competitorProgress / 100,
                name: data?.competitorUserName,
              },
              {
                progress:
                  runningRecord?.progress[runningRecord?.progress.length - 1],
                name: "나",
              },
            ]}
          />
          {runningLocation?.runningStatus === "ESCAPED" && (
            <BlinkingText vibrate tts>
              코스에서 벗어났습니다.
            </BlinkingText>
          )}
         {
          runningLocation?.runningStatus === "ONGOING" && (
            <RunningText seconds={seconds} distance={distanceToCompetitor} winning={winning} endRunCompetitor = {seconds>=data?.progress.length}/>
          )
         }
        </>
      ) : (
        <></>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  progressBar: {
    height: 16,
    borderRadius: 12,
  },
  statusTextContainer: {
    width: '100%',
    alignItems:'center',
    marginTop:-12,
    marginBottom:-12,
  },
  statusText: {
    fontSize:14,
  }
});
export default CompetitorRunning;
