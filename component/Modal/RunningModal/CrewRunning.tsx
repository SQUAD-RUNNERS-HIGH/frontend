import { Text } from "react-native";
import BlinkingText from "../../BlinkingText";
import RunningInfo from "./RunningInfo";
import ProgressList from "../../ProgressList";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useCourseStore } from "@/store/useCourseStore";
import { useCrewRunning } from "@/hooks/running/useCrewRunning";
import { useAuthStore } from "@/store/useAuthStore";
import useInterval from "@/hooks/running/useInterval";
import * as Speech from "expo-speech";
const CrewRunning = () => {
  const { crewRunningParticipants, runDistance, seconds } = useRunningStore(
    useShallow((state) => ({
      crewRunningParticipants: state.crewRunningParticipants,
      runDistance: state.runDistance,
      seconds: state.seconds,
    }))
  );
  const userId = useAuthStore((state) => state.userId);
  const stompLocation = useLocationStore((state) => state.stompLocation);
  const totalDistance = useCourseStore((state) => state.totalDistance);
  const { speed, text } = useCrewRunning();
  useInterval(() => {
    if (runDistance > 0 && totalDistance - runDistance >= 0 && crewRunningParticipants.get(userId!)?.runningStatus !== 'ESCAPED') {
      Speech.speak(`현재 평균 ${runDistance} 미터 뛰었습니다.`);
    }
  }, 5000);
  return (
    <>
      <RunningInfo
        seconds={seconds}
        rest={
          totalDistance - runDistance >= 0 ? totalDistance - runDistance : 0
        }
        speed={speed}
      />
      {crewRunningParticipants && (
        <ProgressList
          records={Array.from(crewRunningParticipants.entries()).map(
            ([_, participant]) => {
              return {
                name: participant.username,
                progress:
                  totalDistance > 0 ? participant.distance / totalDistance : 0,
                runningStatus: participant.runningStatus,
              };
            }
          )}
        />
      )}

      {crewRunningParticipants.get(userId!)?.runningStatus === "ESCAPED" && (
        <BlinkingText vibrate tts>
          코스에서 벗어났습니다.
        </BlinkingText>
      )}
      {/* {
          stompLocation?.runningStatus === "ONGOING" && (
            <RunningText seconds={seconds} distance={distanceToCompetitor} winning={winning} endRunCompetitor = {index>=data?.progress.length}/>
          )
         } */}
    </>
  );
};
export default CrewRunning;
