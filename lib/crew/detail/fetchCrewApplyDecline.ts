import { apiClient } from "@/api/apiClient";
import { useAlertStore } from "@/store/useAlertStore";
import { Alert } from "react-native";

export const fetchCrewApplyDecline = async (id, applicantId) => {
  try {
    const response = await apiClient.patch(
      `${process.env.EXPO_PUBLIC_API_URL}/crew-applicant/crew/${id}/applicant/${applicantId}`,
      {
        crewId: Number(id),
        applicantId: Number(applicantId),
      }
    );
    return response?.data;
  } catch (error) {
    console.error(error);
    if (error?.response) {
      useAlertStore.getState().showError({title: '문제가 발생했어요', description: error.response.data.serverErrorMessage});
    }
  }
};
