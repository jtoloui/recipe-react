import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Options } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { CreateRecipeFormData, createRecipeSchema } from '@/Forms';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { usePopularLabels, usePopularMeasurements } from '@/queries';
import { CreateRecipeResponse } from '@/queries/types';
import { axiosInstanceFormData } from '@/utils';

import { ImageUpload } from './Components';

const createRecipe = async (newRecipe: CreateRecipeFormData) => {
  const formData = new FormData();

  formData.append('imageSrc', newRecipe.image);
  formData.append('jsonData', JSON.stringify(newRecipe));
  const { data } = await axiosInstanceFormData.post<CreateRecipeResponse>(
    `/api/recipes`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    }
  );

  return data;
};

export const CreateRecipe = () => {
  const navigate = useNavigate();
  const {
    data: createRecipeData,
    isError: createRecipeIsError,
    isSuccess: createRecipeIsSuccess,
    // isIdle: createRecipeIsIdle,
    mutate: createRecipeMutate,
  } = useMutation({
    mutationFn: createRecipe,
  });
  const [selectedOption, setSelectedOption] = useState<
    Options<{ value: string; label: string }>
  >([
    { value: 'grams', label: 'Grams' },
    { value: 'cups', label: 'Cups' },
    { value: 'tablespoons', label: 'Tablespoons' },
  ]);
  const [selectedLabelOption, setSelectedLabelOption] = useState<
    Options<{ value: string; label: string }>
  >([]);

  const [labelValues, setLabelValues] = useState<
    Options<{
      value: string;
      label: string;
    }>
  >([]);

  const methods = useForm<CreateRecipeFormData>({
    resolver: zodResolver(createRecipeSchema),
  });
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = methods;

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

  const onSubmit = async (data: CreateRecipeFormData) => {
    try {
      createRecipeMutate(data);
    } catch (error) {
      console.log(error);
    }
  };
  const onError = (errors: any) => console.log(errors);

  const { data, isFetching, error } = usePopularMeasurements();
  const {
    data: popularLabelData,
    isFetching: popularLabelsIsFetching,
    error: popularLabelsError,
  } = usePopularLabels();

  useEffect(() => {
    if (createRecipeIsSuccess && !createRecipeIsError) {
      const { _id } = createRecipeData;
      navigate(`/recipe/${_id}`);
    }
  }, [createRecipeIsSuccess, createRecipeIsError, createRecipeData, navigate]);

  useEffect(() => {
    if (!isFetching && !error && data?.measurements) {
      const options: Options<{
        value: string;
        label: string;
      }> = data.measurements.map((measurement) => ({
        value: measurement,
        label: measurement,
      }));
      setSelectedOption(options);
    }
  }, [isFetching, error, data]);

  useEffect(() => {
    if (
      !popularLabelsIsFetching &&
      !popularLabelsError &&
      popularLabelData?.labels
    ) {
      const options: Options<{
        value: string;
        label: string;
      }> = popularLabelData.labels.map((labels) => ({
        value: labels,
        label: labels,
      }));
      setSelectedLabelOption(options);
    }
  }, [popularLabelsIsFetching, popularLabelsError, popularLabelData]);

  return (
    <Layout>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* <!-- Box 1 --> */}
            <div className="md:col-span-1 md:row-span-3 rounded-lg bg-white-500 dark:bg-slate-700 h-80 p-5">
              <ImageUpload />
            </div>

            {/* <!-- Box 2 --> */}
            <div className="md:col-span-2 rounded-lg bg-white-500 dark:bg-slate-700 p-5">
              {/* <!-- Heading --> */}
              <div className="border-b border-gray2-500 mb-4">
                <div className="flex mb-6">
                  <div className="w-full">
                    <div className="flex">
                      <div className="relative mb-2 w-full">
                        <input
                          type="text"
                          {...register('recipeName')}
                          className={`block w-full px-0 pt-4 pb-1 border-0 border-b focus:ring-0 focus:border-black focus:outline-none ${
                            errors.recipeName
                              ? 'border-red-500'
                              : 'border-green-500'
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
                          <div
                            className={`relative ${
                              errors.difficulty ? '' : ''
                            }`}
                          >
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
                                errors.cuisine
                                  ? 'border-red-500'
                                  : 'border-green-500'
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
                          className={`relative ${
                            errors.prepTime ? '' : 'mb-[1.25rem]'
                          }`}
                        >
                          <input
                            {...register('prepTime', {
                              setValueAs: (value) => parseFloat(value),
                            })}
                            className={`block w-full px-0 pt-4 pb-[.15rem] border-0 border-b focus:ring-0 focus:border-black custom-focus focus:outline-none ${
                              errors.prepTime
                                ? 'border-red-500'
                                : 'border-green-500'
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
                              errors.cookTime
                                ? 'border-red-500'
                                : 'border-green-500'
                            }`}
                            placeholder=" "
                            id="cookTime"
                          />
                          <label
                            htmlFor="cookTime"
                            className={`absolute top-0 transition-all duration-300 origin-0 pt-2 mt-2 text-base ${
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

              {/* <!-- Ingredients --> */}
              <div>
                <h1 className="text-base font-bold text-black-500 dark:text-white-500 mb-4">
                  Ingredients
                </h1>
                <div className="flex flex-col space-y-4">
                  {ingredientFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 flex-wrap"
                    >
                      <div className="flex flex-col flex-grow lg:flex-basis-0">
                        <input
                          {...register(`ingredients.${index}.item`)}
                          placeholder="e.g flour, eggs, etc."
                          className={`border-b px-3 py-2 ${
                            errors.ingredients &&
                            errors.ingredients[index]?.item
                              ? 'border-red-500'
                              : 'border-green-500'
                          }`}
                        />
                        {errors.ingredients &&
                          errors.ingredients[index]?.item && (
                            <span className="text-red-500 text-sm">
                              {errors.ingredients[index]?.item?.message}
                            </span>
                          )}
                      </div>
                      <div className="flex flex-col flex-grow lg:flex-basis-0">
                        <Controller
                          name={`ingredients.${index}.measurement`}
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <CreatableSelect
                              {...field}
                              options={selectedOption}
                              placeholder="Choose or add measurement"
                              styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  border: 'none',
                                  flexGrow: 1,
                                  minWidth: '10rem',
                                  marginBottom: '0.18rem',
                                  borderBottom: `${
                                    errors.ingredients &&
                                    errors.ingredients[index]?.measurement
                                      ? '1px solid var(--red)'
                                      : '1px solid var(--green)'
                                  }`,
                                  borderRadius: 'none',
                                  boxShadow: 'none',
                                  overflow: 'visible',
                                  height: '30px',
                                  zIndex: 999,
                                  '&:hover': {
                                    border: 'none',
                                    borderBottom: `${
                                      errors.ingredients &&
                                      errors.ingredients[index]?.measurement
                                        ? '1px solid var(--red)'
                                        : '1px solid var(--green)'
                                    }`,
                                    borderRadius: 'none',
                                    boxShadow: 'none',
                                  },
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 9999,
                                }),
                                container: (provided) => ({
                                  ...provided,
                                  flexGrow: 1,
                                }),
                                placeholder: (provided) => ({
                                  ...provided,
                                  textOverflow: 'ellipsis',
                                  width: '100%',
                                }),
                                menuList: (provided) => ({
                                  ...provided,
                                  maxHeight: '10rem',
                                  overflow: 'scroll',
                                }),
                                option: (provided, state) => ({
                                  ...provided,
                                  backgroundColor: state.isSelected
                                    ? 'var(--green)'
                                    : 'var(--white)',
                                  color: state.isSelected
                                    ? 'var(--white)'
                                    : 'var(--black)',
                                  '&:hover': {
                                    backgroundColor: state.isSelected
                                      ? 'var(--green)'
                                      : 'var(--green)',
                                    color: state.isSelected
                                      ? 'var(--white)'
                                      : 'var(--white)',
                                  },
                                }),
                              }}
                              className="mt-[0.18rem] react-select-container "
                              classNamePrefix="react-select"
                              onChange={(option) =>
                                field.onChange(option?.value || '')
                              }
                              value={selectedOption.find(
                                (option) => option.value === field.value
                              )}
                            />
                          )}
                        />
                        {errors.ingredients &&
                          errors.ingredients[index]?.measurement && (
                            <span className="text-red-500 text-sm">
                              {errors.ingredients[index]?.measurement?.message}
                            </span>
                          )}
                      </div>
                      <div className="flex flex-col flex-grow lg:flex-basis-0">
                        <input
                          {...register(`ingredients.${index}.quantity`, {
                            setValueAs: (value) => parseFloat(value),
                          })}
                          type="number"
                          placeholder="Quantity"
                          className={`border-b px-3 py-2 appearance-none ${
                            errors.ingredients &&
                            errors.ingredients[index]?.quantity
                              ? 'border-red-500'
                              : 'border-green-500'
                          }`}
                        />
                        {errors.ingredients &&
                          errors.ingredients[index]?.quantity && (
                            <span className="text-red-500 text-sm">
                              {errors.ingredients[index]?.quantity?.message}
                            </span>
                          )}
                      </div>
                      <div>
                        <Button
                          variant="cancelOutline"
                          onClick={() => removeIngredient(index)}
                          text="Remove"
                          type="button"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    onClick={() =>
                      appendIngredient({
                        item: '',
                        measurement: '',
                        quantity: null as unknown as number,
                      })
                    }
                    text="Add Ingredient"
                    type="button"
                  />

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

              <div className="flex flex-col space-y-4 overflow-auto">
                {stepFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 flex-wrap"
                  >
                    <div className="flex flex-col flex-grow lg:flex-basis-0">
                      <input
                        {...register(`steps.${index}.step`)}
                        placeholder={`e.g. Step ${index + 1}`}
                        className={`border-b px-3 py-2 ${
                          errors.steps && errors.steps[index]
                            ? 'border-red-500'
                            : 'border-green-500'
                        }`}
                        defaultValue={field.step}
                      />

                      {errors.steps && errors.steps[index] && (
                        <span className="text-red-500 text-sm">
                          {errors.steps[index]?.step?.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Button
                        variant="cancelOutline"
                        onClick={() => removeStep(index)}
                        text="Remove"
                        type="button"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="secondary"
                  onClick={() => appendStep({ step: '' })}
                  text="Add Step"
                  type="button"
                />

                {errors.steps && (
                  <span className="text-red-500 text-sm">
                    {errors.steps.message}
                  </span>
                )}
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
                    <div className="mb-4 text-black-500 dark:text-white-500">
                      Nutrition Facts
                    </div>

                    <div className="relative mb-2 w-full">
                      <input
                        {...register('nutritionFacts.kcal', {
                          setValueAs: (v) =>
                            v === '' ? undefined : parseInt(v, 10),
                        })}
                        className={`block w-full px-0 pt-4 pb-1 border-0 border-b border-green-500 focus:ring-0 focus:border-black `}
                        placeholder=" "
                        type="number"
                        id="kcal"
                      />
                      <label
                        htmlFor="kcal"
                        className={`absolute top-0 transition-all duration-300 origin-0  mt-2`}
                      >
                        Calories (kcal)
                      </label>
                    </div>

                    <div className="relative mb-2 mt-4 w-full">
                      <input
                        type="number"
                        {...register('nutritionFacts.sugars', {
                          setValueAs: (v) =>
                            v === '' ? undefined : parseInt(v, 10),
                        })}
                        className={`block w-full px-0 pt-4 pb-1 border-0 border-b border-green-500 focus:ring-0 focus:border-black `}
                        placeholder=" "
                        id="sugars"
                      />
                      <label
                        htmlFor="sugars"
                        className={`absolute top-0 transition-all duration-300 origin-0  mt-2`}
                      >
                        Sugars (g)
                      </label>
                    </div>

                    <div className="relative mb-2 mt-4 w-full">
                      <input
                        type="number"
                        {...register('nutritionFacts.salt', {
                          setValueAs: (v) =>
                            v === '' ? undefined : parseInt(v, 10),
                        })}
                        className={`block w-full px-0 pt-4 pb-1 border-0 border-b border-green-500 focus:ring-0 focus:border-black `}
                        placeholder=" "
                        id="salt"
                      />
                      <label
                        htmlFor="salt"
                        className={`absolute top-0 transition-all duration-300 origin-0  mt-2`}
                      >
                        Salt (g)
                      </label>
                    </div>

                    <div className="relative mb-2 mt-4 w-full">
                      <input
                        type="number"
                        {...register('nutritionFacts.carbs', {
                          setValueAs: (v) =>
                            v === '' ? undefined : parseInt(v, 10),
                        })}
                        className={`block w-full px-0 pt-4 pb-1 border-0 border-b border-green-500 focus:ring-0 focus:border-black `}
                        placeholder=" "
                        id="carbs"
                      />
                      <label
                        htmlFor="carbs"
                        className={`absolute top-0 transition-all duration-300 origin-0  mt-2`}
                      >
                        Carbohydrates (g)
                      </label>
                    </div>

                    <div className="relative mb-2 mt-4 w-full">
                      <input
                        type="number"
                        {...register('nutritionFacts.protein', {
                          setValueAs: (v) =>
                            v === '' ? undefined : parseInt(v, 10),
                        })}
                        className={`block w-full px-0 pt-4 pb-1 border-0 border-b border-green-500 focus:ring-0 focus:border-black `}
                        placeholder=" "
                        id="protein"
                      />
                      <label
                        htmlFor="protein"
                        className={`absolute top-0 transition-all duration-300 origin-0  mt-2`}
                      >
                        Protein (g)
                      </label>
                    </div>

                    <div className="relative mb-2 mt-4 w-full">
                      <input
                        type="number"
                        {...register('nutritionFacts.fat', {
                          setValueAs: (v) =>
                            v === '' ? undefined : parseInt(v, 10),
                        })}
                        className={`block w-full px-0 pt-4 pb-1 border-0 border-b border-green-500 focus:ring-0 focus:border-black `}
                        placeholder=" "
                        id="fat"
                      />
                      <label
                        htmlFor="fat"
                        className={`absolute top-0 transition-all duration-300 origin-0  mt-2`}
                      >
                        Fat (g)
                      </label>
                    </div>

                    <div className="relative mb-2 mt-4 w-full">
                      <input
                        type="number"
                        {...register('nutritionFacts.saturates', {
                          setValueAs: (v) =>
                            v === '' ? undefined : parseInt(v, 10),
                        })}
                        className={`block w-full px-0 pt-4 pb-1 border-0 border-b border-green-500 focus:ring-0 focus:border-black `}
                        placeholder=" "
                        id="saturates"
                      />
                      <label
                        htmlFor="saturates"
                        className={`absolute top-0 transition-all duration-300 origin-0  mt-2`}
                      >
                        Saturated Fat (g)
                      </label>
                    </div>

                    <div className="relative mb-2 mt-4 w-full">
                      <input
                        type="number"
                        {...register('nutritionFacts.fibre', {
                          setValueAs: (v) =>
                            v === '' ? undefined : parseInt(v, 10),
                        })}
                        className={`block w-full px-0 pt-4 pb-1 border-0 border-b border-green-500 focus:ring-0 focus:border-black `}
                        placeholder=" "
                        id="fibre"
                      />
                      <label
                        htmlFor="fibre"
                        className={`absolute top-0 transition-all duration-300 origin-0  mt-2`}
                      >
                        Fibre (g)
                      </label>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-[1.41rem] text-black-500 dark:text-white-500">
                      Labels
                    </div>
                    <div className="relative mb-2 mt-4 w-full">
                      <Controller
                        name={`labels`}
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                          <CreatableSelect
                            placeholder="Select or create a label"
                            isMulti
                            noOptionsMessage={() =>
                              'Type to create a label e.g. "Vegan"'
                            }
                            options={selectedLabelOption}
                            onCreateOption={(inputValue) => {
                              const labelValue =
                                inputValue.charAt(0).toUpperCase() +
                                inputValue.slice(1);
                              const newOption: {
                                value: string;
                                label: string;
                              } = {
                                value: labelValue,
                                label: labelValue,
                              };
                              setSelectedLabelOption([
                                ...selectedLabelOption,
                                newOption,
                              ]);
                              field.onChange([...field.value, labelValue]);

                              setLabelValues([...labelValues, newOption]);
                            }}
                            onChange={(option) => {
                              const labels = option.map((label) => label.value);
                              field.onChange(labels);
                              setLabelValues(option);
                            }}
                            value={labelValues}
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                border: 'none',
                                flexGrow: 1,
                                minWidth: '10rem',
                                marginBottom: '0.18rem',
                                borderBottom: `${
                                  errors.labels
                                    ? '1px solid var(--red)'
                                    : '1px solid var(--green)'
                                }`,
                                borderRadius: 'none',
                                boxShadow: 'none',
                                overflow: 'visible',
                                height: 'auto',
                                zIndex: 999,
                                '&:hover': {
                                  border: 'none',
                                  borderBottom: `${
                                    errors.labels
                                      ? '1px solid var(--red)'
                                      : '1px solid var(--green)'
                                  }`,
                                  borderRadius: 'none',
                                  boxShadow: 'none',
                                },
                              }),
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                              }),
                              menuList: (provided) => ({
                                ...provided,
                                maxHeight: '10rem',
                                overflow: 'scroll',
                              }),
                              option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected
                                  ? 'var(--green)'
                                  : 'var(--white)',
                                color: state.isSelected
                                  ? 'var(--white)'
                                  : 'var(--black)',
                                '&:hover': {
                                  backgroundColor: state.isSelected
                                    ? 'var(--green)'
                                    : 'var(--green)',
                                  color: state.isSelected
                                    ? 'var(--white)'
                                    : 'var(--white)',
                                },
                              }),
                              multiValueRemove: (provided) => ({
                                ...provided,
                                backgroundColor: 'var(--white)',
                                '&:hover': {
                                  backgroundColor: 'var(--white)',
                                },
                              }),
                              multiValue: (provided) => ({
                                ...provided,
                                backgroundColor: 'var(--white)',
                                border: '1px solid var(--green)',
                                color: 'var(--black)',
                              }),
                            }}
                          />
                        )}
                      />
                      {errors.labels && errors.labels && (
                        <p className="text-sm text-red-500">
                          {errors.labels.message}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 mb-2 text-black-500 dark:text-white-500">
                      Portions
                    </div>
                    <div className="relative mb-2 w-full">
                      <input
                        {...register('portionSize', {
                          setValueAs: (value) => parseFloat(value),
                        })}
                        type="number"
                        className={`block w-full px-0 pt-4 pb-1 border-0 border-b focus:ring-0 focus:border-black ${
                          errors.portionSize
                            ? 'border-red-500'
                            : 'border-green-500'
                        }`}
                        placeholder=" "
                        id="portionSize"
                      />
                      <label
                        htmlFor="portionSize"
                        className={`absolute top-0 transition-all duration-300 origin-0 pt-[.9rem] ${
                          errors.portionSize ? 'text-red-500' : ''
                        }`}
                      >
                        Portion Size (person)
                      </label>
                      {errors.portionSize && (
                        <p className="text-sm text-red-500">
                          {errors.portionSize.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end w-full">
                  <Button
                    variant="primary"
                    text="Create Recipe"
                    type="submit"
                    buttonClassName="sm:w-auto"
                  />
                </div>
              </>
            </div>
          </div>
        </form>
      </FormProvider>
    </Layout>
  );
};

export default CreateRecipe;
