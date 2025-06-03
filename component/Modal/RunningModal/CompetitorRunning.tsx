import { StyleSheet, Text } from "react-native";
import { useCompetitorRunning } from "@/hooks/running/useCompetitorRunning";
import BlinkingText from "../../BlinkingText";
import RunningInfo from "./RunningInfo";
import ProgressList from "../../ProgressList";
import { RunningText } from "../../RunningText";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
const CompetitorRunning = () => {
  const { runningRecord, runDistance, seconds } = useRunningStore(
    useShallow((state) => ({
      runningRecord: state.runningRecord,
      runDistance: state.runDistance,
      seconds: state.seconds,
    }))
  );  
  const stompLocation = useLocationStore(state => state.stompLocation);
  const {
    data,
    speed,
    index,
    winning,
    text,
    distanceToCompetitor,
    competitorProgress,
    totalDistance,
  } = useCompetitorRunning();
  return (
    <>
      {
      data &&
      runningRecord &&
      runningRecord?.progress.length >= 1 ? (
        <>
          <RunningInfo seconds={seconds} rest={totalDistance - runDistance} speed={speed} />
          <ProgressList
            records={[
              {
                progress: data?.progress.length <=index? 1: competitorProgress,
                name: data?.competitorUserName,
              },
              {
                progress:
                  runningRecord?.progress[runningRecord?.progress.length - 1],
                name: "나",
              },
            ]}
          />
          <Text style = {{color: 'black'}}>{text}</Text>
                    

          {stompLocation?.runningStatus === "ESCAPED" && (
            <BlinkingText vibrate tts>
              코스에서 벗어났습니다.
            </BlinkingText>
          )}
         {
          stompLocation?.runningStatus === "ONGOING" && (
            <RunningText seconds={seconds} distance={distanceToCompetitor} winning={winning} endRunCompetitor = {index>=data?.progress.length}/>
          )
         }
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default CompetitorRunning;
