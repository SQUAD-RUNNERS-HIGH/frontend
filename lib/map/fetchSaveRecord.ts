import { apiClient } from "@/api/apiClient";
import { CourseDetail, competitorRunningRecord } from "@/types";
import { Alert } from "react-native";

export async function fetchSaveRecord({progress, runningTime, courseId}: competitorRunningRecord) {
  try {
    const response = await apiClient.post(
      `${process.env.EXPO_PUBLIC_API_URL}/personal/history`,
  {
    progress,
    runningTime,
    courseId
  });
    return response?.data.data;
  } catch (error) {
    console.error(error);
    if (error?.response) {
      Alert.alert(error.response.data.serverErrorMessage);
    }
  }
}