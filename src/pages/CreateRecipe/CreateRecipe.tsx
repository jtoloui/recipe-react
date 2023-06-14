import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useLoaderData, useParams } from 'react-router-dom';

import { CreateRecipeFormData, createRecipeSchema } from '@/Forms';
import { IngredientIcon } from '@/assets/IngredientIcon';
import { Button } from '@/components/Button';
// import IngredientSVG from '@/assets/images/ingredients-for-cooking-svgrepo-com.svg';
import { Image } from '@/components/Elements';
import { Layout } from '@/components/Layout';
import { fetchRecipeByIdQuery } from '@/queries';

type RecipeByIdParams = {
  recipeId: string;
};
export const CreateRecipe = () => {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<CreateRecipeFormData>({
    resolver: zodResolver(createRecipeSchema),
  });

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

  const onSubmit = (data: CreateRecipeFormData) => console.log(data);
  const onError = (errors: any) => console.log(errors);
  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* <!-- Box 1 --> */}
          <div className="md:col-span-1 md:row-span-3 rounded-lg bg-white-500 dark:bg-slate-700 h-80 p-5">
            {/* <Image
            src={`https://source.unsplash.com/random/800x800/?${data?.name}-food`}
            fallbackSrc={`https://source.unsplash.com/random/800x800/?${data?.name}-food`}
            className="w-full h-full object-cover"
            alt={data?.name || ''}
          /> */}
          </div>
          {/* <!-- Box 2 --> */}
          <div className="md:col-span-2 rounded-lg bg-white-500 dark:bg-slate-700 p-5">
            {/* <!-- Heading --> */}
            {/* <!-- Description --> */}
            <div className="border-b border-gray2-500 mb-4">
              <div className="flex mb-6">
                <div className="w-full">
                  <div className="flex">
                    <h1 className="text-2xl font-bold text-black-500 dark:text-white-500 flex-2 mb-4">
                      <input
                        {...register('recipeName')}
                        placeholder="Recipe Name"
                        type="text"
                        className="border-0 border-b border-green-500 px-3 py-2 w-full"
                      />
                      {errors.recipeName && (
                        <p className="text-red-500 text-sm font-normal">
                          {errors.recipeName.message}
                        </p>
                      )}
                    </h1>
                  </div>
                  <div className="flex gap-3 mb-2 flex-wrap">
                    {/* //info */}
                    <div className="md:flex-1">
                      <p className="mb-2 text-lg text-black-500 dark:text-white-500">
                        Info
                      </p>
                      <div className="text-sm  mb-2 text-brownGrey-500 dark:text-white-500">
                        <div className="flex gap-2 items-center">
                          Difficulty:
                          <select
                            {...register('difficulty')}
                            className=" border-0 border-b  border-green-500 py-1 w-1/2 text-black-500"
                          >
                            <option value="">Select Difficulty</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>
                        {errors.difficulty && (
                          <span className="text-red-500">
                            Difficulty is required
                          </span>
                        )}
                      </div>
                      <div className="text-sm  mb-2  items-center text-brownGrey-500 dark:text-white-500">
                        <div className="flex gap-2 items-center">
                          Cuisine:
                          <input
                            {...register('cuisine')}
                            placeholder="e.g. Italian, Mexican, etc."
                            className="border-b border-green-500 px-3 py-2 w-1/2 text-black-500"
                          />
                        </div>
                        {errors.cuisine && (
                          <span className="text-red-500 text-sm">
                            {errors.cuisine.message}
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-2 text-brownGrey-500 dark:text-white-500 flex gap-2 items-center">
                        Vegan:
                        <input
                          {...register('vegetarian')}
                          type="checkbox"
                          className="rounded
                          border-gray-300
                          text-green-500
                          shadow-sm
                          focus:border-indigo-300
                          focus:ring
                          focus:ring-offset-0
                          focus:ring-indigo-200
                          focus:ring-opacity-50"
                        />
                      </p>
                      <p className="text-sm mb-2 text-brownGrey-500 dark:text-white-500 flex gap-2 items-center">
                        Vegetarian:
                        <input
                          {...register('vegan')}
                          type="checkbox"
                          className="rounded
                          border-gray-300
                          text-green-500
                          shadow-sm
                          focus:border-indigo-300
                          focus:ring
                          focus:ring-offset-0
                          focus:ring-indigo-200
                          focus:ring-opacity-50"
                        />
                      </p>
                    </div>

                    {/* //cooking times */}
                    <div className="text-lg text-black-500 dark:text-white-500 md:flex-1">
                      <p className=" mb-2">Cooking times</p>
                      <p className="text-sm  mb-2 text-brownGrey-500 dark:text-white-500 flex items-center gap-2">
                        Preparation Time (±)
                        <input
                          {...register('prepTime', {
                            setValueAs: (value) => parseFloat(value),
                          })}
                          type="number"
                          placeholder="e.g. 30 (minutes)"
                          className="border-0  border-b px-3 py-2 w-1/2  border-green-500 text-black-500"
                        />
                      </p>
                      {errors.prepTime && (
                        <span className="text-red-500 text-sm">
                          {errors.prepTime.message}
                        </span>
                      )}
                      <p className="text-sm  mb-2 text-brownGrey-500 dark:text-white-500 flex items-center gap-2">
                        Cooking Time (±)
                        <input
                          {...register('cookTime', {
                            setValueAs: (value) => parseFloat(value),
                          })}
                          type="number"
                          placeholder="e.g. 30 (minutes)"
                          className="border-0 border-b px-3 py-2 w-1/2  border-green-500 text-black-500"
                        />
                      </p>
                      {errors.cookTime && (
                        <span className="text-red-500 text-sm">
                          {errors.cookTime.message}
                        </span>
                      )}
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
                        className="border-0 border-b border-green-500 px-3 py-2 w-full"
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

            {/* <!-- Ingredients --> */}
            <div>
              <h1 className="text-base font-bold text-black-500 dark:text-white-500 mb-4">
                Ingredients
              </h1>
              <div className="flex">
                <div className="flex flex-wrap">
                  {ingredientFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex space-x-2 mb-2 w-full flex-wrap"
                    >
                      <input
                        {...register(`ingredients.${index}.item`)}
                        placeholder="e.g flour, eggs, etc."
                        className="border-0 border-b border-green-500 px-3 py-2 flex-grow"
                      />
                      <input
                        {...register(`ingredients.${index}.measurement`)}
                        placeholder="e.g. cups, grams, etc."
                        className="border-0 border-b border-green-500 px-3 py-2 flex-grow "
                      />
                      <input
                        {...register(`ingredients.${index}.quantity`, {
                          setValueAs: (value) => parseFloat(value),
                        })}
                        type="number"
                        placeholder="Ingredient Quantity"
                        className="border-0 
											border-b border-green-500 
											px-3 py-2 flex-grow
											[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <Button
                        variant="cancelOutline"
                        onClick={() => removeIngredient(index)}
                        // className="px-3 py-2 bg-red-500 text-white rounded"
                        text="Remove"
                      />
                    </div>
                  ))}

                  <Button
                    variant="secondary"
                    onClick={() =>
                      appendIngredient({
                        item: '',
                        measurement: '',
                        quantity: 0,
                      })
                    }
                    // BclassName="px-3 py-2 bg-green-500 text-white rounded"
                    text="Add Ingredient"
                  />
                </div>

                {errors.ingredients && (
                  <span className="text-red-500 text-sm">
                    {errors.ingredients.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* <!--How to cook--> */}
          <div className="md:col-start-2 md:col-span-2 rounded-lg h-fit bg-white-500 dark:bg-slate-700 p-5">
            <h1 className="text-base font-bold mb-7 dark:text-white-500">
              How to cook
            </h1>
            <div className="flex flex-wrap">
              {stepFields.map((field, index) => (
                <div key={field.id} className="flex space-x-2 w-full mb-2">
                  <input
                    {...register(`steps.${index}.step`)}
                    placeholder={`e.g. Step ${index + 1}`}
                    className="border-0 border-b border-green-500 px-3 py-2 flex-grow"
                    defaultValue={field.step}
                  />
                  <Button
                    onClick={() => removeStep(index)}
                    variant="cancelOutline"
                    text="Remove"
                  />
                </div>
              ))}
              <Button
                onClick={() => appendStep({ step: '' })}
                variant="secondary"
                text="Add Step"
              />
              {/* {data?.steps.map((step, index, array) => (
              <div
                className={`flex items-center text-md text-black-500 dark:text-white-500 w-full md:w-1/2 mb-4 last:mb-0 ${
                  index === array.length - 2 &&
                  array.length % 2 === 0 &&
                  index !== 0
                    ? 'mb-4 md:mb-0'
                    : 'mb-4'
                } ${index % 2 == 0 ? 'md:pr-4' : ''}`}
                key={index}
              >
                <div className="flex w-6 h-6 items-center justify-center mr-2 border-green-500 border rounded-full">
                  <div className="text-green-500 p-2">{index + 1}</div>
                </div>
                {step}
              </div>
            ))} */}
            </div>
          </div>
          {/* <!-- Additional Information --> */}
          <div className="md:col-start-2 md:col-span-2 rounded-lg bg-white-500 dark:bg-slate-700 p-5">
            <>
              <h1 className="text-base font-bold dark:text-white-500 mb-4">
                Additional Information
              </h1>
              <div className="flex gap-3 mb-2 flex-col md:flex-row">
                <div className="flex-1">
                  <div className="mb-2 text-black-500 dark:text-white-500">
                    Nutrition Facts
                  </div>
                  <input
                    {...register('nutritionFacts.kcal', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    type="number"
                    placeholder="Calories (kcal)"
                    className="border-0 border-b border-green-500 px-3 py-2 w-full mb-2"
                  />
                  <input
                    {...register('nutritionFacts.sugars', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    type="number"
                    placeholder="Sugars (g)"
                    className="border-0 border-b border-green-500 px-3 py-2 w-full mb-2"
                  />
                  <input
                    {...register('nutritionFacts.salt', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    type="number"
                    placeholder="Salt (g)"
                    className="border-0 border-b border-green-500 px-3 py-2 w-full mb-2"
                  />
                  <input
                    {...register('nutritionFacts.carbs', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    type="number"
                    placeholder="Carbohydrates (g)"
                    className="border-0 border-b border-green-500 px-3 py-2 w-full mb-2"
                  />
                  <input
                    {...register('nutritionFacts.protein', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    type="number"
                    placeholder="Protein (g)"
                    className="border-0 border-b border-green-500 px-3 py-2 w-full mb-2"
                  />
                  <input
                    {...register('nutritionFacts.fat', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    type="number"
                    placeholder="Fat (g)"
                    className="border-0 border-b border-green-500 px-3 py-2 w-full mb-2"
                  />
                  <input
                    {...register('nutritionFacts.saturates', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    type="number"
                    placeholder="Saturated Fat (g)"
                    className="border-0 border-b border-green-500 px-3 py-2 w-full mb-2"
                  />
                  <input
                    {...register('nutritionFacts.fibre', {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    type="number"
                    placeholder="Fibre (g)"
                    className="border-0 border-b border-green-500 px-3 py-2 w-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-2 text-black-500 dark:text-white-500">
                    Labels
                  </div>
                  <input
                    {...register('labels', {
                      setValueAs: (value: string) => value.split(','),
                    })}
                    placeholder="Labels (comma separated)"
                    className="border-0 border-b border-green-500 px-3 py-2 w-full"
                  />
                  {/* {!data?.labels ? (
                  <div className="text-sm mb-2 text-brownGrey-500 dark:text-white-500">
                    No labels available
                  </div>
                ) : (
                  <>
                    {data?.labels.map((label, index) => (
                      <p
                        className="text-sm mb-2 text-brownGrey-500 dark:text-white-500"
                        key={index}
                      >
                        - {label}
                      </p>
                    ))}
                  </>
                )} */}
                  <div className="mt-2 mb-2 text-black-500 dark:text-white-500">
                    Portions
                  </div>
                  <div className="text-sm mb-2 text-brownGrey-500 dark:text-white-500">
                    <input
                      {...register('portionSize', {
                        setValueAs: (value) => parseFloat(value),
                      })}
                      type="number"
                      placeholder="Portion Size (person)"
                      className="border-0 border-b border-green-500 px-3 py-2 w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end w-full">
                <Button variant="primary" text="Create Recipe" type="submit" />
              </div>
            </>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default CreateRecipe;
