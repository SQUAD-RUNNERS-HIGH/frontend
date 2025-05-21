import { create } from "zustand";
import { soloRunningRecord, competitorRunningRecord } from "@/types";
import RunningInfo from "@/component/Modal/RunningModal/RunningInfo";

type RunningRecord = soloRunningRecord | competitorRunningRecord | null;

type RunningInfo =
  | { mode: "solo" }
  | { mode: "competitor"; id: string }
  | { mode: "crew"; id: number };

type RunningStatus =
  | "idle"
  | "prepare"
  | "countdown"
  | "go"
  | "paused"
  | "finished";

interface RunningState {
  runningInfo: RunningInfo;
  setRunningInfo: (value: RunningInfo) => void;

  runDistance: number;
  setRunDistance: (value: number | ((prev: number) => number)) => void;

  runningRecord: RunningRecord;
  setRunningRecord: (record: RunningRecord) => void;

  runningStatus: RunningStatus;
  setRunningStatus: (value: RunningStatus) => void;
}

export const useRunningStore = create<RunningState>((set) => ({
  runningInfo: { mode: "solo" },
  setRunningInfo: (value) => set({ runningInfo: value }),

  runDistance: 0,
  setRunDistance: (updater) =>
    set((state) => ({
      runDistance:
        typeof updater === "function" ? updater(state.runDistance) : updater,
    })),
    
  runningRecord: null,
  setRunningRecord: (record) => set({ runningRecord: record }),

  runningStatus: "idle",
  setRunningStatus: (value) => set({ runningStatus: value }),
}));
