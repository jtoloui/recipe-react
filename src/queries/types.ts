type Labels = {
  count: number;
  label: string;
};

export type RecipeLabelsResponse = {
  labelCounts: Labels[];
  totalRecipes: number;
};

type LabelRecipe = {
  _id: string;
  labels: string[];
  name: string;
  imageSrc: string;
};

export type RecipesByLabelResponse = LabelRecipe[];
