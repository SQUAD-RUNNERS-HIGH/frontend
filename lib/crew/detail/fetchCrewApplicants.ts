import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export async function fetchCrewApplicants(id) {
  try {
    const response = await apiClient.get(`/crew-applicant/crew/${id}`);
    return response?.data.data;
  } catch (error) {
    handleApiError(error);
  }
}
