import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchCourseDetail(id:string) {
  try {
    const response = await apiClient.get(`/courses/${id}`);
    return response?.data.data;
  } catch (error) {
    handleApiError(error);
  }
}
