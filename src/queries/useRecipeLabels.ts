import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { RecipeLabelsResponse, RecipesByLabelResponse } from './types';

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
  return useQuery<Labels, Error>('recipeLabels', fetchRecipeLabels);
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
  return useQuery<RecipeByLabel, Error>(['recipesByLabel', label], () =>
    fetchRecipesByLabel(label)
  );
};
