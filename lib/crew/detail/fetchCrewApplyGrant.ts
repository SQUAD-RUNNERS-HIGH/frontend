import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export const fetchCrewApplyGrant = async (id: number, applicantId: number) => {
  try {
    const response = await apiClient.post(
      `/crew-applicant/crew/${id}/applicant/${applicantId}`,
      {
        crewId: id,
        applicantId: applicantId,
      }
    );
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};
