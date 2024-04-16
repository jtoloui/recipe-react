import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { Blob } from 'buffer';
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

  // setValue('image', data.imageSrc);
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
    // isIdle: createRecipeIsIdle,
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

  return (
    <Layout>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* <!-- Box 1 --> */}
            <div className="md:col-span-1 md:row-span-3 rounded-lg bg-white-500 dark:bg-slate-700 h-80 p-5">
              <ImageUpload
                {...(formType === 'update'
                  ? { existingImage: updatedFormData?.image.src }
                  : {})}
              />
            </div>

            {/* <!-- Box 2 --> */}
            <div className="md:col-span-2 rounded-lg bg-white-500 dark:bg-slate-700 p-5">
              {/* <!-- Heading --> */}
              <BasicInfo />

              {/* <!-- Ingredients --> */}
              <Ingredients />
            </div>
            {/* <!--How to cook--> */}
            <Instructions />

            {/* <!-- Additional Information --> */}
            <AdditionalInformation
              submitText={
                formType === 'create' ? 'Create Recipe' : 'Update Recipe'
              }
            />
          </div>
        </form>
      </FormProvider>
    </Layout>
  );
};

export default CreateUpdateRecipe;
