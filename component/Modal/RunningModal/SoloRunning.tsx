import RunningInfo from "./RunningInfo";
import { useSoloRunning } from "@/hooks/running/useSoloRunning";
import { convertSpeedToPace } from "@/lib/convertSpeedToPace";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";

const SoloRunning = () => {
  const { speed, seconds } = useSoloRunning();
  const runDistance = useRunningStore(state => state.runDistance);
  const myLocation = useLocationStore(state => state.myLocation);
  return (
    <>
      {myLocation && (
        <RunningInfo
          seconds={seconds}
          rest={runDistance}
          speed={speed}
        />
      )}
    </>
  );
};

export default SoloRunning;
