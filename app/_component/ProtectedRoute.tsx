// components/ProtectedRoute.js
import { ReactNode, useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
export const ProtectedRoute = ({
  children,
  isAuthPage = false,
}: {
  children: ReactNode;
  isAuthPage: boolean;
}) => {
  const accessToken = useAuthStore(state => state.accessToken);
  if (accessToken && isAuthPage) {
    return <Redirect href="/map" />;
  }
  if (!accessToken && !isAuthPage) {
    return <Redirect href="/" />;
  }

  return children;
};
