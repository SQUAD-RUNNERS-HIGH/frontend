import { apiClient } from "@/api/apiClient";

export async function fetchPersonRanks({pageParam = 0, queryKey}) {
  try {
    const [_key, courseId] = queryKey;

    const response = await apiClient.get(
      `${process.env.EXPO_PUBLIC_API_URL}/personal-ranks/courses/${courseId}`,
      {
        params: {
          page: pageParam,
          size: 6,
        }
      }
    );
    return  {items: response?.data.data, nextPage: response?.data.data.hasNext? pageParam + 1: undefined};
  } catch (error) {
    console.error(error);
  }
}
