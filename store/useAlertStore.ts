// stores/useAlertStore.ts
import { create } from 'zustand';

type AlertState = {
  visible: boolean;
  title: string;
  description: string;
  onClose?: () => void;
};

type AlertActions = {
  showAlert: (params: Omit<AlertState, 'visible'>) => void;
  hideAlert: () => void;
};

export const useAlertStore = create<AlertState & AlertActions>((set, get) => ({
  visible: true,
  title: '',
  description: '',
  onClose: undefined,

  showAlert: ({ title, description, onClose }) =>
    set({
      visible: true,
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
