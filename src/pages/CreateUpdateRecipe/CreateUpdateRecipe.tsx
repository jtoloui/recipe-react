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

  return (
    <Layout>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          {/* Sticky header */}
          <header className="sticky top-0 z-20 -mx-5 md:-mx-8 px-5 md:px-8 py-3 mb-6 bg-white-500/90 dark:bg-slate-800/90 backdrop-blur border-b border-gray2-400 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-brownishGrey-600 hover:text-green-500 flex items-center gap-1 text-sm font-semibold"
              >
                ← Back
              </button>
              <span className="h-5 w-px bg-gray2-500 dark:bg-slate-600" />
              <h1 className="text-lg md:text-xl font-bold text-black-500 dark:text-white-500">
                {pageTitle}
              </h1>
            </div>
          </header>

          {/* Workspace */}
          <div className="pb-24 space-y-6">
            {/* Cover + Basics */}
            <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1.85fr)] gap-6">
              <div className="bg-white-500 dark:bg-slate-700 rounded-lg shadow-md p-5">
                <h2 className="text-sm font-bold text-charcoal-500 dark:text-white-500 mb-3">
                  Cover photo
                </h2>
                <div className="min-h-72">
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
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <Ingredients />
              <Instructions />
            </section>

            {/* Labels + Nutrition */}
            <AdditionalInformation />
          </div>

          {/* Sticky save bar */}
          <div className="fixed bottom-0 inset-x-0 z-20 bg-white-500/95 dark:bg-slate-800/95 backdrop-blur border-t border-gray2-400 dark:border-slate-700">
            <div className="w-full px-5 md:px-8 py-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2 rounded-lg shadow-md border-2 border-green-500 text-green-600 bg-white-500 dark:bg-slate-700 hover:bg-green-500 hover:text-white-500 font-bold text-sm transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createRecipeIsPending}
                className="px-5 py-2 rounded-lg shadow-md border-2 border-green-500 bg-green-500 text-white-500 hover:bg-white-500 hover:text-green-600 font-bold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {createRecipeIsPending ? 'Saving…' : submitText}
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </Layout>
  );
};

export default CreateUpdateRecipe;
