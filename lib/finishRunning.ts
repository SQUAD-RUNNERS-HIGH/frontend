import { useLocationStore } from "@/store/useLocationStore";
import { useRunningStore } from "@/store/useRunningStore"
import { useShallow } from "zustand/react/shallow";

export const finishRunning = () => {
  useRunningStore.getState().setSeconds(0);
  useRunningStore.getState().setRunDistance(0);
  useRunningStore.getState().setRunningRecord(null);
  useLocationStore.getState().setStompLocation(null);
}