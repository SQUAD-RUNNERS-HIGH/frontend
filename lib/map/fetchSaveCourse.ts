import { apiClient } from "@/api/apiClient";
import { useAlertStore } from "@/store/useAlertStore";
import { CourseDetail, soloRunningRecord } from "@/types";
import { Alert } from "react-native";

export async function fetchSaveCourses({courseName, coordinates,runningTime , progress}) {
  try {
    const response = await apiClient.post(
      `${process.env.EXPO_PUBLIC_API_URL}/courses`,
  {
    courseName,
    coordinates,
    runningTime,
    progress
  });
    return response?.data.data;
  } catch (error) {
    console.error(error);
    if (error?.response) {
      useAlertStore.getState().showError({title: '문제가 발생했어요', description: error.response.data.serverErrorMessage});
    }
  }
}