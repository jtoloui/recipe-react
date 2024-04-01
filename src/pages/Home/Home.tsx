import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Card } from '@/components/Card';
import { Carousel, type CarouselData } from '@/components/Carousel';
import { Layout } from '@/components/Layout';
import { useRecipes, useRecipesByLabel } from '@/queries';
import { Labels } from '@/queries/types';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    label: 'All',
  });
  const [selectedCarouselCard, setSelectedCarouselCard] = useState<string>(
    searchParams.get('label') || 'All'
  );

  const { data: recipesMeta, refetch } = useRecipes(
    searchParams.get('search') || '',
    searchParams.get('label') || ''
  );
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

  useEffect(() => {
    if (selectedCarouselCard) {
      refetch();
    }
  }, [selectedCarouselCard, refetch]);

  const initializeLabelCounts = (allLabels: Labels[]) => {
    const labelCounts: { [key: string]: Labels } = {};
    allLabels.forEach(({ label, count }) => {
      labelCounts[label] = {
        count: count,
        label: label,
      };
    });
    return labelCounts;
  };

  const updateAvailableLabelCounts = (
    labelCounts: { [key: string]: Labels },
    availableLabels: Labels[]
  ) => {
    // Reset counts to 0 to reflect the new search/filter context
    Object.keys(labelCounts).forEach((label) => {
      labelCounts[label] = {
        count: 0,
        label: label,
      }; // Reset to 0 as a base for available counts
    });

    // Now, update counts based on availableLabels
    availableLabels.forEach(({ label, count }) => {
      if (label in labelCounts) {
        labelCounts[label] = {
          count: count,
          label: label,
        };
      }
    });

    return labelCounts;
  };

  const carouselDataCallback = useCallback(() => {
    if (recipesMeta?.meta) {
      const initialCount = initializeLabelCounts(recipesMeta.meta.allLabels);

      const updatedCount = updateAvailableLabelCounts(
        initialCount,
        recipesMeta.meta.availableLabels
      );

      const newData = Object.keys(updatedCount).map((key) => {
        return {
          image: `https://source.unsplash.com/random/800x800/?${key}-food`,
          title: key,
          count: updatedCount[key].count,
        };
      });

      setCarouselData(() => [
        {
          image: 'https://source.unsplash.com/random/800x800?food',
          title: 'All',
          count: recipesMeta.meta.totalRecipesMatching,
        }, // Ensure the default object is always the first item
        ...newData,
      ]);
    }
  }, [recipesMeta?.meta]);

  useEffect(() => {
    if (recipesMeta?.meta) {
      carouselDataCallback();
    }
  }, [carouselDataCallback, recipesMeta?.meta]);

  const cardRecipeDataCallback = useCallback(() => {
    if (recipesMeta?.recipes) {
      const newData = recipesMeta.recipes.map((recipe) => ({
        image: recipe.imageSrc,
        title: recipe.name,
        to: `/recipe/${recipe._id}`,
        totalTime: recipe.timeToCook.totalTime,
        ingredientsCount: recipe.ingredients?.length || 0,
      }));
      setRecipeCardData(newData);
    }
    return;
  }, [recipesMeta?.recipes]);

  useEffect(() => {
    if (recipeByLabel) {
      cardRecipeDataCallback();
    }
  }, [cardRecipeDataCallback, recipeByLabel]);

  // const createRecipeFormMethods = useForm<CreateRecipeFormData>({
  //   resolver: zodResolver(createRecipeSchema),
  // });

  // const {
  //   handleSubmit,
  //   formState: { errors, isSubmitting },
  // } = createRecipeFormMethods;

  // const onSubmit = (data) => console.log(data);

  return (
    <Layout>
      <div>
        <div className="flex w-full">
          <h1 className="text-2xl font-bold text-black-500 dark:text-white-500 flex-1 ">
            Welcome
          </h1>
          <div className="flex justify-end items-center  flex-auto">
            <Link
              to={'/create-recipe'}
              className=" border-green-500  border-2 py-1 px-[0.625rem] rounded"
              // onClick={() => (true)}
            >
              <span className="text-green-500 text-sm font-semibold">
                + Create Recipe
              </span>
            </Link>
          </div>
        </div>
        <Carousel
          data={carouselData}
          defaultIndex={carouselData.findIndex(
            (card) => card.title === selectedCarouselCard
          )}
          onCardClick={(title) => {
            setSearchParams((params) => {
              params.set('label', title);
              return params;
            });
            setSelectedCarouselCard(title);
          }}
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
    </Layout>
  );
};
