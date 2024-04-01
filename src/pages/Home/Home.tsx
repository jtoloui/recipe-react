import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Card } from '@/components/Card';
import { Carousel, type CarouselData } from '@/components/Carousel';
import { Layout } from '@/components/Layout';
import { useRecipes, useRecipesByLabel } from '@/queries';

export const Home = () => {
  const [selectedCarouselCard, setSelectedCarouselCard] =
    useState<string>('All');
  const { data: recipesMeta, ...props } = useRecipes();
  const { data: recipeByLabel } = useRecipesByLabel(selectedCarouselCard);

  // console.log(props.refetch("jamie"));

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

  const carouselDataCallback = useCallback(() => {
    if (recipesMeta?.meta) {
      const newData = recipesMeta.meta.labels.map((label) => ({
        image: `https://source.unsplash.com/random/800x800/?${label.label}-food`,
        title: label.label,
        count: label.count,
      }));
      setCarouselData(() => [
        {
          image: 'https://source.unsplash.com/random/800x800?food',
          title: 'All',
          count: recipesMeta.meta.totalRecipes,
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
    </Layout>
  );
};
