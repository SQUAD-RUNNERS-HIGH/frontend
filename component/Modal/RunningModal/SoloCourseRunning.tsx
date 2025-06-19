import { useSoloCourseRunning } from "@/hooks/running/useSoloCourseRunning";
import RunningInfo from "./RunningInfo";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import BlinkingText from "@/component/BlinkingText";
import { useCourseStore } from "@/store/useCourseStore";
import { SoloRunningText } from "@/component/SoloRunningText";
import ProgressList from "@/component/ProgressList";
import { useShallow } from "zustand/react/shallow";

const SoloCourseRunning = () => {
  const { speed } = useSoloCourseRunning();
  const {runningRecord, seconds, runDistance} = useRunningStore(
      useShallow((state) => ({
        runningRecord: state.runningRecord,
        seconds: state.seconds,
        runDistance: state.runDistance,
      }))
    );
  const stompLocation = useLocationStore((state) => state.stompLocation);
  const totalDistance = useCourseStore((state) => state.totalDistance);
    console.log(stompLocation);

;  return (
    <>
      {stompLocation && (
        <RunningInfo seconds={seconds} rest={totalDistance - runDistance} speed={speed} />
      )}
       {stompLocation?.runningStatus === "ESCAPED" && (
            <BlinkingText vibrate tts>
              코스에서 벗어났습니다.
            </BlinkingText>
          )}
         {
          <ProgressList
            records={[
              {
                progress:
                  runningRecord?.progress[runningRecord?.progress.length - 1],
                name: "나",
              },
            ]}
          />   
         }
    </>
  );
};

export default SoloCourseRunning;

