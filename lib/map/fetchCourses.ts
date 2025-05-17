import { apiClient } from "@/api/apiClient";
import { location } from "@/types";
import { Alert } from "react-native";

export async function fetchCourses(data:location) {
  try {
    const response = await apiClient.get(
      `${process.env.EXPO_PUBLIC_API_URL}/courses`,
      {
        params: {
          latitude: data.latitude,
          longitude: data.longitude,
        }
      }
    );
    return response?.data.data;
  } catch (error) {
    console.error(error);
    // if (error?.response) {
    //   Alert.alert(error.response.data.serverErrorMessage);
    // }
  }
}
