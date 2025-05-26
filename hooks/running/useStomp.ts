import { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { location } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useLocationStore } from "@/store/useLocationStore";
import { useCourseStore } from "@/store/useCourseStore";
import { useStompStore } from "@/store/useStompStore";
import { useAuthStore } from "@/store/useAuthStore";

export function useStomp() {
  const selectedCourseId = useCourseStore((state) => state.selectedCourseId);
  const { client, setClient } = useStompStore(
    useShallow((state) => ({
      client: state.client,
      setClient: state.setClient,
    }))
  );
  const { userId, username } = useAuthStore(
    useShallow((state) => ({
      userId: state.userId,
      username: state.username,
    }))
  );
  const { runningInfo, runningStatus, setRunningParticipants } =
    useRunningStore(
      useShallow((state) => ({
        runningInfo: state.runningInfo,
        runningStatus: state.runningStatus,
        setRunningParticipants: state.setRunningParticipants,
      }))
    );
  const setStompLocation = useLocationStore((state) => state.setStompLocation);
  const [connected, setConnected] = useState(false);

  const handleMessage = useCallback((data) => {
       console.log(data);
    if (runningInfo.mode === "crew" && runningStatus === "prepare") {
      setRunningParticipants(data?.nearByParticipants);
    } else {
   
      setStompLocation((prev) => ({
        ...prev,
        runningStatus: data?.runningStatus,
        latitude: data?.latitude,
        longitude: data?.longitude,
      }));
    }
  }, []);

  useEffect(() => {
    if (!client && runningStatus !== "idle" && runningStatus !== "finished") {
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
  }, [selectedCourseId, handleMessage, runningStatus]);
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
        if (runningInfo.mode === "crew" && runningStatus === "countdown") {
          subscription = client?.subscribe(
            `/topic/crew-run/course/${selectedCourseId}/crew/${runningInfo.id}`,
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
  }, [client, runningInfo, runningStatus, selectedCourseId, handleMessage]);

  const sendLocation = async (location: location, ready=false) => {
    // 러닝
    if (client && client?.connected && runningInfo.mode === "competitor") {
      client.publish({
        destination: `/app/course/${selectedCourseId}`,
        body: JSON.stringify(location),
      });
      return;
    }
    // 크루러닝 준비
    if (
      client &&
      client?.connected &&
      runningInfo.mode === "crew" &&
      runningStatus === "prepare"
    ) {
      console.log("username", username);
      const newBody = {
        userId: Number(userId),
        username,
        latitude: location?.latitude,
        longitude: location?.longitude,
        isReady: ready, // 추가로 받은 ready 사용
      };
      console.log(newBody);

      client.publish({
        destination: `/app/crew-participant/course/${selectedCourseId}/crew/${runningInfo.id}`,
        body: JSON.stringify(newBody),
      });
      return;
    }
    // 크루러닝 시작
    if (
      client &&
      client?.connected &&
      runningInfo.mode === "crew" &&
      runningStatus === "go"
    ) {
      const userId = useAuthStore.getState().userId;

      const newBody = {
        userId: Number(userId),
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
      console.log(newBody);
      client?.publish({
        destination: `/app/crew-run/course/${selectedCourseId}/crew/${runningInfo.id}`,
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
