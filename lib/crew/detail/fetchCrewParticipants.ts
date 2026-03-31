import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchCrewParticipants(id: string) {
  try {
    const response = await apiClient.get(`/crew/${id}/participants`);
    return response?.data.data;
  } catch (error) {
    handleApiError(error);
  }
}
