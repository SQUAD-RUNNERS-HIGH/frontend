import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchCrewDetail(id: string) {
  try {
    const response = await apiClient.get(`/crew/${id}`);
    return response?.data.data;
  } catch (error) {
    handleApiError(error);
  }
}
