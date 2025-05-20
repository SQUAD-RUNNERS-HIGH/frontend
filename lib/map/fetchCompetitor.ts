import { apiClient } from "@/api/apiClient";
import { CourseDetail } from "@/types";
import { Alert } from "react-native";

export async function fetchCompetitor(historyId:string, courseId:string) {
  try {
    const response = await apiClient.post(
      `${process.env.EXPO_PUBLIC_API_URL}/personal/history/histories/${historyId}/courses/${courseId}/`,
    );
    return response?.data.data;
  } catch (error) {
    console.error(error);
    if (error?.response) {
      useAlertStore.getState().showError({title: '문제가 발생했어요', description: error.response.data.serverErrorMessage});
    }
  }
}