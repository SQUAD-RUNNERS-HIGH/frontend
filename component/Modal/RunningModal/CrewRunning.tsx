import { Text } from "react-native";
import BlinkingText from "../../BlinkingText";
import RunningInfo from "./RunningInfo";
import ProgressList from "../../ProgressList";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useCourseStore } from "@/store/useCourseStore";
import { useCrewRunning } from "@/hooks/running/useCrewRunning";
const CrewRunning = () => {
  const { runDistance, crewRunningParticipants } =
    useRunningStore(
      useShallow((state) => ({
        runDistance: state.runDistance,
        crewRunningParticipants: state.crewRunningParticipants,
      }))
    );
  const stompLocation = useLocationStore((state) => state.stompLocation);
  const totalDistance = useCourseStore((state) => state.totalDistance);
  const { speed, seconds, text } = useCrewRunning();
  return (
        <>
          <RunningInfo
            seconds={seconds}
            rest={totalDistance - runDistance}
            speed={speed}
          />
          {crewRunningParticipants && (
            <ProgressList
              records={Array.from(crewRunningParticipants.entries()).map(
                ([userId, participant]) => { 
                  return ({
                  name: userId,
                  progress:
                    totalDistance > 0
                      ? participant.distance / totalDistance
                      : 0,
                }) }
              )}
            />
          )}
          <Text style={{ color: "black" }}>{text}</Text>

          {stompLocation?.runningStatus === "ESCAPED" && (
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
