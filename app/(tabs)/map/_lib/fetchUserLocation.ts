import { apiClient } from "@/api/apiClient";
import { location } from "@/app/_types";
import { Alert } from "react-native";

export async function fetchUserLocation(data:location) {
  try {
    const response = await apiClient.post(
      `${process.env.EXPO_PUBLIC_API_URL}/user/location`,
      data
    );
    return response;
  } catch (error) {
    if (error?.response) {
      Alert.alert(error.response.data.serverErrorMessage);
    }
  }
}
