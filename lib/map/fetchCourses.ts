import { apiClient } from "@/api/apiClient";
import { location } from "@/types";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchCourses(data: location) {
  try {
    const response = await apiClient.get(`/courses`, {
      params: {
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });
    return response?.data.data;
  } catch (error) {
    handleApiError(error);
  }
}
