import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchSaveCourses({courseName, coordinates, runningTime, progress}) {
  try {
    const response = await apiClient.post(`/courses`, {
      courseName,
      coordinates,
      runningTime,
      progress,
    });
    return response?.data.data;
  } catch (error) {
    handleApiError(error);
  }
}
