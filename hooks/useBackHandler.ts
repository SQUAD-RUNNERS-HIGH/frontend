import { useEffect, useRef, useCallback, useState } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";

export const useBackHandler = ( setSelectedCourseId, theme, setTheme) => {
  const [backPressCount, setBackPressCount] = useState(0);
  const timeoutRef = useRef(null);
  const {runningStatus, setRunningInfo, setRunningStatus } = useRunningStore(
    useShallow((state) => ({
      runningStatus: state.runningStatus,
      setRunningStatus: state.setRunningStatus,
      setRunningInfo: state.setRunningInfo,
    }))
  );
  const backPressCases = useCallback(() => {
    if (theme === "info") {
      setSelectedCourseId("");
    }
    if (theme !== "info" && runningStatus === 'idle') {
      setTheme("info");
      setBackPressCount(0); // ✅ useState를 사용하여 변경하면 즉시 반영됨
    }
    if (runningStatus === 'go') {
      ToastAndroid.show(
        "한 번 더 누르면 러닝이 종료됩니다.",
        ToastAndroid.SHORT
      );
    }
  }, [backPressCount, runningStatus, theme, setTheme, setSelectedCourseId]);
  
  const onBackPress = useCallback(() => {
    if (runningStatus === 'go' && backPressCount === 1) {
      setRunningStatus('finished')
      return true;
    }
    backPressCases();
    setBackPressCount((prev) => prev + 1);
  
    setTimeout(() => setBackPressCount(0), 2000);
  
    return true;
  }, [backPressCases, runningStatus, setRunningStatus, setSelectedCourseId, backPressCount]);

  useEffect(() => {
    const backHanlder = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => {
      backHanlder.remove();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onBackPress]);

  return null;
};
