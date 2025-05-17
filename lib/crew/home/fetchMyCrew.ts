// api/crewParticipant.ts
import { apiClient } from '@/api/apiClient';
import { myCrewResponse } from '@/types';
import axios from 'axios';

export const fetchMyCrew= async (): Promise<myCrewResponse> => {
  const response = await apiClient.get('/crew-participant/crew');
  return response.data?.data;
};
