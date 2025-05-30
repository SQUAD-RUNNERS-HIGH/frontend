import { CrewRunningParticipant } from "./../../types/index";
import { useEffect, useRef, useState } from "react";
import { getDistance } from "geolib";
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
    setRunDistance,
    runDistance,
    crewRunningParticipant,
    setCrewRunningParticipants,
  } = useRunningStore(
    useShallow((state) => ({
      setRunningRecord: state.setRunningRecord,
      runningStatus: state.runningStatus,
      setRunDistance: state.setRunDistance,
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
  const [seconds, setSeconds] = useState(0);
  const [speed, setSpeed] = useState<string>("00'00\"");
  const [index, setIndex] = useState<number>(0);
  const [text, setText] = useState<string>("");

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
        sendLocation(myLocation);
        setSpeed(convertSpeedToPace(myLocation?.speed));
      }
    },
    runningStatus === "go" && myLocation ? 500 : null
  );

  useEffect(() => {
    if (
      !stompLocation ||
      stompLocation.runningStatus !== "ONGOING" ||
      !("userId" in stompLocation)
    )
      return;

    const { latitude, longitude, userId, username } = stompLocation;

    const prevParticipant = crewRunningParticipant.get(userId);

    let distance = 0;

    if (prevParticipant) {
      const prevDistance = prevParticipant.distance ?? 0;

      distance = getDistance(
        {
          latitude: prevParticipant.latitude,
          longitude: prevParticipant.longitude,
        },
        {
          latitude,
          longitude,
        }
      );
      setCrewRunningParticipants(userId, {
        latitude,
        longitude,
        distance:prevDistance+distance,
        userId,
        username
      });
    } else {
      setCrewRunningParticipants(userId, {
        latitude,
        longitude,
        distance,
        userId,
        username
      });
    }
  }, [stompLocation]);

  return {
    speed,
    seconds,
    text,
    index,
    totalDistance,
  };
};
