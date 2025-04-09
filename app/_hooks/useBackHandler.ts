import { useEffect, useRef, useCallback, useState } from "react";
import { BackHandler, ToastAndroid } from "react-native";

export const useBackHandler = (running, setRunning, setSelectedCourse, theme, setTheme) => {
  const [backPressCount, setBackPressCount] = useState(0);
  const timeoutRef = useRef(null);

  const backPressCases = useCallback(() => {
    if (theme === "info") {
      setSelectedCourse("");
    }
    if (theme !== "info" && running==='') {
      setTheme("info");
      setBackPressCount(0); // ✅ useState를 사용하여 변경하면 즉시 반영됨
    }
    if (running!=='') {
      ToastAndroid.show(
        "한 번 더 누르면 러닝이 종료됩니다.",
        ToastAndroid.SHORT
      );
    }
  }, [backPressCount, running, theme, setTheme, setSelectedCourse]);
  
  const onBackPress = useCallback(() => {
    if (running!=='' && backPressCount === 1) {
      setRunning('');
      setSelectedCourse("");
      return true;
    }
    backPressCases();
    setBackPressCount((prev) => prev + 1);
  
    setTimeout(() => setBackPressCount(0), 2000);
  
    return true;
  }, [backPressCases, running, setRunning, setSelectedCourse, backPressCount]);
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
