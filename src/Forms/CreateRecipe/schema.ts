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
          .positive('Quantity must be greater than 0'),
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
  nutritionFactsPerRecipe: z.optional(
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
  nutritionMeta: z.optional(
    z.object({
      servings: z.number().optional().nullable().nullish(),
      source: z.string().optional().nullable().nullish(),
      estimatedAt: z.string().optional().nullable().nullish(),
    })
  ),
  labels: z
    .array(z.string().min(1, 'Must have at least one label'))
    .min(1, 'Must have at least one label'),
  // Optional credit for recipes adapted from elsewhere (validated together below).
  sourceName: z.string().trim().max(120, 'Keep the source name under 120 characters').optional(),
  sourceUrl: z.string().trim().max(2048, 'Source link is too long').optional(),
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

/** True for absolute http(s) URLs only. */
export const isHttpUrl = (value?: string) => {
  try {
    const url = new URL(value ?? '');
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Form-level schema used by the resolver. `createRecipeSchema` stays a plain
 * object (its `.shape` is used for per-field checks); this adds the
 * "both or neither" rule for the recipe source.
 */
export const createRecipeFormSchema = createRecipeSchema.superRefine((data, ctx) => {
  const name = data.sourceName?.trim() ?? '';
  const url = data.sourceUrl?.trim() ?? '';
  if (!name && !url) return;
  if (!name) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sourceName'], message: 'Add a name for the source' });
  }
  if (!url) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sourceUrl'], message: 'Add a link to the original recipe' });
  } else if (!isHttpUrl(url)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['sourceUrl'],
      message: 'Enter a full link starting with https://',
    });
  }
});

/**
 * Shape sent to the API: the flat source fields become `source`, or `null`
 * when both are empty so clearing them in the form removes the credit.
 */
export function toRecipePayload(formData: CreateRecipeFormData) {
  const { sourceName, sourceUrl, ...rest } = formData;
  const name = sourceName?.trim() ?? '';
  const url = sourceUrl?.trim() ?? '';
  return { ...rest, source: name && url ? { name, url } : null };
}

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
    nutritionPerRecipe: formData.nutritionFactsPerRecipe,
    nutritionMeta: formData.nutritionMeta,
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
  nutritionPerRecipe?: Nutrition;
  nutritionMeta?: { servings?: number | null; source?: string | null; estimatedAt?: string | null };
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
