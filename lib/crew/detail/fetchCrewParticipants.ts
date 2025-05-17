import { apiClient } from "@/api/apiClient";
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
      Alert.alert(error.response.data.serverErrorMessage);
    }
  }
}
