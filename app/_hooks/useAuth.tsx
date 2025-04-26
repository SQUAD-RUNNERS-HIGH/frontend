import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { apiClient } from "@/api/apiClient";

interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  authenticate: (accessToken: string, refreshToken: string) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (refreshToken) {
          await refreshAccessToken();
        }
      } catch (error) {
        console.error("토큰 불러오기 실패:", error);
      }
    };

    initializeAuth();
  }, []);

  const authenticate = async (
    newAccessToken: string,
    newRefreshToken: string
  ) => {
    try {
      await AsyncStorage.setItem("accessToken", newAccessToken);
      await SecureStore.setItemAsync("refreshToken", newRefreshToken);
      setAccessToken(newAccessToken);
    } catch (error) {
      console.error("토큰 저장 실패:", error);
    }
  };

  // ✅ accessToken 만료되면 refreshToken으로 재발급
  const refreshAccessToken = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (!refreshToken) return;

      const response = await apiClient.post(`/auth/refresh`);
      const newAccessToken = response?.data.data.accessToken;
      if (newAccessToken) {
        await AsyncStorage.setItem("accessToken", newAccessToken);
        setAccessToken(newAccessToken);
      }
    } catch (error) {
      console.error("accessToken 갱신 실패:", error);
      await logout();
    }
  };

  // ✅ 로그아웃: 토큰 삭제
  const logout = async () => {
    try {
      await apiClient.delete(`/auth/logout`);

      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
    await AsyncStorage.removeItem("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated: !!accessToken,
        authenticate,
        refreshAccessToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

// ✅ 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
