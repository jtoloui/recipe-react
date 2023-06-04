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

export type RecipesByLabelResponse = LabelByName[];
