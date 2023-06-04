import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { RecipeByIdResponse } from './types';

const fetchRecipeById = async (id: string): Promise<RecipeByIdResponse> => {
  const response = await axios.get<RecipeByIdResponse>(`/api/recipes/${id}`);
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
