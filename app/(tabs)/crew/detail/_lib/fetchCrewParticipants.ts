import { apiClient } from "@/api/apiClient";
import { CourseDetail } from "@/app/_types";
import { Alert } from "react-native";

export async function fetchCrewParticipants(id:string) {
  try {
    const response = await apiClient.get(
      `${process.env.EXPO_PUBLIC_API_URL}/crew/${id}/participants`,
    );
    console.log(response);
    return response?.data.data;
  } catch (error) {
    console.error(error);
    if (error?.response) {
      Alert.alert(error.response.data.serverErrorMessage);
    }
  }
}
