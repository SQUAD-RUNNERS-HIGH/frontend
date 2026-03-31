import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 — 401 시 토큰 갱신 후 재요청
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const newToken = await useAuthStore.getState().refreshAccessToken();
        failedQueue.forEach(({ resolve }) => resolve(newToken));
        failedQueue = [];
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (e) {
        failedQueue.forEach(({ reject }) => reject(e));
        failedQueue = [];
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
