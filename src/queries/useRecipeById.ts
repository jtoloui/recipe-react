import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { RecipeByIdResponse } from './types';

export const fetchRecipeById = async (
  id: string
): Promise<RecipeByIdResponse> => {
  const response = await axios.get<RecipeByIdResponse>(
    `${import.meta.env.VITE_API_URI}/api/recipes/${id}`,
    { withCredentials: true }
  );
  console.log(response.data);

  return response.data;
};

export const useRecipeById = (
  id: string
): UseQueryResult<RecipeByIdResponse, Error> => {
  return useQuery<RecipeByIdResponse, Error>('recipeById', () =>
    fetchRecipeById(id)
  );
};

export const fetchRecipeByIdQuery = (id: string) => ({
  queryKey: ['recipe', id],
  queryFn: async () => fetchRecipeById(id),
});
