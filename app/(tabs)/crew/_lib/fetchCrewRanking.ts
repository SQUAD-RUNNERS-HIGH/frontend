import { apiClient } from "@/api/apiClient";

export async function fetchCrewRanking({pageParams= 0, queryKey}) {
  const data = await apiClient.get(`/crew-rank`, {
    params: {
      'size': 5,
    }
  });
  return data?.data;
}