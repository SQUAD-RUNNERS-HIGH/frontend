import { useAuthStore } from "@/store/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
 async (config) => {
    const token = useAuthStore.getState().accessToken; // 직접 access
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
