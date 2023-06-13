import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  CreateRecipe,
  CreateRecipeFormData,
  createRecipeSchema,
} from '@/Forms';
import { Card } from '@/components/Card';
import { Carousel, type CarouselData } from '@/components/Carousel';
import { Layout } from '@/components/Layout';
import { Modal } from '@/components/Modal';
import { useRecipeLabels, useRecipesByLabel } from '@/queries';

export const Home = () => {
  const [selectedCarouselCard, setSelectedCarouselCard] =
    useState<string>('All');
  const { data: recipeLabels } = useRecipeLabels();
  const { data: recipeByLabel } = useRecipesByLabel(selectedCarouselCard);

  const [carouselData, setCarouselData] = useState<[] | CarouselData[]>([]);
  const [recipeCardData, setRecipeCardData] = useState<
    | []
    | {
        image: string;
        title: string;
        to: string;
        totalTime: string;
        ingredientsCount: number;
      }[]
  >([]);

  const [openCreateRecipeModal, setOpenCreateRecipeModal] = useState(false);

  const carouselDataCallback = useCallback(() => {
    if (recipeLabels) {
      const newData = recipeLabels.labelCounts.map((label) => ({
        image: `https://source.unsplash.com/random/800x800/?${label.label}-food`,
        title: label.label,
        count: label.count,
      }));
      setCarouselData(() => [
        {
          image: 'https://source.unsplash.com/random/800x800?food',
          title: 'All',
          count: recipeLabels.totalRecipes,
        }, // Ensure the default object is always the first item
        ...newData,
      ]);
    }
  }, [recipeLabels]);

  useEffect(() => {
    if (recipeLabels) {
      carouselDataCallback();
    }
  }, [carouselDataCallback, recipeLabels]);

  const cardRecipeDataCallback = useCallback(() => {
    if (recipeByLabel) {
      const newData = recipeByLabel.map((recipe) => ({
        image: recipe.imageSrc,
        title: recipe.name,
        to: `/recipe/${recipe._id}`,
        totalTime: recipe.totalTime,
        ingredientsCount: recipe.ingredients?.length || 0,
      }));
      setRecipeCardData(newData);
    }
    return;
  }, [recipeByLabel]);

  useEffect(() => {
    if (recipeByLabel) {
      cardRecipeDataCallback();
    }
  }, [cardRecipeDataCallback, recipeByLabel]);

  const createRecipeFormMethods = useForm<CreateRecipeFormData>({
    resolver: zodResolver(createRecipeSchema),
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = createRecipeFormMethods;

  const onSubmit = (data) => console.log(data);

  return (
    <Layout>
      <div>
        <div className="flex w-full">
          <h1 className="text-2xl font-bold text-black-500 dark:text-white-500 flex-1 ">
            Welcome
          </h1>
          <div className="flex justify-end items-center  flex-auto">
            <button
              className=" border-green-500  border-2 py-1 px-[0.625rem] rounded"
              onClick={() => setOpenCreateRecipeModal(true)}
            >
              <span className="text-green-500 text-sm font-semibold">
                + Create Recipe
              </span>
            </button>
          </div>
        </div>
        <Carousel
          data={carouselData}
          onCardClick={(title) => setSelectedCarouselCard(title)}
        />
      </div>
      <div className="mt-4 w-full rounded-lg bg-white-500 p-5 flex gap-7 flex-wrap dark:bg-slate-600 ">
        {recipeCardData.map((recipe) => (
          <Card
            key={recipe.to}
            image={recipe.image}
            title={recipe.title}
            to={recipe.to}
            ingredientsCount={recipe.ingredientsCount}
            totalTime={recipe.totalTime}
          />
        ))}
      </div>
      <Modal
        isOpen={openCreateRecipeModal}
        title="Create Recipe"
        onClose={() => setOpenCreateRecipeModal(false)}
        buttons={{
          primary: {
            label: isSubmitting ? 'Creating...' : 'Create',
            onClick: handleSubmit(
              (data) => {
                console.log(data);
              },
              (errors) => console.log(errors)
            ),
          },
          secondary: {
            label: 'Cancel',
            onClick: () => setOpenCreateRecipeModal(false),
          },
        }}
      >
        <FormProvider {...createRecipeFormMethods}>
          <CreateRecipe />
        </FormProvider>
      </Modal>
    </Layout>
  );
};
