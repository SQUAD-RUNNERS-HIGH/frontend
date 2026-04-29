import { CrewRunningParticipant } from "./../../types/index";
import { useEffect, useRef, useState } from "react";
import { location } from "../../types";
import { convertSpeedToPace } from "../../lib/convertSpeedToPace";
import { useStomp } from "./useStomp";
import { useLocationStore } from "@/store/useLocationStore";
import { useShallow } from "zustand/react/shallow";
import { useRunningStore } from "@/store/useRunningStore";
import { useCourseStore } from "@/store/useCourseStore";
import useInterval from "./useInterval";
import { useStompStore } from "@/store/useStompStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getFilteredRunningDistance,
  hasNewerLocationTimestamp,
} from "@/lib/runningLocationFilter";
export const useCrewRunning = () => {
  const { selectedCourseId, currentCourses } = useCourseStore(
    useShallow((state) => ({
      selectedCourseId: state.selectedCourseId,
      currentCourses: state.currentCourses,
    }))
  );
  const {
    setRunningRecord,
    runningStatus,
    seconds,
    setRunDistance,
    setSeconds,
    crewRunningParticipant,
    setCrewRunningParticipants,
  } = useRunningStore(
    useShallow((state) => ({
      setRunningRecord: state.setRunningRecord,
      runningStatus: state.runningStatus,
      seconds: state.seconds,
      setRunDistance: state.setRunDistance,
      setSeconds: state.setSeconds,
      runDistance: state.runDistance,
      crewRunningParticipant: state.crewRunningParticipants,
      setCrewRunningParticipants: state.setCrewRunningParticipants,
    }))
  );
  const { myLocation, stompLocation } = useLocationStore(
    useShallow((state) => ({
      myLocation: state.myLocation,
      stompLocation: state.stompLocation,
    }))
  );
  const totalDistance = useCourseStore((state) => state.totalDistance);
  const { sendLocation } = useStomp();
  const client = useStompStore((state) => state.client);
  const [speed, setSpeed] = useState<string>("00'00\"");
  const [index, setIndex] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const lastSentTimestamp = useRef(0);

  useEffect(() => {
    if (selectedCourseId) {
      setRunningRecord({
        runningTime: 0,
        progress: [0],
        courseId: selectedCourseId,
      });
    }
  }, []);
  useInterval(
    () => {
      if (myLocation) {
        setSeconds((prev) => prev + 1);
      }
    },
    runningStatus === "go" && myLocation ? 1000 : null
  );
  useInterval(
    () => {
      if (myLocation) {
        setIndex((prev) => prev + 1);
        if (hasNewerLocationTimestamp(lastSentTimestamp.current, myLocation)) {
          lastSentTimestamp.current = myLocation.timestamp;
          sendLocation(myLocation);
        }
        setSpeed(convertSpeedToPace(myLocation?.speed ?? 0));
      }
    },
    runningStatus === "go" && myLocation ? 500 : null
  );

  useEffect(() => {
    if (
      !stompLocation ||
      !("userId" in stompLocation)
    )
      return;

    const { latitude, longitude, userId, username, runningStatus } = stompLocation;

    const prevParticipant = crewRunningParticipant.get(userId);

    let distance = 0;

    if (prevParticipant) {
      const prevDistance = prevParticipant.distance ?? 0;

      distance = getFilteredRunningDistance(
        {
          latitude: prevParticipant.latitude,
          longitude: prevParticipant.longitude,
        },
        {
          latitude,
          longitude,
          accuracy: stompLocation?.accuracy,
          speed: stompLocation?.speed,
        }
      );
      setCrewRunningParticipants(userId, {
        latitude,
        longitude,
        distance:prevDistance+distance,
        userId,
        username,
        runningStatus,
      });
    } else {
      setCrewRunningParticipants(userId, {
        latitude,
        longitude,
        distance,
        userId,
        username,
        runningStatus,        
      });
    }
  }, [stompLocation]);
  // 크루 평균 거리 갱신
  useEffect(() => {
    let sum = 0;
    crewRunningParticipant.forEach((participant,_) => {
      sum += participant.distance;
    })
    setRunDistance(Math.floor(sum/crewRunningParticipant.size));
  }, [crewRunningParticipant]);
  
  return {
    speed,
    text,
    index,
    totalDistance,
  };
};
