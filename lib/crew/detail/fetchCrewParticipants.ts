import { apiClient } from "@/api/apiClient";
import { useAlertStore } from "@/store/useAlertStore";
import { CourseDetail } from "@/types";
import { Alert } from "react-native";

export async function fetchCrewParticipants(id:string) {
  try {
    const response = await apiClient.get(
      `${process.env.EXPO_PUBLIC_API_URL}/crew/${id}/participants`,
    );
    return response?.data.data;
  } catch (error) {
    console.error(error);
    if (error?.response) {
      useAlertStore.getState().showError({title: '문제가 발생했어요', description: error.response.data.serverErrorMessage});
    }
  }
}
