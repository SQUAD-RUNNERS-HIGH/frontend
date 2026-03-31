import { apiClient } from '@/api/apiClient';
import { myCrewResponse } from '@/types';
import { handleApiError } from "@/lib/utils/handleApiError";

export const fetchMyCrew= async (): Promise<myCrewResponse | undefined> => {
  try {
    const response = await apiClient.get('/crew-participant/crew');
    return response.data?.data;
  } catch (error) {
    handleApiError(error);
  }
};
