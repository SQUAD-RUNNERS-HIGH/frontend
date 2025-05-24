// authStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '@/api/apiClient';
import { UserLoginResponse } from '@/types';

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  username: string | null;
  setAuth: (data:UserLoginResponse) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      userId: null,
      username: null,

      setAuth: async ({tokenResponse, userId, username}) => {
        await SecureStore.setItemAsync('refreshToken', tokenResponse.refreshToken);
        console.log(username);
        set({ accessToken: tokenResponse.accessToken, userId: userId.toString(), username });
      },

      logout: async () => {
        await SecureStore.deleteItemAsync('refreshToken');
        await AsyncStorage.removeItem('auth'); // zustand persist 기본 키
        set({ accessToken: null, userId: null, username: null });
      },

      refreshAccessToken: async () => {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) return;

        try {
          // 🔁 새 토큰 요청
          const response = await apiClient.post('/auth/refresh');
          const newAccessToken = response?.data?.data?.accessToken;
          if (newAccessToken) {
            set({ accessToken: newAccessToken });
          }
        } catch (e) {
          console.error('토큰 갱신 실패', e);
          await get().logout();
        }
      },
    }),
    {
      name: 'auth', // AsyncStorage에 저장될 key
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            ['accessToken', 'userId', 'username'].includes(key)
          )
        ),
    }
  )
);
