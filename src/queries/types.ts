type Labels = {
  count: number;
  label: string;
};

export type RecipeLabelsResponse = {
  labelCounts: Labels[];
  totalRecipes: number;
};

export interface LabelByName {
  _id: string;
  name: string;
  imageSrc: string;
  timeToCook: TimeToCook;
  labels?: string[] | null;
  ingredients?: IngredientsEntity[] | null;
  totalHours: number;
  totalMinutes: number;
  totalTime: string;
}
export interface TimeToCook {
  Cook: number;
  Prep: number;
  _id: string;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  id: string;
}
export interface IngredientsEntity {
  _id: string;
  item: string;
  measurement: string;
  quantity: number;
}
export interface RecipeById {
  _id: string;
  name: string;
  imageSrc: string;
  recipeAuthor: string;
  timeToCook: TimeToCook;
  difficulty: string;
  labels: string[];
  portions: string;
  description: string;
  nutrition: Nutrition;
  ingredients: Ingredient[];
  steps: string[];
  vegan: boolean;
  vegetarian: boolean;
  cuisine: string;
  creatorId: string;
  isAuthor: boolean;
}

export interface TimeToCook {
  Cook: number;
  Prep: number;
  _id: string;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  id: string;
}

export interface Nutrition {
  kcal: number;
  sugars: number;
  salt: number;
  carbs: number;
  protein: number;
  fat: number;
  saturates: number;
  fibre: number;
  _id: string;
}

export interface Ingredient {
  _id: string;
  item: string;
  measurement: string;
  quantity: number;
}

export type RecipeByIdResponse = RecipeById;

export type RecipesByLabelResponse = LabelByName[];
