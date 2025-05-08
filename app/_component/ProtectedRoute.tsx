// components/ProtectedRoute.js
import { ReactNode, useEffect } from "react";
import { useAuth } from "../_hooks/useAuth";
import { Redirect } from "expo-router";
export const ProtectedRoute = ({
  children,
  isAuthPage = false,
}: {
  children: ReactNode;
  isAuthPage: boolean;
}) => {
  const { accessToken } = useAuth();
  if (accessToken && isAuthPage) {
    return <Redirect href="/map" />;
  }
  if (!accessToken && !isAuthPage) {
    return <Redirect href="/" />;
  }

  return children;
};
