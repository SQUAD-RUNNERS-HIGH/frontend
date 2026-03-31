import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchCompetitor(historyId:string, courseId:string) {
  try {
    const response = await apiClient.post(
      `/personal/history/histories/${historyId}/courses/${courseId}/`,
    );
    return response?.data.data;
  } catch (error) {
    handleApiError(error);
  }
}
