import axios from 'axios';
import { UseQueryResult, useQuery } from 'react-query';

import { measurementsTypeResponse } from './types';

export const fetchPopularMeasurements =
  async (): Promise<measurementsTypeResponse> => {
    const response = await axios.get<measurementsTypeResponse>(
      `${import.meta.env.VITE_API_URI}/api/popular/measurements`,
      { withCredentials: true }
    );

    return response.data;
  };

export const usePopularMeasurements = (): UseQueryResult<
  measurementsTypeResponse,
  Error
> => {
  return useQuery<measurementsTypeResponse, Error>('measurementsType', () =>
    fetchPopularMeasurements()
  );
};
