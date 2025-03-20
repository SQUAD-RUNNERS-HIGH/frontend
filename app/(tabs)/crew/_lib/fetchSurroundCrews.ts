import { apiClient } from "@/api/apiClient";

export async function fetchSurroundCrews() {
  const data = await apiClient.get(`${process.env.EXPO_PUBLIC_API_URL}/crew/surround`);
  return data?.data.data.crews;
}