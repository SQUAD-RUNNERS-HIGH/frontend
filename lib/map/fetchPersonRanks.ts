import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchPersonRanks({pageParam = 0, queryKey}) {
  try {
    const [_key, courseId] = queryKey;

    const response = await apiClient.get(
      `/personal-ranks/courses/${courseId}`,
      {
        params: {
          page: pageParam,
          size: 6,
        }
      }
    );
    return { items: response?.data.data, nextPage: response?.data.data.hasNext ? pageParam + 1 : undefined };
  } catch (error) {
    handleApiError(error);
  }
}
