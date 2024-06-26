export type Labels = {
  count: number;
  label: string;
  image: string;
};

export type RecipesResponse = {
  recipes: {
    _id: string;
    name: string;
    image: {
      src: string;
      type: string;
      originalName: string;
      storageName: string;
    };
    labels: string[];
    ingredients?: IngredientsEntity[];
    timeToCook: {
      id: string;
      Cook: number;
      Prep: number;
      totalMinutes: number;
      totalHours: number;
      totalDays: number;
      totalTime: string;
    };
  }[];
  meta: {
    allLabels: Labels[];
    availableLabels: Labels[];
    totalRecipes: number;
    totalRecipesMatching: number;
  };
};

export type RecipeLabelsResponse = {
  labelCounts: Labels[];
  totalRecipes: number;
};

export interface LabelByName {
  _id: string;
  name: string;
  image: {
    src: string;
    type: string;
    originalName: string;
    storageName: string;
  };
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
  image: {
    src: string;
    type: string;
    originalName: string;
    storageName: string;
  };
  recipeAuthor: string;
  timeToCook: TimeToCook;
  difficulty: 'Easy' | 'Medium' | 'Hard';
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
  visibility: {
    public: boolean;
    private: boolean;
    groups: string[];
  };
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

export interface measurementsTypeResponse {
  measurements: string[];
}

export interface popularLabelsResponse {
  _id: null;
  labels: string[];
}

export interface CreateRecipeResponse {
  name: string;
  image: {
    src: string;
    type: string;
    originalName: string;
    storageName: string;
  };
  recipeAuthor: string;
  timeToCook: TimeToCook;
  difficulty: string;
  labels: string[];
  portions: string;
  description: string;
  nutrition: Nutrition;
  vegan: boolean;
  vegetarian: boolean;
  ingredients: Ingredient[];
  steps: string[];
  cuisine: string;
  creatorId: string;
  _id: string;
  __v: number;
}
