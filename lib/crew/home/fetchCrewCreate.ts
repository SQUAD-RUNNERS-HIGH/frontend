import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchCrewCreate(formData) {
  try {
    const response = await apiClient.post("/crew", formData, {
      headers: {
        "Content-Type": 'multipart/form-data; boundary="boundary"',
      },
    });
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
