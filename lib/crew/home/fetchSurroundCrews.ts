import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchSurroundCrews({pageParams= 0, queryKey}) {
  try {
    const data = await apiClient.get(`/crew/nearby`, {
      params: {
        'pageable.page': pageParams,
        'pageable.size': 4,
        'pageable.sort': 'name,asc',
      }
    });
    return data?.data;
  } catch (error) {
    handleApiError(error);
  }
}