import { useFormContext } from 'react-hook-form';

import { CreateRecipeFormData } from '@/Forms/CreateRecipe';

export const BasicInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateRecipeFormData>();

  return (
    <div className="border-b border-gray2-500 mb-4">
      <div className="flex mb-6">
        <div className="w-full">
          <div className="flex">
            <div className="relative mb-2 w-full">
              <input
                type="text"
                {...register('recipeName')}
                className={`block w-full px-0 pt-4 pb-1 border-0 border-b focus:ring-0 focus:border-black focus:outline-none ${
                  errors.recipeName ? 'border-red-500' : 'border-green-500'
                }`}
                placeholder=" "
                id="recipeName"
              />
              <label
                htmlFor="recipeName"
                className={`absolute top-0 transition-all duration-300 origin-0 pt-[.9rem] ${
                  errors.recipeName ? 'text-red-500' : ''
                }`}
              >
                Recipe Name
              </label>
              {errors.recipeName && (
                <p className="text-sm text-red-500">
                  {errors.recipeName.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3 mb-2 flex-wrap">
            {/* //info */}
            <div className="w-full md:flex-1">
              <p className="mb-2 text-lg text-black-500 dark:text-white-500">
                Info
              </p>
              <div className="text-sm  mb-6 ">
                <div className={`relative ${errors.difficulty ? '' : ''}`}>
                  <select
                    {...register('difficulty')}
                    id="difficulty"
                    className={`block w-full px-0 pt-4 pb-3 border-0 border-b focus:ring-0 focus:border-black focus:outline-none ${
                      errors.difficulty
                        ? 'border-red-500 text-red-500'
                        : 'border-green-500'
                    }`}
                  >
                    <option value="" hidden>
                      Select Difficulty
                    </option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  {errors.difficulty && (
                    <p className="text-sm text-red-500">
                      {errors.difficulty.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="relative mb-2">
                  <input
                    type="text"
                    {...register('cuisine')}
                    className={`block w-full px-0 pt-4 pb-1 border-0 border-b focus:ring-0 focus:border-black focus:outline-none ${
                      errors.cuisine ? 'border-red-500' : 'border-green-500'
                    }`}
                    placeholder=" "
                    id="cuisine"
                  />
                  <label
                    htmlFor="cuisine"
                    className={`absolute top-0 transition-all duration-300 origin-0 pt-[.9rem] ${
                      errors.cuisine ? 'text-red-500' : ''
                    }`}
                  >
                    Cuisine
                  </label>
                  {errors.cuisine && (
                    <p className="text-sm text-red-500">
                      {errors.cuisine.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label
                  className="inline-block hover:cursor-pointer w-24"
                  htmlFor="vegan"
                >
                  Vegan
                </label>
                <input
                  {...register('vegan')}
                  className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-green-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-green-500 checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                  type="checkbox"
                  value=""
                  id="vegan"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label
                  className="inline-block hover:cursor-pointer w-24"
                  htmlFor="vegetarian"
                >
                  Vegetarian
                </label>
                <input
                  {...register('vegetarian')}
                  className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-green-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-green-500 checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                  type="checkbox"
                  value=""
                  id="vegetarian"
                />
              </div>
            </div>

            {/* //cooking times */}
            <div className="text-lg text-black-500 dark:text-white-500 w-full md:flex-1">
              <p className=" mb-2">Cooking times</p>
              <div
                className={`relative mb-6 ${
                  errors.prepTime ? '' : 'mb-[1.25rem]'
                }`}
              >
                <input
                  {...register('prepTime', {
                    setValueAs: (value) => parseFloat(value),
                  })}
                  className={`block w-full px-0 pt-4 pb-[.15rem] border-0 border-b focus:ring-0 focus:border-black custom-focus focus:outline-none ${
                    errors.prepTime ? 'border-red-500' : 'border-green-500'
                  }`}
                  type="number"
                  placeholder=" "
                  id="prepTime"
                />
                <label
                  htmlFor="prepTime"
                  className={`absolute top-0 transition-all duration-300 origin-0 mt-4 text-base ${
                    errors.prepTime ? 'text-red-500' : ''
                  }`}
                >
                  Preparation Time (±)
                </label>
                {errors.prepTime && (
                  <p className="text-sm text-red-500">
                    {errors.prepTime.message}
                  </p>
                )}
              </div>
              <div className="relative mb-2">
                <input
                  type="number"
                  {...register('cookTime', {
                    setValueAs: (value) => parseFloat(value),
                  })}
                  className={`block w-full px-0 pt-4 pb-1 border-0 border-b focus:ring-0 focus:border-black focus:outline-none ${
                    errors.cookTime ? 'border-red-500' : 'border-green-500'
                  }`}
                  placeholder=" "
                  id="cookTime"
                  style={{ height: '45px' }}
                />
                <label
                  htmlFor="co"
                  className={`absolute top-0 transition-all duration-300 origin-0 pt-[.9rem] text-base ${
                    errors.cookTime ? 'text-red-500' : ''
                  }`}
                >
                  Cooking Time (±)
                </label>
                {errors.cookTime && (
                  <p className="text-sm text-red-500">
                    {errors.cookTime.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* // description */}
          <div className="text-lg text-black-500 dark:text-white-500 ">
            <h3 className="mb-2 text-xl">Description</h3>
            <p className="text-sm font-normal">
              <textarea
                {...register('recipeDescription')}
                placeholder="Recipe Description"
                wrap="soft"
                rows={3}
                className="border-0 border-b border-green-500 px-3 py-2 w-full focus:outline-none"
              />
              {errors.recipeDescription && (
                <span className="text-red-500 text-sm">
                  {errors.recipeDescription.message}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
