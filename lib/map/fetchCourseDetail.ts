import { apiClient } from "@/api/apiClient";
import { CourseDetail } from "@/types";
import { Alert } from "react-native";

export async function fetchCourseDetail(id:string) {
  try {
    const response = await apiClient.get(
      `${process.env.EXPO_PUBLIC_API_URL}/courses/${id}`,
    );
    return response?.data.data;
  } catch (error) {
    console.error(error);
    if (error?.response) {
      useAlertStore.getState().showError({title: '문제가 발생했어요', description: error.response.data.serverErrorMessage});
    }
  }
}
