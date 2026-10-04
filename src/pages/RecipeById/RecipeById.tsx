import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { IngredientIcon } from '@/assets/IngredientIcon';
import { Image, LogoLoader } from '@/components/Elements';
import { Layout } from '@/components/Layout';
import { fetchRecipeByIdQuery } from '@/queries';
import type { Nutrition } from '@/queries/types';

import { type loader } from '.';
import { CookMode } from './components/CookMode';
import { HeaderSection } from './components/HeaderSection';

type RecipeByIdParams = {
  recipeId: string;
};

const NUTRITION_FIELDS: {
  key: keyof Nutrition;
  label: string;
  unit: string;
}[] = [
  { key: 'kcal', label: 'Calories', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
  { key: 'carbs', label: 'Carbs', unit: 'g' },
  { key: 'fibre', label: 'Fibre', unit: 'g' },
  { key: 'sugars', label: 'Sugar', unit: 'g' },
  { key: 'salt', label: 'Salt', unit: 'g' },
  { key: 'saturates', label: 'Saturates', unit: 'g' },
];

const Panel = ({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`rounded-2xl border border-gray2-400 bg-white-500 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-700 ${
      className ?? ''
    }`}
  >
    {title && (
      <h2 className="mb-4 text-lg font-bold text-black-500 dark:text-white-500">
        {title}
      </h2>
    )}
    {children}
  </section>
);

/** Friendly name for the page the user arrived from. */
const backLabel = (from?: string) => {
  const path = from?.split('?')[0];
  if (path === '/my-recipes') return 'My Recipes';
  if (path === '/favourites') return 'Favourites';
  return 'Home';
};

const RecipeById = () => {
  const params = useParams<RecipeByIdParams>();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from;
  // Came from a list in the app: real browser back (keeps scroll + filters).
  // Shared/direct link: no in-app history, so go Home instead of off-site.
  const handleBack = () => (from ? navigate(-1) : navigate('/'));
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;

  const { data } = useQuery({
    ...fetchRecipeByIdQuery(params?.recipeId || ''),
    initialData,
  });

  const [cookMode, setCookMode] = useState(false);

  const [nutritionBasis, setNutritionBasis] = useState<'serving' | 'recipe'>(
    'serving'
  );

  if (!data) return null;

  const hasPerRecipe = !!data.nutritionPerRecipe;
  const nutrition =
    nutritionBasis === 'recipe' && data.nutritionPerRecipe
      ? data.nutritionPerRecipe
      : data.nutrition;
  const availableNutrition = NUTRITION_FIELDS.filter(
    (f) => nutrition && Number(nutrition[f.key])
  );

  return (
    <Layout>
      {cookMode && (
        <CookMode
          title={data.name}
          ingredients={data.ingredients}
          steps={data.steps}
          onClose={() => setCookMode(false)}
        />
      )}

      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold text-brownishGrey-600 transition-colors hover:text-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40 dark:text-white-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to {backLabel(from)}
        </button>
        <button
          onClick={() => setCookMode(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white-500 shadow-sm transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/40"
        >
          <FontAwesomeIcon icon={faUtensils} />
          Cook mode
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Hero image — spans full width on mobile, left rail on desktop */}
        <div className="lg:col-span-1">
          {/* aspect-ratio (not a fixed height) keeps crops close to the photo's
              shape; object-cover + object-center fills the frame from the middle. */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray2-400 shadow-sm dark:border-slate-700 lg:sticky lg:top-28 lg:aspect-square">
            <Image
              src={data.image.src}
              placeholder={<LogoLoader size={80} />}
              className="h-full w-full object-cover object-center"
              alt={data?.name || ''}
            />
          </div>
        </div>

        {/* Header + ingredients */}
        <Panel className="lg:col-span-2">
          <HeaderSection recipeId={params.recipeId || ''} {...data} />

          <h2 className="mb-4 text-lg font-bold text-black-500 dark:text-white-500">
            Ingredients
          </h2>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {data?.ingredients?.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-center gap-3 rounded-lg bg-lightBg-500 px-3 py-2 text-sm text-black-500 dark:bg-slate-600 dark:text-white-500"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-subtleAccent dark:bg-slate-500">
                  <IngredientIcon className="h-4 w-4 fill-green-600 dark:fill-white-500" />
                </span>
                <span>
                  <span className="font-semibold">{ingredient.item}</span>
                  <span className="text-brownishGrey-600 dark:text-white-600">
                    {' '}
                    — {ingredient.quantity} {ingredient.measurement}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* How to cook — numbered steps */}
        <Panel title="How to cook" className="lg:col-start-2 lg:col-span-2">
          <ol className="space-y-3">
            {data?.steps.map((step, index) => (
              <li
                key={index}
                className="flex gap-3 text-sm text-black-500 dark:text-white-500"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white-500">
                  {index + 1}
                </span>
                <span className="pt-1 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </Panel>

        {/* Additional info — nutrition + labels/portions */}
        <Panel
          title="Additional information"
          className="lg:col-start-2 lg:col-span-2"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Nutrition */}
            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brownishGrey-600 dark:text-white-600">
                  Nutrition facts
                  <span className="ml-2 text-xs font-normal normal-case tracking-normal text-brownishGrey-500">
                    (
                    {nutritionBasis === 'serving'
                      ? 'per serving'
                      : 'whole recipe'}
                    )
                  </span>
                </h3>
                {hasPerRecipe && (
                  <div className="inline-flex rounded-lg border border-gray2-400 dark:border-slate-600 overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => setNutritionBasis('serving')}
                      className={`px-2 py-1 font-medium ${
                        nutritionBasis === 'serving'
                          ? 'bg-green-500 text-white-500'
                          : 'bg-transparent text-brownishGrey-600 dark:text-white-600'
                      }`}
                    >
                      Per serving
                    </button>
                    <button
                      type="button"
                      onClick={() => setNutritionBasis('recipe')}
                      className={`px-2 py-1 font-medium ${
                        nutritionBasis === 'recipe'
                          ? 'bg-green-500 text-white-500'
                          : 'bg-transparent text-brownishGrey-600 dark:text-white-600'
                      }`}
                    >
                      Whole recipe
                    </button>
                  </div>
                )}
              </div>
              {availableNutrition.length === 0 ? (
                <p className="text-sm text-brownishGrey-600 dark:text-white-600">
                  No nutrition facts available
                </p>
              ) : (
                <dl className="grid grid-cols-2 gap-2">
                  {availableNutrition.map((f) => (
                    <div
                      key={f.key}
                      className="rounded-lg bg-lightBg-500 p-3 dark:bg-slate-600"
                    >
                      <dt className="text-xs font-medium text-brownishGrey-600 dark:text-white-600">
                        {f.label}
                      </dt>
                      <dd className="text-base font-bold text-black-500 dark:text-white-500">
                        {String(nutrition![f.key])}
                        {f.unit}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {/* Labels + portions */}
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-brownishGrey-600 dark:text-white-600">
                Labels
              </h3>
              {!data?.labels || data.labels.length === 0 ? (
                <p className="text-sm text-brownishGrey-600 dark:text-white-600">
                  No labels available
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data.labels.map((label, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-subtleAccent px-3 py-1 text-sm font-medium text-green-600 dark:bg-slate-600 dark:text-white-500"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}

              <h3 className="mb-2 mt-5 text-sm font-bold uppercase tracking-wider text-brownishGrey-600 dark:text-white-600">
                Portions
              </h3>
              <p className="text-sm font-medium text-black-500 dark:text-white-500">
                {data?.portions ? `Serves ${data.portions}` : 'N/A'}
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </Layout>
  );
};

export default RecipeById;
