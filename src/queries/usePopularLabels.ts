import axios from 'axios';
import { UseQueryResult, useQuery } from 'react-query';

import { popularLabelsResponse } from './types';

export const fetchPopularLabels = async (): Promise<popularLabelsResponse> => {
  const response = await axios.get<popularLabelsResponse>(
    `${import.meta.env.VITE_API_URI}/api/popular/labels`,
    { withCredentials: true }
  );

  return response.data;
};

export const usePopularLabels = (): UseQueryResult<
  popularLabelsResponse,
  Error
> => {
  return useQuery<popularLabelsResponse, Error>('popularLabels', () =>
    fetchPopularLabels()
  );
};
