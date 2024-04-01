import { UseQueryResult, useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { type RecipeByIdResponse, RecipesResponse } from './types';

export const fetchRecipeById = async (
  id: string
): Promise<RecipeByIdResponse> => {
  const response = await axios.get<RecipeByIdResponse>(
    `${import.meta.env.VITE_API_URI}/api/recipes/${id}`,
    { withCredentials: true }
  );

  return response.data;
};

export const fetchRecipes = async (
  search?: string,
  label?: string
): Promise<RecipesResponse> => {
  const response = await axios.get<RecipesResponse>(
    `${import.meta.env.VITE_API_URI}/api/recipes`,
    { withCredentials: true, params: { search, label } }
  );

  return response.data;
};

export const useRecipeById = (
  id: string
): UseQueryResult<RecipeByIdResponse, Error> => {
  return useQuery<RecipeByIdResponse, Error>({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipeById(id),
  });
};

export const fetchRecipeByIdQuery = (id: string) => ({
  queryKey: ['recipe', id],
  queryFn: async () => fetchRecipeById(id),
});

export const useRecipes = (
  search?: string,
  label?: string
): UseQueryResult<RecipesResponse, Error> => {
  return useQuery<RecipesResponse, Error>({
    queryKey: ['recipes', search, label],
    queryFn: () => fetchRecipes(search, label),
  });
};