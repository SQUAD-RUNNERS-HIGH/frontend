import RunningInfo from "./RunningInfo";
import { useSoloRunning } from "@/app/_hooks/useSoloRunning";
import { useLocation } from "@/app/_hooks/useLocation";
import MyLocation from "@/assets/images/svg/Mylocation";
import { convertSpeedToPace } from "@/app/_lib/convertSpeedToPace";

const SoloRunning = () => {
  const { speed, seconds } = useSoloRunning();
  const { runDistance, myLocation } = useLocation();
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
