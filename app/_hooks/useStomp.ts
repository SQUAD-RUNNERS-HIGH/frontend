import { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { location } from "@/app/_types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useLocationStore } from "@/store/useLocationStore";
import { useCourseStore } from "@/store/useCourseStore";
import { useStompStore } from "@/store/useStompStore";

export function useStomp() {
  const selectedCourse = useCourseStore((state) => state.selectedCourse);
  const { client, setClient } = useStompStore(
    useShallow((state) => ({
      client: state.client,
      setClient: state.setClient,
    }))
  );
  const { runningInfo, isRunning } = useRunningStore(
    useShallow((state) => ({
      runningInfo: state.runningInfo,
      isRunning: state.isRunning,
    }))
  );
  const setStompLocation = useLocationStore((state) => state.setStompLocation);
  const [connected, setConnected] = useState(false);
  const handleMessage = useCallback((data) => {
    console.log(data);
    console.log("message");
    // if (!isRunning && !isNaN(Number(runningInfo))) {
    //   setRunningParticipants(data?.nearByParticipants);
    // } else {
    setStompLocation((prev) => ({
      ...prev,
      runningStatus: data?.runningStatus,
      latitude: data?.latitude,
      longitude: data?.longitude,
    }));
    // }
    // setRunningLocation((prev) => ({
    //   ...prev,
    //   status: data?.status,
    //   latitude: prev.latitude + 0.0001,
    //   longitude: prev.longitude + 0.0001,
    // }));
  }, []);
  useEffect(() => {
      if (client && !isRunning) {
        if (runningInfo === "" || runningInfo === "finish") {
          client.deactivate();
          setClient(null);
        }
      }
    }, [runningInfo, isRunning]);
  useEffect(() => {
    if (!client && runningInfo !== "" && runningInfo !== "finish") {
      const newClient = new Client({
        brokerURL: "wss://runners-high.shop/running",
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        forceBinaryWSFrames: true,
        appendMissingNULLonIncoming: true,
        heartbeatOutgoing: 10000,
        debug: (str) => console.log(`[STOMP DEBUG] ${str}`),
      });
      setClient(newClient);
    }
  }, [selectedCourse, handleMessage]);
  useEffect(() => {
    if (client) {
      client.activate();
      client.onStompError = (frame) => {
        console.error(
          "[STOMP] Broker reported error:",
          frame.headers["message"]
        );
      };
      client.onConnect = () => {
        console.log("client.current Connected?", client?.connected); // 여기서 true여야 정상
        // 개인 위치 응답 구독
        let subscription;
        if (!isNaN(Number(runningInfo)) && isRunning) {
          subscription = client?.subscribe(
            `/topic/crew-run/course/${selectedCourse}/crew/${runningInfo}`,
            (message: IMessage) => {
              const data = JSON.parse(message.body);
              console.log(data);
              handleMessage(data);
            }
          );
        } else {
          subscription = client?.subscribe(
            "/user/queue/reply",
            (message: IMessage) => {
              console.log("aaaa");
              const data = JSON.parse(message.body);
              handleMessage(data);
            }
          );
        }
        setConnected(true);

        return () => {
          subscription?.unsubscribe(); // 이전 구독 정리
        };
      };
      (client.onDisconnect = () => {}),
        (client.onWebSocketClose = (event: CloseEvent) => {
          console.warn("[STOMP] WebSocket closed:", event);
          console.warn("[STOMP] Code:", event.code);
          console.warn("[STOMP] Reason:", event.reason);
          console.warn("[STOMP] WasClean:", event.wasClean);
        });
      client.onWebSocketError = (event) => {
        console.error("[STOMP] WebSsocket error:", event);
      };
    }
  }, [client, runningInfo, isRunning, selectedCourse, handleMessage]);

  const sendLocation = async (location: location, ready?: boolean) => {
    // 러닝
    if (
      client &&
      client?.connected &&
      isNaN(Number(runningInfo))
    ) {
      client.publish({
        destination: `/app/course/${selectedCourse}`,
        body: JSON.stringify(location),
      });
      return;
    }
    // 크루러닝 준비
    if (
      client &&
      client?.connected &&
      !isNaN(Number(runningInfo)) &&
      !isRunning
    ) {
      const userId = await AsyncStorage.getItem("userId");
      const userName = await AsyncStorage.getItem("userName");

      const newBody = {
        userId: Number(userId),
        userName,
        latitude: location?.latitude,
        longitude: location?.longitude,
        isReady: ready, // 추가로 받은 ready 사용
      };
      client.publish({
        destination: `/app/crew-participant/course/${selectedCourse}/crew/${runningInfo}`,
        body: JSON.stringify(newBody),
      });
      return;
    }
    if (
      client &&
      client?.connected &&
      !isNaN(Number(runningInfo)) &&
      isRunning
    ) {
      const userId = await AsyncStorage.getItem("userId");

      const newBody = {
        userId: Number(userId),
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
      
      client?.publish({
        destination: `/app/crew-run/course/${selectedCourse}/crew/${runningInfo}`,
        body: JSON.stringify(newBody),
      });
      return;
    }
    console.warn("STOMP client.current not connected");
  };

  return {
    sendLocation,
    connected,
  };
}
