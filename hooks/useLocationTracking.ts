import { useEffect, useRef, AppStateStatus } from "react";
import * as Location from "expo-location";
import { AppState } from "react-native";
import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore";
import { useAlertStore } from "@/store/useAlertStore";

export const useLocationTracking = () => {
  const subscription = useRef<Location.LocationSubscription | null>(null);
  const showError = useAlertStore((s) => s.showError);
  const setMyLocation = useLocationStore((s) => s.setMyLocation);
  const runningStatus = useRunningStore((state) => state.runningStatus);
  const isRunning = runningStatus === "go" || runningStatus === "countdown";
  // 권한 요청 로직을 별도의 useEffect로 분리 (컴포넌트 마운트 시 한 번만 실행)
  useEffect(() => {
    const requestPermissions = async () => {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        showError({ title: "위치 권한 필요", description: "앱을 사용하려면 위치 권한을 허용해주세요." });
        return;
      }

      // 러닝 앱이라면 백그라운드 권한도 필수적으로 요청해야 합니다.
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        showError({ title: "백그라운드 위치 권한 필요", description: "러닝 기록을 위해 백그라운드 위치 권한을 '항상 허용'으로 설정해주세요." });
      }
    };

    requestPermissions();
  }, []);

  // 위치 추적 시작/중지 로직
  const startLocationTracking = async () => {
    // 기존 구독이 있다면 중복 실행 방지
    if (subscription.current) {
      stopLocationTracking();
    }

    const accuracy = isRunning ? Location.Accuracy.BestForNavigation : Location.Accuracy.High;
    const timeInterval = isRunning ? 2000 : 3000;
    const distanceInterval = isRunning ? 1 : 5;

    // 백그라운드 추적을 위한 설정 추가
    const sub = await Location.watchPositionAsync(
      { accuracy, timeInterval, distanceInterval },
      (newLocation) => {
        setMyLocation(newLocation.coords);
      }
    );
    subscription.current = sub;
  };

  const stopLocationTracking = () => {
    if (subscription.current) {
      subscription.current.remove();
      subscription.current = null;
    }
  };
  
  // isRunning 상태가 변경될 때마다 추적을 재시작
  useEffect(() => {
    // 권한이 있는지 먼저 확인
    Location.getForegroundPermissionsAsync().then(permission => {
      if (permission.granted) {
        startLocationTracking();
      }
    });

    return () => {
      stopLocationTracking();
    };
  }, [isRunning]); // isRunning이 바뀔 때만 추적 옵션을 바꿔서 재시작

  // AppState 리스너 로직 (백그라운드 추적 고려)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // 앱이 비활성화 되어도, '러닝 중'이라면 추적을 멈추지 않음
      if (nextAppState !== 'active' && !isRunning) {
        stopLocationTracking();
      } 
      // 앱이 활성화 되었을 때, '러닝 중이 아니라면' 다시 추적 시작
      else if (nextAppState === 'active' && !isRunning) {
        startLocationTracking();
      }
    };

    const appStateSubscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      appStateSubscription.remove();
    };
  }, [isRunning]);
};