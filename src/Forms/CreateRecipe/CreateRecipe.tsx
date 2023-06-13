import { useFieldArray, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { createRecipeSchema } from '.';

export type CreateRecipeFormData = z.infer<typeof createRecipeSchema>;
export const CreateRecipe = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CreateRecipeFormData>();
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: 'ingredients' });
  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({ control, name: 'steps' });

  return (
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-2">Section 1</h2>
        <input
          {...register('recipeName')}
          placeholder="Recipe Name"
          className="border rounded px-3 py-2 w-full"
        />
        {errors.recipeName && (
          <span className="text-red-500">Recipe Name is required</span>
        )}
        <input
          {...register('recipeDescription')}
          placeholder="Recipe Description"
          className="border rounded px-3 py-2 w-full"
        />
        {errors.recipeDescription && (
          <span className="text-red-500">Recipe Description is required</span>
        )}
        <div className="flex space-x-4">
          <div>
            <label className="block">Is Vegetarian?</label>
            <input {...register('vegetarian')} type="checkbox" />
          </div>
          <div>
            <label className="block">Is Vegan?</label>
            <input {...register('vegan')} type="checkbox" />
          </div>
        </div>
        <select
          {...register('difficulty')}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        {errors.difficulty && (
          <span className="text-red-500">Difficulty is required</span>
        )}
        <input
          {...register('cuisine')}
          placeholder="Cuisine"
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div className="space-y-4 mt-6">
        <h2 className="text-2xl font-bold mb-2">Section 2</h2>
        <input
          {...register('prepTime', {
            setValueAs: (value) => parseFloat(value),
          })}
          type="number"
          placeholder="Preparation Time"
          className="border rounded px-3 py-2 w-full"
        />
        {errors.prepTime && (
          <span className="text-red-500">Preparation Time is required</span>
        )}
        <input
          {...register('cookTime', {
            setValueAs: (value) => parseFloat(value),
          })}
          type="number"
          placeholder="Cooking Time"
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div className="space-y-4 mt-6">
        <h2 className="text-2xl font-bold mb-2">Section 3</h2>
        {ingredientFields.map((field, index) => (
          <div key={field.id} className="flex space-x-2">
            <input
              {...register(`ingredients.${index}.item`)}
              placeholder="Ingredient Item"
              className="border rounded px-3 py-2 flex-grow"
            />
            <input
              {...register(`ingredients.${index}.measurement`)}
              placeholder="Ingredient Measurement"
              className="border rounded px-3 py-2 flex-grow"
            />
            <input
              {...register(`ingredients.${index}.quantity`, {
                setValueAs: (value) => parseFloat(value),
              })}
              type="number"
              placeholder="Ingredient Quantity"
              className="border rounded px-3 py-2 flex-grow"
            />
            <button
              onClick={() => removeIngredient(index)}
              className="px-3 py-2 bg-red-500 text-white rounded"
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            appendIngredient({ item: '', measurement: '', quantity: 0 })
          }
          type="button"
          className="px-3 py-2 bg-green-500 text-white rounded"
        >
          Add Ingredient
        </button>
      </div>

      <div className="space-y-4 mt-6">
        <h2 className="text-2xl font-bold mb-2">Section 4</h2>
        {stepFields.map((field, index) => (
          <div key={field.id} className="flex space-x-2">
            <input
              {...register(`steps.${index}.step`)}
              placeholder={`Step ${index + 1}`}
              className="border rounded px-3 py-2 flex-grow"
              defaultValue={field.step}
            />
            <button
              onClick={() => removeStep(index)}
              className="px-3 py-2 bg-red-500 text-white rounded"
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => appendStep({ step: '' })}
          className="px-3 py-2 bg-green-500 text-white rounded"
          type="button"
        >
          Add Step
        </button>
      </div>

      <div className="space-y-4 mt-6">
        <h2 className="text-2xl font-bold mb-2">Section 5</h2>
        <input
          {...register('nutritionFacts.kcal', {
            setValueAs: (value) => parseFloat(value),
          })}
          type="number"
          placeholder="Calories (kcal)"
          className="border rounded px-3 py-2 w-full"
        />
        <input
          {...register('nutritionFacts.sugars', {
            setValueAs: (value) => parseFloat(value),
          })}
          type="number"
          placeholder="Sugars (g)"
          className="border rounded px-3 py-2 w-full"
        />
        <input
          {...register('nutritionFacts.salt', {
            setValueAs: (value) => parseFloat(value),
          })}
          type="number"
          placeholder="Salt (g)"
          className="border rounded px-3 py-2 w-full"
        />
        <input
          {...register('nutritionFacts.carbs', {
            setValueAs: (value) => parseFloat(value),
          })}
          type="number"
          placeholder="Carbohydrates (g)"
          className="border rounded px-3 py-2 w-full"
        />
        <input
          {...register('nutritionFacts.protein', {
            setValueAs: (value) => parseFloat(value),
          })}
          type="number"
          placeholder="Protein (g)"
          className="border rounded px-3 py-2 w-full"
        />
        <input
          {...register('nutritionFacts.fat', {
            setValueAs: (value) => parseFloat(value),
          })}
          type="number"
          placeholder="Fat (g)"
          className="border rounded px-3 py-2 w-full"
        />
        <input
          {...register('nutritionFacts.saturates', {
            setValueAs: (value) => parseFloat(value),
          })}
          type="number"
          placeholder="Saturated Fat (g)"
          className="border rounded px-3 py-2 w-full"
        />
        <input
          {...register('nutritionFacts.fibre', {
            setValueAs: (value) => parseFloat(value),
          })}
          type="number"
          placeholder="Fibre (g)"
          className="border rounded px-3 py-2 w-full"
        />
        <input
          {...register('labels', {
            setValueAs: (value: string) => value.split(','),
          })}
          placeholder="Labels (comma separated)"
          className="border rounded px-3 py-2 w-full"
        />
        <input
          {...register('portionSize', {
            setValueAs: (value) => parseFloat(value),
          })}
          type="number"
          placeholder="Portion Size (g)"
          className="border rounded px-3 py-2 w-full"
        />
      </div>
    </form>
  );
};
