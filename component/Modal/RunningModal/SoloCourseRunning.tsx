import { useSoloCourseRunning } from "@/hooks/running/useSoloCourseRunning";
import RunningInfo from "./RunningInfo";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import BlinkingText from "@/component/BlinkingText";
import { useCourseStore } from "@/store/useCourseStore";
import { SoloRunningText } from "@/component/SoloRunningText";

const SoloCourseRunning = () => {
  const { speed } = useSoloCourseRunning();
  const runDistance = useRunningStore((state) => state.runDistance);
  const seconds = useRunningStore((state) => state.seconds);
  const stompLocation = useLocationStore((state) => state.stompLocation);
  const totalDistance = useCourseStore((state) => state.totalDistance);

  return (
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
          stompLocation?.runningStatus === "ONGOING" && runDistance>0 && (
            <SoloRunningText />
          )
         }
    </>
  );
};

export default SoloCourseRunning;

