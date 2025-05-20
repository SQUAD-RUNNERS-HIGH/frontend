import { apiClient } from "@/api/apiClient";
import { useAlertStore } from "@/store/useAlertStore";
import { location } from "@/types";
import { Alert } from "react-native";

export async function fetchCourses(data: location) {
  try {
    const response = await apiClient.get(
      `${process.env.EXPO_PUBLIC_API_URL}/courses`,
      {
        params: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
      }
    );
    return response?.data.data;
  } catch (error) {
    useAlertStore
      .getState()
      .showError({
        title: "문제가 발생했어요",
        description: error.response.data.serverErrorMessage,
      });
  }
}
