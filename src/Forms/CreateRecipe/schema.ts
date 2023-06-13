import { z } from 'zod';

const Difficulty = z.enum(['Easy', 'Medium', 'Hard']);

export const createRecipeSchema = z.object({
  recipeName: z.string().min(1),
  recipeDescription: z.string().min(1),
  vegetarian: z.boolean(),
  vegan: z.boolean(),
  difficulty: Difficulty,
  cuisine: z.string().min(1),
  prepTime: z.number().min(1),
  cookTime: z.number().min(1),
  steps: z.array(
    z.object({
      step: z.string(),
    })
  ),
  ingredients: z.array(
    z.object({
      item: z.string(),
      measurement: z.string(),
      quantity: z.number(),
    })
  ),
  nutritionFacts: z.optional(
    z.object({
      kcal: z.optional(z.number()),
      sugars: z.optional(z.number()),
      salt: z.optional(z.number()),
      carbs: z.optional(z.number()),
      protein: z.optional(z.number()),
      fat: z.optional(z.number()),
      saturates: z.optional(z.number()),
      fibre: z.optional(z.number()),
    })
  ),
  labels: z.array(z.string()),
  portionSize: z.number(),
});
