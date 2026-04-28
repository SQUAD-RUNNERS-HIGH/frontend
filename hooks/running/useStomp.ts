import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { location, CrewRunningPrepareParticipant } from "@/types";
import { useRunningStore } from "@/store/useRunningStore";
import { useShallow } from "zustand/react/shallow";
import { useLocationStore } from "@/store/useLocationStore";
import { useCourseStore } from "@/store/useCourseStore";
import { useStompStore } from "@/store/useStompStore";
import { useAuthStore } from "@/store/useAuthStore";

type StompMessage = {
  nearByParticipants?: CrewRunningPrepareParticipant[];
  runningStatus?: string;
  latitude?: number;
  longitude?: number;
  userId?: string;
  username?: string;
};

type PendingPublishFrame = {
  destination: string;
  body: string;
};

const MAX_PENDING_LOCATION_FRAMES = 300;

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
  const pendingFrames = useRef<PendingPublishFrame[]>([]);

  const runningMode = runningInfo.mode;
  const runningCrewId = runningInfo.mode === "crew" ? runningInfo.id : undefined;

  const enqueueFrame = useCallback((frame: PendingPublishFrame) => {
    pendingFrames.current = [...pendingFrames.current, frame].slice(
      -MAX_PENDING_LOCATION_FRAMES
    );
  }, []);

  const buildLocationFrame = useCallback(
    (
      nextLocation: location,
      ready = false,
      progress = 0
    ): PendingPublishFrame | null => {
      if (
        runningInfo.mode === "competitor" ||
        runningInfo.mode === "soloCourse"
      ) {
        return {
          destination: `/app/course/${selectedCourseId}`,
          body: JSON.stringify(nextLocation),
        };
      }

      if (runningInfo.mode === "crew" && runningStatus === "prepare") {
        return {
          destination: `/app/crew-participant/course/${selectedCourseId}/crew/${runningInfo.id}`,
          body: JSON.stringify({
            userId: Number(userId),
            username,
            latitude: nextLocation?.latitude,
            longitude: nextLocation?.longitude,
            isReady: ready,
          }),
        };
      }

      if (runningInfo.mode === "crew" && runningStatus === "go") {
        return {
          destination: `/app/crew-run/course/${selectedCourseId}/crew/${runningInfo.id}`,
          body: JSON.stringify({
            userId: Number(userId),
            latitude: nextLocation?.latitude,
            longitude: nextLocation?.longitude,
            username,
            progress,
          }),
        };
      }

      return null;
    },
    [runningInfo, runningStatus, selectedCourseId, userId, username]
  );

  const flushPendingFrames = useCallback(() => {
    if (!client?.connected || pendingFrames.current.length === 0) return;

    const remain: PendingPublishFrame[] = [];

    for (const frame of pendingFrames.current) {
      try {
        client.publish(frame);
      } catch {
        remain.push(frame);
      }
    }

    pendingFrames.current = remain;
  }, [client]);

  const handleMessage = useCallback(
    (data: StompMessage) => {
      if (runningMode === "crew" && runningStatus === "prepare") {
        setCrewRunningPrepareParticipant(data?.nearByParticipants ?? []);
      } else {
        if (
          typeof data?.latitude !== "number" ||
          typeof data?.longitude !== "number" ||
          typeof data?.runningStatus !== "string"
        ) {
          return;
        }

        setStompLocation((prev) => ({
          ...prev,
          runningStatus: data?.runningStatus,
          latitude: data?.latitude,
          longitude: data?.longitude,
          userId: data?.userId,
          username: data?.username,
        } as any));
      }
    },
    [runningMode, runningStatus, setCrewRunningPrepareParticipant, setStompLocation]
  );

  useEffect(() => {
    if (!client && runningStatus !== "idle" && runningStatus !== "finished") {
      const newClient = new Client({
        brokerURL:
          process.env.EXPO_PUBLIC_WS_URL ?? "wss://runners-high.shop/ws-running",
        connectHeaders: {
          Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          CourseId: selectedCourseId,
          CrewId: `${runningMode === "crew" ? `${runningCrewId}` : ""}`,
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
  }, [client, runningCrewId, runningMode, runningStatus, selectedCourseId, setClient]);

  useEffect(() => {
    if (!client) return;

    let subscription: StompSubscription | undefined;

    client.onStompError = (frame) => {
      console.error(
        "[STOMP] Broker reported error:",
        frame.headers["message"]
      );
    };
    client.onConnect = () => {
      console.log("client.current Connected?", client?.connected);
      if (runningMode === "crew" && runningStatus === "countdown") {
        subscription = client?.subscribe(
          `/topic/crew-run/course/${selectedCourseId}/crew/${runningCrewId}`,
          (message: IMessage) => {
            const data = JSON.parse(message.body);
            handleMessage(data);
          }
        );
      } else {
        subscription = client?.subscribe("/user/queue/reply", (message: IMessage) => {
          const data = JSON.parse(message.body);
          handleMessage(data);
        });
      }
      setConnected(true);
      flushPendingFrames();
    };
    client.onDisconnect = () => {
      setConnected(false);
    };
    client.onWebSocketClose = (event: CloseEvent) => {
      setConnected(false);
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
  }, [
    client,
    flushPendingFrames,
    handleMessage,
    runningCrewId,
    runningMode,
    runningStatus,
    selectedCourseId,
  ]);

  useEffect(() => {
    if (connected) {
      flushPendingFrames();
    }
  }, [connected, flushPendingFrames]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        flushPendingFrames();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [flushPendingFrames]);

  const sendLocation = async (
    nextLocation: location,
    ready = false,
    progress = 0
  ) => {
    const frame = buildLocationFrame(nextLocation, ready, progress);
    if (!frame) {
      console.warn("STOMP publish frame not available for current running mode");
      return;
    }

    if (AppState.currentState !== "active" || !client?.connected) {
      enqueueFrame(frame);
      return;
    }

    try {
      client.publish(frame);
    } catch {
      enqueueFrame(frame);
    }
  };

  return {
    sendLocation,
    connected,
  };
}
