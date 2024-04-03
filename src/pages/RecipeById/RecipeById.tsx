import { useQuery } from '@tanstack/react-query';
import { useLoaderData, useParams } from 'react-router-dom';

import { IngredientIcon } from '@/assets/IngredientIcon';
// import IngredientSVG from '@/assets/images/ingredients-for-cooking-svgrepo-com.svg';
import { Image } from '@/components/Elements';
import { Layout } from '@/components/Layout';
import { fetchRecipeByIdQuery } from '@/queries';
import { Ingredient } from '@/queries/types';

import { type loader } from '.';
import { HeaderSection } from './components/HeaderSection';

type RecipeByIdParams = {
  recipeId: string;
};
const RecipeById = () => {
  const params = useParams<RecipeByIdParams>();
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >;

  const { data } = useQuery({
    ...fetchRecipeByIdQuery(params?.recipeId || ''),
    initialData,
  });

  const getMarginClass = (array: Ingredient[], index: number) => {
    // if the index is the second to last item and the array length is even, it will have no margin bottom on md and above
    if (index === array.length - 2 && array.length % 2 === 0) {
      return 'mb-4 md:mb-0';
    }
    // if the index is the first item, it will have margin bottom on below md
    else if (index === 0) {
      return 'mb-4';
    }
    // the last item always have no margin bottom
    else if (index === array.length - 1) {
      return 'mb-0';
    }
    // all other cases will have margin bottom
    else {
      return 'mb-4';
    }
  };

  if (!data) return null;

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* <!-- Box 1 --> */}
        <div className="md:col-span-1 md:row-span-3 rounded-lg bg-white-500 dark:bg-slate-700 h-80 p-5">
          <Image
            src={data.image.src}
            fallbackSrc={`https://source.unsplash.com/random/800x800/?${data?.name}-food`}
            className="w-full h-full object-cover rounded"
            alt={data?.name || ''}
          />
        </div>
        {/* <!-- Box 2 --> */}
        <div className="md:col-span-2 rounded-lg bg-white-500 dark:bg-slate-700 p-5">
          {/* <!-- Heading --> */}
          {/* <!-- Description --> */}
          <HeaderSection recipeId={params.recipeId || ''} {...data} />

          {/* <!-- Ingredients --> */}
          <div>
            <h1 className="text-base font-bold text-black-500 dark:text-white-500 mb-4">
              Ingredients
            </h1>
            <div className="flex">
              <div className="flex flex-wrap w-full">
                {data?.ingredients?.map((ingredient, index, array) => (
                  <div
                    className={`flex items-center text-sm text-black-500 dark:text-white-500 w-full md:w-1/2 last:mb-0 ${getMarginClass(
                      array,
                      index
                    )}`}
                    // className={`flex items-center text-sm text-black-500 dark:text-white-500 w-full md:w-1/2 last:mb-0 ${
                    //   index === array.length - 2 &&
                    //   array.length % 2 === 0 &&
                    //   index !== 0
                    //     ? 'mb-4 md:mb-0'
                    //     : 'mb-4'
                    // }`}
                    key={index}
                  >
                    {/* <Image
                      src={``}
                      fallbackSrc={IngredientSVG}
                      alt={ingredient.item}
                      className="w-12 h-12 mr-2 rounded-full fill-green-500"
                    /> */}
                    <IngredientIcon className="w-8 h-8 mr-2 fill-green-500 dark:fill-white-500" />
                    {`${ingredient.item} - ${ingredient.quantity} ${ingredient.measurement}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* <!--How to cook--> */}
        <div className="md:col-start-2 md:col-span-2 rounded-lg h-fit bg-white-500 dark:bg-slate-700 p-5">
          <h1 className="text-base font-bold mb-7 dark:text-white-500">
            How to cook
          </h1>
          <div className="flex flex-wrap">
            {data?.steps.map((step, index, array) => (
              <div
                className={`flex items-center text-md text-black-500 dark:text-white-500 w-full md:w-1/2 mb-4 last:mb-0 ${
                  index === array.length - 2 &&
                  array.length % 2 === 0 &&
                  index !== 0
                    ? 'mb-4 md:mb-0'
                    : 'mb-4'
                } ${index % 2 == 0 ? 'md:pr-4' : ''}`}
                key={index}
              >
                <div className="flex w-6 h-6 items-center justify-center mr-2 border-green-500 border rounded-full">
                  <div className="text-green-500 p-2">{index + 1}</div>
                </div>
                {step}
              </div>
            ))}
          </div>
        </div>
        {/* <!-- Additional Information --> */}
        <div className="md:col-start-2 md:col-span-2 rounded-lg bg-white-500 dark:bg-slate-700 p-5">
          <>
            <h1 className="text-base font-bold dark:text-white-500 mb-4">
              Additional Information
            </h1>
            <div className="flex gap-3 mb-2 flex-col md:flex-row">
              <div className="flex-1">
                <div className="mb-2 text-black-500 dark:text-white-500">
                  Nutrition Facts
                </div>
                {!data?.nutrition ? (
                  <div className="text-sm mb-2 text-brownGrey-500 dark:text-white-500">
                    No nutrition facts available
                  </div>
                ) : (
                  <>
                    {data?.nutrition.kcal && (
                      <p className="text-sm mb-2 text-brownGrey-500 dark:text-white-500">
                        - Calories: {data?.nutrition.kcal}kcal
                      </p>
                    )}
                    {data?.nutrition.protein && (
                      <p className="text-sm mb-2 text-brownGrey-500 dark:text-white-500">
                        - Protein: {data?.nutrition.protein}g
                      </p>
                    )}
                    {data?.nutrition.fat && (
                      <p className="text-sm mb-2 text-brownGrey-500 dark:text-white-500">
                        - Fat: {data?.nutrition.fat}g
                      </p>
                    )}

                    {data?.nutrition.carbs && (
                      <p className="text-sm mb-2 text-brownGrey-500 dark:text-white-500">
                        - Carbs: {data?.nutrition.carbs}g
                      </p>
                    )}

                    {data?.nutrition.fibre && (
                      <p className="text-sm mb-2 text-brownGrey-500 dark:text-white-500">
                        - Fiber: {data?.nutrition.fibre}g
                      </p>
                    )}

                    {data?.nutrition.sugars && (
                      <p className="text-sm mb-2 text-brownGrey-500 dark:text-white-500">
                        - Sugar: {data?.nutrition.sugars}g
                      </p>
                    )}

                    {data?.nutrition.salt && (
                      <p className="text-sm mb-2 text-brownGrey-500 dark:text-white-500">
                        - Salt: {data?.nutrition.salt}g
                      </p>
                    )}

                    {data?.nutrition.saturates && (
                      <p className="text-sm mb-2 text-brownGrey-500 dark:text-white-500">
                        - Saturates: {data?.nutrition.saturates}g
                      </p>
                    )}
                  </>
                )}
              </div>
              <div className="flex-1">
                <div className="mb-2 text-black-500 dark:text-white-500">
                  Labels
                </div>
                {!data?.labels ? (
                  <div className="text-sm mb-2 text-brownGrey-500 dark:text-white-500">
                    No labels available
                  </div>
                ) : (
                  <>
                    {data?.labels.map((label, index) => (
                      <p
                        className="text-sm mb-2 text-brownGrey-500 dark:text-white-500"
                        key={index}
                      >
                        - {label}
                      </p>
                    ))}
                  </>
                )}
                <div className="mt-2 mb-2 text-black-500 dark:text-white-500">
                  Portions
                </div>
                <div className="text-sm mb-2 text-brownGrey-500 dark:text-white-500">
                  - Portions size: {data?.portions || 'N/A'}
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeById;
