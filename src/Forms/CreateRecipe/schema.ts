import { z } from 'zod';

const Difficulty = z.enum(['Easy', 'Medium', 'Hard'], {
  errorMap: (error) => {
    switch (error.code) {
      case z.ZodIssueCode.invalid_enum_value:
        return {
          message: 'Difficulty must be one of Easy, Medium, or Hard',
        };
      default:
        return {
          message: 'Difficulty is required',
        };
    }
  },
});

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
];

export type CreateRecipeFormData = z.infer<typeof createRecipeSchema>;

export const createRecipeSchema = z.object({
  recipeName: z.string().min(1, "Recipe name can't be empty"),
  recipeDescription: z.string().min(1, "Recipe description can't be empty"),
  vegetarian: z.boolean(),
  vegan: z.boolean(),
  difficulty: Difficulty,
  cuisine: z.string().min(1, "Cuisine can't be empty"),
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
  steps: z
    .array(
      z.object({
        step: z.string().min(1, "Step can't be empty"),
      })
    )
    .min(1, 'You must have at least one step'),
  ingredients: z
    .array(
      z.object({
        item: z.string().min(1, "Ingredient can't be empty"),
        measurement: z.string().min(1, "Measurement can't be empty"),
        quantity: z
          .number({
            invalid_type_error: 'Quantity must be a number',
          })
          .min(1, 'Quantity must be at least 1'),
      })
    )
    .min(1, 'You must have at least one ingredient'),
  nutritionFacts: z.optional(
    z.object({
      kcal: z.number().optional().nullable().nullish(),
      sugars: z.number().optional().nullable().nullish(),
      salt: z.number().optional().nullable().nullish(),
      carbs: z.number().optional().nullable().nullish(),
      protein: z.number().optional().nullable().nullish(),
      fat: z.number().optional().nullable().nullish(),
      saturates: z.number().optional().nullable().nullish(),
      fibre: z.number().optional().nullable().nullish(),
    })
  ),
  labels: z
    .array(z.string().min(1, 'Must have at least one label'))
    .min(1, 'Must have at least one label'),
  portionSize: z
    .number({
      invalid_type_error: 'Portion size must be a number',
    })
    .min(1, 'Portion size must be at least 1'),
  image: z
    .any()
    .refine((file?: File) => file?.type !== undefined, {
      message: 'Image is required',
    })
    .refine((file: File) => file?.size < 5000000, {
      message: 'File is larger than 5MB',
    })
    .refine((file: File) => ACCEPTED_IMAGE_TYPES.includes(file?.type || ''), {
      message: 'Image must be a jpeg, jpg, png, webp, or svg',
    }),
  visibility: z.enum(['public', 'private'], {
    errorMap: (error) => {
      switch (error.code) {
        case z.ZodIssueCode.invalid_enum_value:
          return {
            message: 'Visibility must be one of public or private',
          };
        default:
          return {
            message: 'Visibility is required',
          };
      }
    },
  }),
});

export function createRecipeFormToPostObject(
  formData: CreateRecipeFormData
): CreateRecipePostObject {
  return {
    name: formData.recipeName,
    imageSrc: 'hello',
    timeToCook: {
      Cook: formData.cookTime,
      Prep: formData.prepTime,
    },
    difficulty: formData.difficulty,
    labels: formData.labels,
    portions: formData.portionSize.toString(),
    description: formData.recipeDescription,
    nutrition: formData.nutritionFacts,
    ingredients: formData.ingredients,
    steps: formData.steps.map((step) => step.step),
    vegan: formData.vegan,
    vegetarian: formData.vegetarian,
    cuisine: formData.cuisine,
  };
}

export type CreateRecipePostObject = {
  name: string;
  imageSrc: string;
  timeToCook: TimeToCook;
  difficulty: string | null;
  labels: string[];
  portions: string;
  description: string;
  nutrition: Nutrition | undefined;
  ingredients: Ingredient[];
  steps: string[];
  vegan: boolean;
  vegetarian: boolean;
  cuisine: string;
};

interface TimeToCook {
  Cook: number;
  Prep: number;
}

interface Nutrition {
  kcal?: number | null;
  sugars?: number | null;
  salt?: number | null;
  carbs?: number | null;
  protein?: number | null;
  fat?: number | null;
  saturates?: number | null;
  fibre?: number | null;
}

interface Ingredient {
  item: string;
  measurement: string;
  quantity: number;
}
