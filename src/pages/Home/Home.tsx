import { useCallback, useEffect, useState } from 'react';
import { Link, createSearchParams, useSearchParams } from 'react-router-dom';
import { useWindowSize } from 'usehooks-ts';

import { Card, FeaturedCard } from '@/components/Card';
import { Chip } from '@/components/Chip';
import {
  LabelCarousel,
  type LabelCarouselItem,
} from '@/components/LabelCarousel';
import { Layout } from '@/components/Layout';
import { useRecipes } from '@/queries';
import { Labels } from '@/queries/types';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams(
    createSearchParams({
      label: 'All',
    })
  );
  const size = useWindowSize();

  const [selectedCarouselCard, setSelectedCarouselCard] = useState<string>(
    searchParams.get('label') || 'All'
  );
  const [carouselData, setCarouselData] = useState<LabelCarouselItem[]>([]);

  const search = searchParams.get('search') || '';
  const labels = searchParams.get('label') || '';
  const { data: recipesMeta, refetch } = useRecipes(false, search, labels);

  const [recipeCardData, setRecipeCardData] = useState<
    | []
    | {
        image: string;
        title: string;
        to: string;
        totalTime: string;
        ingredientsCount: number;
        recipeId: string;
      }[]
  >([]);

  useEffect(() => {
    if (selectedCarouselCard) {
      const labelEvent = new CustomEvent('homeSearch', {
        detail: {
          label: selectedCarouselCard,
          search: searchParams.get('search') || '',
        },
      });
      window.dispatchEvent(labelEvent);
    }
  }, [selectedCarouselCard, searchParams]);

  const initializeLabelCounts = (allLabels: Labels[]) => {
    const labelCounts: { [key: string]: Labels } = {};
    allLabels.forEach(({ label, count, image }) => {
      labelCounts[label] = {
        count: count,
        label: label,
        image,
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
        image: labelCounts[label].image,
      }; // Reset to 0 as a base for available counts
    });

    // Now, update counts based on availableLabels
    availableLabels.forEach(({ label, count }) => {
      if (label in labelCounts) {
        labelCounts[label] = {
          count: count,
          label: label,
          image: labelCounts[label].image,
        };
      }
    });

    return labelCounts;
  };

  const carouselDataCallback = useCallback(() => {
    // Rebuild even when nothing matches, so counts drop to 0 instead of
    // showing the previous search's numbers.
    if (recipesMeta?.meta && recipesMeta.meta.allLabels?.length > 0) {
      const initialCount = initializeLabelCounts(recipesMeta.meta.allLabels);

      const updatedCount = updateAvailableLabelCounts(
        initialCount,
        recipesMeta.meta.availableLabels
      );

      const newData = Object.keys(updatedCount).map((key) => {
        return {
          image: updatedCount[key].image,
          title: key,
          count: updatedCount[key].count,
        };
      });

      setCarouselData(() => [
        {
          image: Object.values(updatedCount)[0]?.image,
          title: 'All',
          count: recipesMeta.meta.totalRecipesMatching,
        }, // Ensure the default object is always the first item
        ...newData,
      ]);
    }
  }, [recipesMeta?.meta, recipesMeta?.recipes]);

  useEffect(() => {
    if (recipesMeta?.meta) {
      carouselDataCallback();
    }
  }, [carouselDataCallback, recipesMeta?.meta]);

  const cardRecipeDataCallback = useCallback(() => {
    if (recipesMeta?.recipes) {
      const newData = recipesMeta.recipes.map((recipe) => ({
        image: recipe.image.src,
        title: recipe.name,
        to: `/recipe/${recipe._id}`,
        totalTime: recipe.timeToCook.totalTime,
        ingredientsCount: recipe.ingredients?.length || 0,
        recipeId: recipe._id,
      }));
      setRecipeCardData(newData);
    }
    return;
  }, [recipesMeta?.recipes]);

  useEffect(() => {
    if (recipesMeta?.recipes) {
      cardRecipeDataCallback();
    }
  }, [cardRecipeDataCallback, recipesMeta?.recipes]);

  return (
    <Layout>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-black-500 dark:text-white-500 tracking-tight">
              Discover recipes
            </h1>
            <p className="mt-1 text-sm text-brownishGrey-600 dark:text-white-600">
              Browse by label or search for something to cook.
            </p>
          </div>
          <Link
            to={'/create-recipe'}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white-500 shadow-sm transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          >
            <span className="text-base leading-none">+</span> Create recipe
          </Link>
        </div>
        <LabelCarousel
          data={carouselData}
          selected={selectedCarouselCard}
          onSelect={(title) => {
            setSearchParams((params) => {
              params.set('label', title);
              return params;
            });
            setSelectedCarouselCard(title);
          }}
        />
      </div>
      {size.width < 768 && searchParams.has('search') && (
        <Chip
          text={`Search: ${search}`}
          handleOnClick={(e) => {
            e.preventDefault();
            setSearchParams((params) => {
              const nextParams = new URLSearchParams(params);
              nextParams.delete('search');
              return nextParams;
            });
            refetch();
          }}
        />
      )}
      {size.width < 768 && searchParams.has('label') && (
        <Chip text={`Label: ${selectedCarouselCard}`} />
      )}
      {recipesMeta && recipesMeta.recipes.length === 0 && (
        <p className="mt-6 rounded-xl border border-dashed border-gray2-500 bg-white-500 p-6 text-center text-sm text-brownishGrey-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white-600">
          No recipes match{search ? ` “${search}”` : ''}. Try a different search
          or label.
        </p>
      )}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[220px] gap-5">
        {recipeCardData.map((recipe, index) =>
          index === 0 ? (
            <FeaturedCard
              key={recipe.to}
              image={recipe.image}
              title={recipe.title}
              to={recipe.to}
              ingredientsCount={recipe.ingredientsCount}
              totalTime={recipe.totalTime}
              recipeId={recipe.recipeId}
            />
          ) : (
            <Card
              key={recipe.to}
              image={recipe.image}
              title={recipe.title}
              to={recipe.to}
              ingredientsCount={recipe.ingredientsCount}
              totalTime={recipe.totalTime}
              recipeId={recipe.recipeId}
            />
          )
        )}
      </div>
    </Layout>
  );
};
