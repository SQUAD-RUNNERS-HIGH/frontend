import { apiClient } from "@/api/apiClient";

export async function fetchSurroundCrews({pageParams= 0, queryKey}) {
  const data = await apiClient.get(`/crew/nearby`, {
    params: {
      'pageable.page': pageParams,
      'pageable.size': 4,
      'pageable.sort': 'name,asc',
    }
  });
  return data?.data;
}