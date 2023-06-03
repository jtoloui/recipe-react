import { useCallback, useEffect, useState } from 'react';

import { Card } from '@/components/Card';
import { Carousel, CarouselData } from '@/components/Carousel';
import { Layout } from '@/components/Layout';
import { useRecipeLabels, useRecipesByLabel } from '@/queries';
import Skeleton from 'react-loading-skeleton';

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
      }[]
  >([]);

  const carouselDataCallback = useCallback(() => {
    if (recipeLabels) {
      const newData = recipeLabels.labelCounts.map((label) => ({
        image: `https://source.unsplash.com/random/800x800/?${label.label}-food`,
        title: label.label,
        count: label.count,
      }));
      setCarouselData((prevData) => [
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
  console.log(carouselData);

  return (
    <Layout>
      <div>
        <div className="flex w-full">
          <h1 className="text-2xl font-bold text-black flex-1 ">Welcome</h1>
          <div className="flex justify-end items-center  flex-auto">
            <button className=" border-green  border-2 py-1 px-[0.625rem] rounded">
              <span className="text-green text-sm font-semibold">
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
      <div className="w-full rounded-lg bg-white p-5 flex gap-7 flex-wrap ">
        {recipeCardData.map((recipe) => (
          <Card
            key={recipe.to}
            image={recipe.image}
            title={recipe.title}
            to={recipe.to}
          />
        ))}
      </div>
    </Layout>
  );
};
