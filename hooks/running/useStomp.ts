import { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { location, CrewRunningPrepareParticipant } from "@/types";

type StompMessage = {
  nearByParticipants?: CrewRunningPrepareParticipant[];
  runningStatus?: string;
  latitude?: number;
  longitude?: number;
  userId?: string;
  username?: string;
};
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
  const { runningInfo, runningStatus, setCrewRunningPrepareParticipant } =
    useRunningStore(
      useShallow((state) => ({
        runningInfo: state.runningInfo,
        runningStatus: state.runningStatus,
        setCrewRunningPrepareParticipant:
          state.setCrewRunningPrepareParticipant,
      }))
    );
  const setStompLocation = useLocationStore((state) => state.setStompLocation);
  const [connected, setConnected] = useState(false);

  const runningMode = runningInfo.mode;
  const runningCrewId = runningInfo.mode === "crew" ? runningInfo.id : undefined;

  const handleMessage = useCallback((data: StompMessage) => {
    if (runningMode === "crew" && runningStatus === "prepare") {
      setCrewRunningPrepareParticipant(data?.nearByParticipants);
    } else {
      setStompLocation((prev) => ({
        ...prev,
        runningStatus: data?.runningStatus,
        latitude: data?.latitude,
        longitude: data?.longitude,
        userId: data?.userId,
        username: data?.username,
      }));
    }
  }, [runningMode, runningStatus]);
  useEffect(() => {

    if (!client && runningStatus !== "idle" && runningStatus !== "finished") {
      const newClient = new Client({
        brokerURL: process.env.EXPO_PUBLIC_WS_URL ?? "wss://runners-high.shop/ws-running",
        connectHeaders: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          CourseId: selectedCourseId,
          CrewId:  `${runningMode === "crew" ? `${runningCrewId}` : ""}`,
          CrewRun: `${runningMode === "crew" ? "True" : "False"}`,
        },
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
    if (!client) return;

    let subscription;

    client.onStompError = (frame) => {
      console.error(
        "[STOMP] Broker reported error:",
        frame.headers["message"]
      );
    };
    client.onConnect = () => {
      console.log("client.current Connected?", client?.connected); // 여기서 true여야 정상
      // 개인 위치 응답 구독
      if (runningMode === "crew" && runningStatus === "countdown") {
        subscription = client?.subscribe(
          `/topic/crew-run/course/${selectedCourseId}/crew/${runningCrewId}`,
          (message: IMessage) => {
            const data = JSON.parse(message.body);
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
    };
    client.onDisconnect = () => {};
    client.onWebSocketClose = (event: CloseEvent) => {
      console.warn("[STOMP] WebSocket closed:", event);
      console.warn("[STOMP] Code:", event.code);
      console.warn("[STOMP] Reason:", event.reason);
      console.warn("[STOMP] WasClean:", event.wasClean);
    };
    client.onWebSocketError = (event) => {
      console.error("[STOMP] WebSsocket error:", event);
    };

    client.activate();

    return () => {
      subscription?.unsubscribe();
      client.deactivate();
      setConnected(false);
    };
  }, [client, runningMode, runningCrewId, runningStatus, selectedCourseId, handleMessage]);

  const sendLocation = async (
    location: location,
    ready = false,
    progress = 0
  ) => {
    // 러닝
    if (
      client &&
      client?.connected &&
      (runningInfo.mode === "competitor" || runningInfo.mode === "soloCourse")
    ) {
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
      const newBody = {
        userId: Number(userId),
        username,
        latitude: location?.latitude,
        longitude: location?.longitude,
        isReady: ready, // 추가로 받은 ready 사용
      };
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
      const newBody = {
        userId: Number(userId),
        latitude: location?.latitude,
        longitude: location?.longitude,
        username: username,
        progress,
      };
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
