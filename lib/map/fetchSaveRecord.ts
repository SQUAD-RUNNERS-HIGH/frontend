import { apiClient } from "@/api/apiClient";
import { competitorRunningRecord } from "@/types";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchSaveRecord({progress, runningTime, courseId}: competitorRunningRecord) {
  try {
    const response = await apiClient.post(`/personal/history`, {
      progress,
      runningTime,
      courseId,
    });
    return response?.data.data;
  } catch (error) {
    handleApiError(error);
  }
}
