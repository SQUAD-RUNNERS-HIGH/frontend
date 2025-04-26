import { apiClient } from "@/api/apiClient";
import { CourseDetail } from "@/app/_types";
import { Alert } from "react-native";

export async function fetchSaveCourses({courseName, coordinates}:{courseName:string; coordinates: [number,number][][]}) {
  try {
    const response = await apiClient.post(
      `${process.env.EXPO_PUBLIC_API_URL}/courses`,
  {
    courseName,
    coordinates,
  });
    return response?.data.data;
  } catch (error) {
    console.error(error);
    if (error?.response) {
      Alert.alert(error.response.data.serverErrorMessage);
    }
  }
}