import { apiClient } from "@/api/apiClient";
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
      Alert.alert(error.response.data.serverErrorMessage);
    }
  }
};
