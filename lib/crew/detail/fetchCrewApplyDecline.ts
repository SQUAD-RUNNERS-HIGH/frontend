import { apiClient } from "@/api/apiClient";
import { handleApiError } from "@/lib/utils/handleApiError";

export const fetchCrewApplyDecline = async (id, applicantId) => {
  try {
    const response = await apiClient.patch(
      `/crew-applicant/crew/${id}/applicant/${applicantId}`,
      {
        crewId: Number(id),
        applicantId: Number(applicantId),
      }
    );
    return response?.data;
  } catch (error) {
    handleApiError(error);
  }
};
