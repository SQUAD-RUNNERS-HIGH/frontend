import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export const fetchCrewApply = async (id) => {
  try {
    const response = await apiClient.post(`/crew-applicant/crew/${id}`, {
      crewId: Number(id),
    });
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};
