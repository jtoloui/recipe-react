import { UseQueryResult, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import {
  type RecipeLabelsResponse,
  type RecipesByLabelResponse,
  popularLabelsResponse,
} from './types';

type Labels = RecipeLabelsResponse;
type RecipeByLabel = RecipesByLabelResponse;

const fetchRecipeLabels = async (): Promise<Labels> => {
  const response = await axios.get<RecipeLabelsResponse>(
    `${import.meta.env.VITE_API_URI}/api/labels`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const useRecipeLabels = (): UseQueryResult<Labels, Error> => {
  return useQuery<Labels, Error>({
    queryKey: ['recipeLabels'],
    queryFn: fetchRecipeLabels,
  });
};

const fetchRecipesByLabel = async (label: string): Promise<RecipeByLabel> => {
  const response = await axios.get<RecipeByLabel>(
    `${import.meta.env.VITE_API_URI}/api/labels/${label}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const useRecipesByLabel = (
  label: string
): UseQueryResult<RecipeByLabel, Error> => {
  return useQuery<RecipeByLabel, Error>({
    queryKey: ['recipesByLabel', label],
    queryFn: () => fetchRecipesByLabel(label),
  });
};

export const fetchPopularLabels = async (): Promise<popularLabelsResponse> => {
  const response = await axios.get<popularLabelsResponse>(
    `${import.meta.env.VITE_API_URI}/api/labels/popular`,
    { withCredentials: true }
  );

  return response.data;
};

export const usePopularLabels = (): UseQueryResult<
  popularLabelsResponse,
  Error
> => {
  return useQuery<popularLabelsResponse, Error>({
    queryKey: ['popularLabels'],
    queryFn: fetchPopularLabels,
  });
};
