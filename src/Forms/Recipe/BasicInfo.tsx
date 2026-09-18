import { useFormContext } from 'react-hook-form';

import { CreateRecipeFormData } from '@/Forms/CreateRecipe';

const fieldClass = (hasError?: boolean) =>
  `w-full rounded-lg border bg-white-500 dark:bg-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 ${
    hasError ? 'border-red-500' : 'border-gray2-500 dark:border-slate-600'
  }`;

const labelClass = 'block text-xs font-bold text-brownishGrey-600 mb-1';

export const BasicInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateRecipeFormData>();

  return (
    <div className="bg-white-500 dark:bg-slate-700 rounded-lg shadow-md p-5 md:p-6">
      <h2 className="text-sm font-bold text-charcoal-500 dark:text-white-500 mb-4 flex items-center gap-2">
        <span className="text-green-500">01</span> Basics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recipe name */}
        <div className="sm:col-span-2">
          <label htmlFor="recipeName" className={labelClass}>
            Recipe name
          </label>
          <input
            id="recipeName"
            type="text"
            {...register('recipeName')}
            placeholder="e.g. Charred Corn Tacos"
            className={fieldClass(!!errors.recipeName)}
          />
          {errors.recipeName && (
            <p className="text-xs text-red-500 mt-1">
              {errors.recipeName.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label htmlFor="recipeDescription" className={labelClass}>
            Description
          </label>
          <textarea
            id="recipeDescription"
            {...register('recipeDescription')}
            placeholder="A short, tempting summary of the dish"
            rows={2}
            className={`${fieldClass(!!errors.recipeDescription)} resize-y`}
          />
          {errors.recipeDescription && (
            <p className="text-xs text-red-500 mt-1">
              {errors.recipeDescription.message}
            </p>
          )}
        </div>

        {/* Cuisine */}
        <div>
          <label htmlFor="cuisine" className={labelClass}>
            Cuisine
          </label>
          <input
            id="cuisine"
            type="text"
            {...register('cuisine')}
            placeholder="e.g. Mexican"
            className={fieldClass(!!errors.cuisine)}
          />
          {errors.cuisine && (
            <p className="text-xs text-red-500 mt-1">
              {errors.cuisine.message}
            </p>
          )}
        </div>

        {/* Portion size */}
        <div>
          <label htmlFor="portionSize" className={labelClass}>
            Portion size (people)
          </label>
          <input
            id="portionSize"
            type="number"
            {...register('portionSize', {
              // Whole-person count; matches the parseInt used on the load path.
              setValueAs: (value) => parseInt(value, 10),
            })}
            placeholder="4"
            className={fieldClass(!!errors.portionSize)}
          />
          {errors.portionSize && (
            <p className="text-xs text-red-500 mt-1">
              {errors.portionSize.message}
            </p>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className={labelClass}>
            Difficulty
          </label>
          <select
            id="difficulty"
            {...register('difficulty')}
            className={fieldClass(!!errors.difficulty)}
          >
            <option value="" hidden>
              Select difficulty
            </option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          {errors.difficulty && (
            <p className="text-xs text-red-500 mt-1">
              {errors.difficulty.message}
            </p>
          )}
        </div>

        {/* Visibility */}
        <div>
          <label htmlFor="visibility" className={labelClass}>
            Visibility
          </label>
          <select
            id="visibility"
            {...register('visibility')}
            className={fieldClass(!!errors.visibility)}
          >
            <option value="" hidden>
              Select visibility
            </option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          {errors.visibility && (
            <p className="text-xs text-red-500 mt-1">
              {errors.visibility.message}
            </p>
          )}
        </div>

        {/* Prep time */}
        <div>
          <label htmlFor="prepTime" className={labelClass}>
            Prep time (minutes)
          </label>
          <input
            id="prepTime"
            type="number"
            {...register('prepTime', {
              setValueAs: (value) => parseFloat(value),
            })}
            placeholder="15"
            className={fieldClass(!!errors.prepTime)}
          />
          {errors.prepTime && (
            <p className="text-xs text-red-500 mt-1">
              {errors.prepTime.message}
            </p>
          )}
        </div>

        {/* Cook time */}
        <div>
          <label htmlFor="cookTime" className={labelClass}>
            Cook time (minutes)
          </label>
          <input
            id="cookTime"
            type="number"
            {...register('cookTime', {
              setValueAs: (value) => parseFloat(value),
            })}
            placeholder="20"
            className={fieldClass(!!errors.cookTime)}
          />
          {errors.cookTime && (
            <p className="text-xs text-red-500 mt-1">
              {errors.cookTime.message}
            </p>
          )}
        </div>

        {/* Dietary flags */}
        <div className="sm:col-span-2 flex flex-wrap gap-6 pt-1">
          <label
            htmlFor="vegetarian"
            className="flex items-center gap-2 text-sm font-semibold hover:cursor-pointer"
          >
            <input
              id="vegetarian"
              type="checkbox"
              {...register('vegetarian')}
              className="accent-green-500 w-4 h-4"
            />
            Vegetarian
          </label>
          <label
            htmlFor="vegan"
            className="flex items-center gap-2 text-sm font-semibold hover:cursor-pointer"
          >
            <input
              id="vegan"
              type="checkbox"
              {...register('vegan')}
              className="accent-green-500 w-4 h-4"
            />
            Vegan
          </label>
        </div>
      </div>
    </div>
  );
};
