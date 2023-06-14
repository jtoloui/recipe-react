import { z } from 'zod';

const Difficulty = z.enum(['Easy', 'Medium', 'Hard']);

export const createRecipeSchema = z.object({
  recipeName: z.string().min(1),
  recipeDescription: z.string().min(1),
  vegetarian: z.boolean(),
  vegan: z.boolean(),
  difficulty: Difficulty,
  cuisine: z.string().min(1),
  prepTime: z
    .number({
      invalid_type_error: 'Prep time must be a number',
    })
    .min(1, 'Prep time must be at least 1 minute'),
  cookTime: z
    .number({
      invalid_type_error: 'Cook time must be a number',
    })
    .min(1, 'Cook time must be at least 1 minute'),
  steps: z.array(
    z.object({
      step: z.string(),
    })
  ),
  ingredients: z
    .array(
      z.object({
        item: z.string(),
        measurement: z.string(),
        quantity: z.number(),
      })
    )
    .min(1, 'You must have at least one ingredient'),
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
