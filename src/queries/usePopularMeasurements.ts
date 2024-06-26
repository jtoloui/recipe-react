import { UseQueryResult, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { measurementsTypeResponse } from './types';

export const fetchPopularMeasurements =
  async (): Promise<measurementsTypeResponse> => {
    const response = await axios.get<measurementsTypeResponse>(
      `${import.meta.env.VITE_API_URI}/api/measurements/popular`,
      { withCredentials: true }
    );

    return response.data;
  };

export const usePopularMeasurements = (): UseQueryResult<
  measurementsTypeResponse,
  Error
> => {
  return useQuery<measurementsTypeResponse, Error>({
    queryKey: ['measurementsType'],
    queryFn: fetchPopularMeasurements,
  });
};
