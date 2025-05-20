import { apiClient } from "@/api/apiClient";
import { useAlertStore } from "@/store/useAlertStore";
import { CourseDetail } from "@/types";
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
      useAlertStore.getState().showError(error.response.data.serverErrorMessage);
    }
  }
}