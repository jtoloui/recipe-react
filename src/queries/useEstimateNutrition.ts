import { useMutation } from '@tanstack/react-query';

import { axiosInstance } from '@/utils';

export interface EstimateNutritionIngredient {
  item: string;
  quantity?: number;
  measurement?: string;
}

export interface EstimateNutritionInput {
  name?: string;
  servings: number;
  ingredients: EstimateNutritionIngredient[];
}

export interface NutritionValues {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  saturates: number;
  fibre: number;
  sugars: number;
  salt: number;
}

export interface NutritionEstimate {
  perServing: NutritionValues;
  perRecipe: NutritionValues;
  servings: number;
  assumptions: string[];
  confidence: 'low' | 'medium' | 'high';
}

/**
 * POST /api/recipes/nutrition — AI estimate of a recipe's nutrition from its
 * ingredient list + servings. Stateless; used by the create/edit form before a
 * recipe id exists. Uses axiosInstance (baseURL resolves the API host).
 */
export const useEstimateNutrition = () =>
  useMutation({
    mutationFn: async (input: EstimateNutritionInput) => {
      const res = await axiosInstance.post<NutritionEstimate>(
        '/api/recipes/nutrition',
        input,
      );
      return res.data;
    },
  });

export default useEstimateNutrition;
