import { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { useLocation } from "./useLocation";
import { location } from "@/app/_types";
import * as Sentry from "@sentry/react-native";

export function useStomp() {
  const { client, selectedCourse, setRunningLocation, runningInfo } =
    useLocation();
  const [connected, setConnected] = useState(false);
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
    if (!client.current && runningInfo !== "" && runningInfo !== "finish") {
      const newClient = new Client({
        brokerURL: "wss://runners-high.shop/running",
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        forceBinaryWSFrames: true,
        appendMissingNULLonIncoming: true,
        heartbeatOutgoing: 10000,
        debug: (str) => console.log(`[STOMP DEBUG] ${str}`),
      });
      client.current = newClient;
    }
  }, [selectedCourse, handleMessage]);
  useEffect(() => {
    if (client.current) {
      client.current.activate();
      client.current.onStompError = (frame) => {
        Sentry.captureMessage(`stomp failed: ${frame.headers["message"]}`);

        console.error(
          "[STOMP] Broker reported error:",
          frame.headers["message"]
        );
      };
      client.current.onConnect = () => {
        // Sentry.captureMessage("client.current Connected?", clientRef.current?.connected); // 여기서 true여야 정상
        console.log("client.current Connected?", client.current?.connected); // 여기서 true여야 정상
        // 개인 위치 응답 구독
        client.current?.subscribe("/user/queue/reply", (message: IMessage) => {
          const data: location = JSON.parse(message.body);
          handleMessage(data);
        });
        setConnected(true);
      };
      (client.current.onDisconnect = () => {}),
        (client.current.onWebSocketClose = (event: CloseEvent) => {
          console.warn("[STOMP] WebSocket closed:", event);
          console.warn("[STOMP] Code:", event.code);
          console.warn("[STOMP] Reason:", event.reason);
          console.warn("[STOMP] WasClean:", event.wasClean);
        });
      client.current.onWebSocketError = (event) => {
        console.error("[STOMP] WebSsocket error:", event);
        Sentry.captureException(event);
      };
    }
  }, [client.current]);

  const sendLocation = (location: location) => {
    if (client.current && client.current?.connected) {
      client.current.publish({
        destination: `/app/course/${selectedCourse}`,
        body: JSON.stringify(location),
      });
    } else {
      console.warn("STOMP client.current not connected");
    }
  };

  return {
    sendLocation,
    connected,
  };
}
