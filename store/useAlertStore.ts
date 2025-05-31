// stores/useAlertStore.ts
import { create } from "zustand";

type AlertState = {
  visible: boolean;
  title: string;
  description: string;
  theme: "Alert" | "Error";
  onClose?: () => void;
};

type AlertActions = {
  // Omit<type, key> key제외한 type
  showAlert: (params: Omit<AlertState, "visible" | "theme">) => void;
  showError: (params: Omit<AlertState, "visible" | "theme">) => void;
  hideAlert: () => void;
};

export const useAlertStore = create<AlertState & AlertActions>((set, get) => ({
  visible: false,
  title: "",
  description: "",
  onClose: undefined,
  theme: "Alert",
  showAlert: ({ title, description, onClose }) =>
    set({
      visible: true,
      theme: "Alert",
      title,
      description,
      onClose,
    }),
  showError: ({ title, description, onClose }) =>
    set({
      visible: true,
      theme: "Alert",
      title,
      description,
      onClose,
    }),
  hideAlert: () => {
    const { onClose } = get();
    set({ visible: false });
    if (onClose) onClose();
  },
}));
