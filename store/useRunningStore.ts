import { create } from "zustand";
import {
  soloRunningRecord,
  competitorRunningRecord,
  CrewRunningPrepareParticipant,
  CrewRunningParticipant,
} from "@/types";
import RunningInfo from "@/component/Modal/RunningModal/RunningInfo";

type RunningRecord = soloRunningRecord | competitorRunningRecord | null;

type RunningInfo =
  | { mode: "solo" }
  | { mode: "competitor"; id: string }
  | { mode: "soloCourse"; id: string }
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

  targetPace : string;
  setTargetPace: (value: string) => void

  seconds: number;
  setSeconds: (value: number | ((prev: number) => number)) => void;

  runningRecord: RunningRecord;
  setRunningRecord: (
    updater:
      | ((prev: RunningRecord | null) => RunningRecord | null)
      | RunningRecord
      | null
  ) => void;

  runningStatus: RunningStatus;
  setRunningStatus: (value: RunningStatus) => void;

  crewRunningPrepareParticipant: CrewRunningPrepareParticipant[];
  setCrewRunningPrepareParticipant: (
    value:
      | CrewRunningPrepareParticipant[]
      | ((
          prev: CrewRunningPrepareParticipant[]
        ) => CrewRunningPrepareParticipant[])
  ) => void;

  crewRunningParticipants: Map<string, CrewRunningParticipant>;
  setCrewRunningParticipants: (
    key: string,
    value: CrewRunningParticipant
  ) => void;
  
}

export const useRunningStore = create<RunningState>((set) => ({
  runningInfo: { mode: "solo" },
  setRunningInfo: (value) => set({ runningInfo: value }),

  seconds: 0,
  setSeconds: (updater) =>
    set((state) => ({
      seconds: typeof updater === "function" ? updater(state.seconds) : updater,
    })),
  
  targetPace: "5'30\"",
  setTargetPace: (value) => set({ targetPace: value }),

  runDistance: 0,
  setRunDistance: (updater) =>
    set((state) => ({
      runDistance:
        typeof updater === "function" ? updater(state.runDistance) : updater,
    })),

  runningRecord: null,
  setRunningRecord: (updater) =>
    set((state) => ({
      runningRecord:
        typeof updater === "function" ? updater(state.runningRecord) : updater,
    })),

  runningStatus: "idle",
  setRunningStatus: (value) => set({ runningStatus: value }),

  crewRunningPrepareParticipant: [],
  setCrewRunningPrepareParticipant: (updater) =>
    set((state) => ({
      crewRunningPrepareParticipant:
        typeof updater === "function"
          ? updater(state.crewRunningPrepareParticipant)
          : updater,
    })),
  crewRunningParticipants: new Map(),
  setCrewRunningParticipants: (key, value) =>
    set((state) => ({
      crewRunningParticipants: new Map(state.crewRunningParticipants).set(
        key,
        value
      ),
    })),
  resetCrewRunningParticipants: () =>
    set(() => ({
      crewRunningParticipants: new Map(),
    })),
}));
