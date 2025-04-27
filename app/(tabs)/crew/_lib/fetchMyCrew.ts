// api/crewParticipant.ts
import { apiClient } from '@/api/apiClient';
import { myCrewResponse } from '@/app/_types';
import axios from 'axios';

export const fetchMyCrew= async (): Promise<myCrewResponse> => {
  const response = await apiClient.get('/crew-participant/crew');
  return response.data?.data;
};
