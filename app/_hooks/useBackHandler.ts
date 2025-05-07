import { useEffect, useRef, useCallback, useState } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useLocation } from "./useLocation";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";

export const useBackHandler = ( setSelectedCourse, theme, setTheme) => {
  const [backPressCount, setBackPressCount] = useState(0);
  const timeoutRef = useRef(null);
  const { isRunning, setIsRunning, setRunningInfo } = useRunningStore(
    useShallow((state) => ({
      isRunning: state.isRunning,
      setIsRunning: state.setIsRunning,
      setRunningInfo: state.setRunningInfo,
    }))
  );
  const backPressCases = useCallback(() => {
    if (theme === "info") {
      setSelectedCourse("");
    }
    if (theme !== "info" && !isRunning) {
      setTheme("info");
      setBackPressCount(0); // ✅ useState를 사용하여 변경하면 즉시 반영됨
    }
    if (isRunning) {
      ToastAndroid.show(
        "한 번 더 누르면 러닝이 종료됩니다.",
        ToastAndroid.SHORT
      );
    }
  }, [backPressCount, isRunning, theme, setTheme, setSelectedCourse]);
  
  const onBackPress = useCallback(() => {
    if (isRunning && backPressCount === 1) {
      setRunningInfo('finish')
      setIsRunning(false);
      return true;
    }
    backPressCases();
    setBackPressCount((prev) => prev + 1);
  
    setTimeout(() => setBackPressCount(0), 2000);
  
    return true;
  }, [backPressCases, isRunning, setIsRunning, setSelectedCourse, backPressCount]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onBackPress]);

  return null;
};
