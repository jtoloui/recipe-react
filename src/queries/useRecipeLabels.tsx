import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { RecipeLabelsResponse, RecipesByLabelResponse } from './types';

type Labels = RecipeLabelsResponse;
type RecipeByLabel = RecipesByLabelResponse;

async function fetchWithToken(
  url: string,
  getAccessTokenSilently: any
): Promise<any> {
  const token = await getAccessTokenSilently();
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export function useRecipeLabels(): UseQueryResult<Labels, Error> {
  const { getAccessTokenSilently } = useAuth0();
  return useQuery<Labels, Error>('recipeLabels', () =>
    fetchWithToken('/api/labels', getAccessTokenSilently)
  );
}

export function useRecipesByLabel(
  label: string
): UseQueryResult<RecipeByLabel, Error> {
  const { getAccessTokenSilently } = useAuth0();
  return useQuery<RecipeByLabel, Error>(['recipesByLabel', label], () =>
    fetchWithToken(`/api/labels/${label}`, getAccessTokenSilently)
  );
}
