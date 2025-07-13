// useLayoutStore.ts
import { create } from 'zustand';
import { Dimensions } from 'react-native';

interface LayoutState {
  isSmall: boolean;
  setIsSmall: (recordsLength: number) => void;
}
const SMALL_HEIGHT = 725;
const getInitialIsSmall = () => {
  const { height } = Dimensions.get('window');
  return height < SMALL_HEIGHT;
};

export const useLayoutStore = create<LayoutState>((set) => ({
  isSmall: getInitialIsSmall(),
  setIsSmall: (recordsLength) => {
    set({ isSmall: getInitialIsSmall() });
  },
}));
