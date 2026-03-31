import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchProfile() {
  try {
    const response = await apiClient.get(`/user`);
    return response?.data.data;
  } catch (error) {
    handleApiError(error);
  }
}
