import { useCallback, useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { useLocation } from "./useLocation";
import { location } from "@/app/_types";
import * as Sentry from "@sentry/react-native";

export function useStomp() {
  const clientRef = useRef<Client | null>(null);
  const { selectedCourse, setRunningLocation } = useLocation();

  const handleMessage = useCallback((data) => {
    setRunningLocation((prev) => ({
      ...prev,
      runningStatus: data?.runningStatus,
      latitude: data?.latitude,
      longitude: data?.longitude,
    }));
    // setRunningLocation((prev) => ({
    //   ...prev,
    //   status: data?.status,
    //   latitude: prev.latitude + 0.0001,
    //   longitude: prev.longitude + 0.0001,
    // }));
  }, []);
  useEffect(() => {
    const client = new Client({
      brokerURL: "wss://runners-high.shop/running",
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
      heartbeatOutgoing: 10000,
      debug: (str) => console.log(`[STOMP DEBUG] ${str}`),
    });

    client.activate();
    clientRef.current = client;
    client.onStompError = (frame) => {
      Sentry.captureMessage(`stomp failed: ${frame.headers["message"]}`);

      console.error("[STOMP] Broker reported error:", frame.headers["message"]);
    };
    client.onConnect = () => {
      // Sentry.captureMessage("Client Connected?", clientRef.current?.connected); // 여기서 true여야 정상
      console.log("Client Connected?", clientRef.current?.connected); // 여기서 true여야 정상
      // 개인 위치 응답 구독
      client.subscribe("/user/queue/reply", (message: IMessage) => {
        const data: location = JSON.parse(message.body);
        handleMessage(data);
      });
    };
    (client.onDisconnect = () => {
    }),
      (client.onWebSocketClose = (event: CloseEvent) => {
        console.warn("[STOMP] WebSocket closed:", event);
        console.warn("[STOMP] Code:", event.code);
        console.warn("[STOMP] Reason:", event.reason);
        console.warn("[STOMP] WasClean:", event.wasClean);
      });
    client.onWebSocketError = (event) => {
      console.error("[STOMP] WebSsocket error:", event);
      Sentry.captureException(event);
    };

    return () => {
      client.deactivate();
    };
  }, [selectedCourse, handleMessage]);

  const sendLocation = (location: location) => {
    if (clientRef.current && clientRef.current?.connected) {
      clientRef.current.publish({
        destination: `/app/course/${selectedCourse}`,
        body: JSON.stringify(location),
      });
    } else {
      console.warn("STOMP client not connected");
    }
  };

  return {
    sendLocation,
  };
}
