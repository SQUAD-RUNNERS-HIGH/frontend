import { apiClient } from "@/api/apiClient";
import { Alert } from "react-native";

export const fetchCrewApply = async (id) => {
  try {
    const response = await apiClient.post(
      `${process.env.EXPO_PUBLIC_API_URL}/crew-applicant/crew/${id}`,
      {
        crewId: Number(id),
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
