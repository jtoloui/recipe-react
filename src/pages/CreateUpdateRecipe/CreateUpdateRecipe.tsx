import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useEffect } from 'react';
import {
  FieldErrors,
  FormProvider,
  UseFormSetValue,
  useForm,
} from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { CreateRecipeFormData, createRecipeSchema } from '@/Forms';
import {
  AdditionalInformation,
  BasicInfo,
  Ingredients,
  Instructions,
} from '@/Forms/Recipe';
import { Layout } from '@/components/Layout';
import { useProfile, useRecipeById } from '@/queries';
import { CreateRecipeResponse, RecipeByIdResponse } from '@/queries/types';
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
const updateRecipe = async (newRecipe: CreateRecipeFormData, id: string) => {
  const formData = new FormData();

  formData.append('imageSrc', newRecipe.image);
  formData.append('jsonData', JSON.stringify(newRecipe));
  const { data } = await axiosInstanceFormData.put<CreateRecipeResponse>(
    `/api/recipes/${id}`,
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

type Props = {
  formType?: 'create' | 'update';
};

const formDefaultValues = (
  data: RecipeByIdResponse,
  setValue: UseFormSetValue<CreateRecipeFormData>
) => {
  axios
    .get(data.image.src, { responseType: 'blob' })
    .then((response: AxiosResponse<Blob>) => {
      const dataBlob = response.data as unknown as BlobPart;
      const file = new File([dataBlob], data.image.originalName, {
        type: response.data.type,
      });

      setValue('image', file);
    });

  setValue('recipeName', data.name);
  setValue('recipeDescription', data.description);
  setValue('vegetarian', data.vegetarian);
  setValue('vegan', data.vegan);
  setValue('difficulty', data.difficulty);
  setValue('cuisine', data.cuisine);
  setValue('prepTime', data.timeToCook.Prep);
  setValue('cookTime', data.timeToCook.Cook);
  setValue('visibility', data.visibility?.public ? 'public' : 'private');
  setValue(
    'steps',
    data.steps.map((step) => ({ step }))
  );
  setValue(
    'ingredients',
    data.ingredients.map((ingredient) => ({
      item: ingredient.item,
      measurement: ingredient.measurement,
      quantity: ingredient.quantity,
    }))
  );

  setValue('labels', data.labels);
  setValue('portionSize', parseInt(data.portions));
};

export const CreateUpdateRecipe = ({ formType = 'create' }: Props) => {
  const navigate = useNavigate();

  const params = useParams<{ recipeId: string }>();

  const { refetch, data: updatedFormData } = useRecipeById(
    params?.recipeId || '',
    false
  );

  const { data: profileData } = useProfile();

  useEffect(() => {
    if (formType === 'update' && params.recipeId) {
      refetch();
    }
  }, [formType, params.recipeId, refetch]);

  useEffect(() => {
    if (
      formType === 'update' &&
      updatedFormData?.creatorId !== profileData?.id
    ) {
      navigate(`/recipe/${params.recipeId}`);
    }
  }, [updatedFormData, profileData, navigate, params.recipeId, formType]);

  const {
    data: createRecipeData,
    isError: createRecipeIsError,
    isSuccess: createRecipeIsSuccess,
    isPending: createRecipeIsPending,
    mutate: createRecipeMutate,
  } = useMutation({
    mutationFn: (data: CreateRecipeFormData) => {
      if (formType === 'create') {
        return createRecipe(data);
      }
      return updateRecipe(data, params?.recipeId || '');
    },
  });

  const methods = useForm<CreateRecipeFormData>({
    resolver: zodResolver(createRecipeSchema),
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    if (formType === 'update' && updatedFormData) {
      formDefaultValues(updatedFormData, setValue);
    }
  }, [formType, updatedFormData, setValue]);

  const onSubmit = async (data: CreateRecipeFormData) => {
    try {
      createRecipeMutate(data);
    } catch (error) {
      console.log(error);
    }
  };
  const onError = (errors: FieldErrors<CreateRecipeFormData>) =>
    console.log(errors);

  useEffect(() => {
    if (createRecipeIsSuccess && !createRecipeIsError) {
      const { _id } = createRecipeData;
      navigate(`/recipe/${_id}`);
    }
  }, [createRecipeIsSuccess, createRecipeIsError, createRecipeData, navigate]);

  const submitText = formType === 'create' ? 'Create recipe' : 'Update recipe';
  const pageTitle = formType === 'create' ? 'Create recipe' : 'Edit recipe';

  // Back/Cancel must NOT use navigate(-1): right after login the previous
  // history entry is /login (or /welcome), so history-back kicks the user
  // back to the auth screen. Go to a stable destination instead — the recipe
  // detail in edit mode, home in create mode.
  const handleBack = () => {
    if (formType === 'update' && params.recipeId) {
      navigate(`/recipe/${params.recipeId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Layout>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          {/*
           * Sticky header — sits just below the fixed nav.
           * nav is ~72 px tall, so top-[72px] keeps it pinned beneath it.
           * -mx offsets cancel the Layout padding so the bar bleeds full-width.
           * -mt-12 cancels the Layout pt-28 breathing room so the bar sits flush
           * under the nav instead of leaving a ~40px gap below it.
           */}
          <header className="sticky top-[72px] z-20 -mt-12 -mx-5 md:-mx-8 px-5 md:px-8 py-3 mb-8 bg-white-500/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-gray2-400 dark:border-slate-700 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={handleBack}
                className="shrink-0 flex items-center gap-1.5 text-sm font-semibold text-brownishGrey-600 hover:text-green-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>
              <span className="h-5 w-px bg-gray2-500 dark:bg-slate-600 shrink-0" />
              <h1 className="truncate text-base md:text-lg font-bold text-black-500 dark:text-white-500">
                {pageTitle}
              </h1>
            </div>
          </header>

          {/* Workspace — bottom padding clears the fixed save bar */}
          <div className="pb-28 space-y-5">

            {/* Cover + Basics — equal-height columns */}
            <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.9fr)] gap-5 items-stretch">
              <div className="bg-white-500 dark:bg-slate-700 rounded-xl border border-gray2-400 dark:border-slate-600 shadow-sm p-5 flex flex-col">
                <h2 className="text-xs font-bold uppercase tracking-wider text-brownishGrey-600 dark:text-white-700 mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold">00</span>
                  Cover photo
                </h2>
                <div className="flex-1 min-h-[180px]">
                  <ImageUpload
                    {...(formType === 'update'
                      ? { existingImage: updatedFormData?.image.src }
                      : {})}
                  />
                </div>
              </div>

              <BasicInfo />
            </section>

            {/* Ingredients | Method */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              <Ingredients />
              <Instructions />
            </section>

            {/* Labels + Nutrition */}
            <AdditionalInformation />
          </div>

          {/* Sticky save bar */}
          <div className="fixed bottom-0 inset-x-0 z-20 bg-white-500/95 dark:bg-slate-800/95 backdrop-blur-sm border-t border-gray2-400 dark:border-slate-700 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
            <div className="max-w-screen-xl mx-auto px-5 md:px-8 py-3 flex items-center justify-between gap-3">
              <p className="hidden sm:block text-xs text-brownishGrey-600 dark:text-white-700 truncate">
                {createRecipeIsError ? (
                  <span className="text-red-500">Something went wrong — please try again.</span>
                ) : (
                  <span>Fill in all required fields, then save.</span>
                )}
              </p>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-lg border border-gray2-500 dark:border-slate-600 text-brownishGrey-700 dark:text-white-600 bg-white-500 dark:bg-slate-700 hover:border-green-400 hover:text-green-600 font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createRecipeIsPending}
                  className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white-500 font-bold text-sm shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createRecipeIsPending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Saving…
                    </span>
                  ) : submitText}
                </button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </Layout>
  );
};

export default CreateUpdateRecipe;
