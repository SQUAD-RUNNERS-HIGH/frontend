import { apiClient } from "@/api/apiClient";
import { CourseDetail } from "@/app/_types";
import { Alert } from "react-native";

export async function fetchCrewApplicants(id) {
  try {
    const response = await apiClient.get(
      `/crew-applicant/crew/${id}`,
    );
    return response?.data.data;
  } catch (error) {
    console.error(error);
    if (error?.response) {
      Alert.alert(error.response.data.serverErrorMessage);
    }
  }
}