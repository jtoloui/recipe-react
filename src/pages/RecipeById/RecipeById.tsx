import { useQuery } from '@tanstack/react-query';
import { useLoaderData, useParams } from 'react-router-dom';

import { IngredientIcon } from '@/assets/IngredientIcon';
import { Image, LogoLoader } from '@/components/Elements';
import { Layout } from '@/components/Layout';
import { fetchRecipeByIdQuery } from '@/queries';
import type { Nutrition } from '@/queries/types';

import { type loader } from '.';
import { HeaderSection } from './components/HeaderSection';

type RecipeByIdParams = {
  recipeId: string;
};

const NUTRITION_FIELDS: { key: keyof Nutrition; label: string; unit: string }[] = [
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

const RecipeById = () => {
  const params = useParams<RecipeByIdParams>();
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;

  const { data } = useQuery({
    ...fetchRecipeByIdQuery(params?.recipeId || ''),
    initialData,
  });

  if (!data) return null;

  const nutrition = data.nutrition;
  const availableNutrition = NUTRITION_FIELDS.filter(
    (f) => nutrition && Number(nutrition[f.key])
  );

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Hero image — spans full width on mobile, left rail on desktop */}
        <div className="lg:col-span-1">
          <div className="relative h-64 overflow-hidden rounded-2xl border border-gray2-400 shadow-sm dark:border-slate-700 lg:sticky lg:top-28 lg:h-80">
            <Image
              src={data.image.src}
              placeholder={<LogoLoader size={80} />}
              className="h-full w-full object-cover"
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
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-brownishGrey-600 dark:text-white-600">
                Nutrition facts
              </h3>
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
