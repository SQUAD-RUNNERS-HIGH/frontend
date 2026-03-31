import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchCrewRanking({pageParams= 0, queryKey}) {
  try {
    const data = await apiClient.get(`/crew-rank`, {
      params: {
        'size': 5,
      }
    });
    return data?.data;
  } catch (error) {
    handleApiError(error);
  }
}