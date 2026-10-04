import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Card } from '@/components/Card';
import { Layout } from '@/components/Layout';
import { useFavouriteRecipes } from '@/queries/useFavourites';

const HeartIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M12 21s-6.716-4.35-9.192-8.4C.92 9.512 2.03 5.75 5.6 4.8c2.06-.55 4.03.3 5.25 1.95L12 8.1l1.15-1.35C14.37 5.1 16.34 4.25 18.4 4.8c3.57.95 4.68 4.712 2.792 7.8C18.716 16.65 12 21 12 21Z"
      fill="currentColor"
    />
  </svg>
);

export const Favourites = () => {
  const { data: recipes, isPending, isError, refetch } = useFavouriteRecipes();
  const reduceMotion = useReducedMotion();
  const count = recipes?.length ?? 0;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-black-500 dark:text-white-500 md:text-3xl">
          Favourites
          <HeartIcon className="h-6 w-6 text-rose-500" />
        </h1>
        <p
          className="mt-1 text-sm text-brownishGrey-600 dark:text-white-600"
          aria-live="polite"
        >
          {isPending
            ? 'Loading your saved recipes…'
            : count > 0
            ? `${count} saved ${
                count === 1 ? 'recipe' : 'recipes'
              } — tap the heart to remove one.`
            : 'Recipes you save will appear here.'}
        </p>
      </div>

      {isPending && (
        <div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[220px]"
          aria-hidden="true"
        >
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-gray2-400 bg-white-500 dark:border-slate-700 dark:bg-slate-700"
            />
          ))}
        </div>
      )}

      {isError && !recipes && (
        <div className="rounded-xl border border-red-200 bg-white-500 p-6 text-sm text-black-500 dark:bg-slate-700 dark:text-white-500">
          We couldn't load your favourites.{' '}
          <button
            type="button"
            onClick={() => refetch()}
            className="font-semibold text-green-600 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {!isPending && recipes && count === 0 && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center rounded-2xl border border-dashed border-gray2-500 bg-white-500 px-6 py-14 text-center dark:border-slate-600 dark:bg-slate-700"
        >
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 dark:bg-slate-600">
            <HeartIcon className="h-7 w-7 text-rose-400" />
          </span>
          <h2 className="text-lg font-bold text-black-500 dark:text-white-500">
            No favourites yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-brownishGrey-600 dark:text-white-600">
            Tap the heart on any recipe to save it here for later.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white-500 shadow-sm transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          >
            Discover recipes
          </Link>
        </motion.div>
      )}

      {recipes && count > 0 && (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[220px]">
          <AnimatePresence initial={false} mode="popLayout">
            {recipes.map((recipe) => (
              <motion.li
                key={recipe._id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
                }
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                className="h-full"
              >
                <Card
                  recipeId={recipe._id}
                  image={recipe.image?.src}
                  title={recipe.name}
                  to={`/recipe/${recipe._id}`}
                  totalTime={recipe.timeToCook?.totalTime}
                  ingredientsCount={recipe.ingredients?.length || 0}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Layout>
  );
};

export default Favourites;
