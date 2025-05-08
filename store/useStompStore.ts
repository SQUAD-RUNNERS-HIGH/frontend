import { Client } from "@stomp/stompjs";
import { create } from "zustand";

// client: Client | null 상태로 보관 → 필요할 때만 구독 컴포넌트가 리렌더
export const useStompStore = create<{
  client: Client | null;
  setClient: (c: Client | null) => void;
}>((set) => ({
  client: null,
  setClient: (c) => set({ client: c }),
}));
