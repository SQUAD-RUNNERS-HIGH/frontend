import { create } from 'zustand';
import { soloRunningRecord, competitorRunningRecord } from '@/app/_types';

type RunningRecord = soloRunningRecord | competitorRunningRecord | null;

interface RunningState {
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;

  runningInfo: string;
  setRunningInfo: (value: string) => void;

  runDistance: number;
  setRunDistance: (value: number) => void;

  runningRecord: RunningRecord;
  setRunningRecord: (record: RunningRecord) => void;

  preRunning: boolean;
  setPreRunning: (value: boolean) => void;
}

export const useRunningStore = create<RunningState>((set) => ({
  isRunning: false,
  setIsRunning: (value) => set({ isRunning: value }),

  runningInfo: '',
  setRunningInfo: (value) => set({ runningInfo: value }),

  runDistance: 0,
  setRunDistance: (value) => set({ runDistance: value }),

  runningRecord: null,
  setRunningRecord: (record) => set({ runningRecord: record }),

  preRunning: false,
  setPreRunning: (value) => set({ preRunning: value }),
}));
