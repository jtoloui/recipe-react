import { useLoaderData, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from 'react-query';

import { Image } from '@/components/Elements';
import { Layout } from '@/components/Layout';
import EditSvg from '@/assets/EditSvg';
import { fetchRecipeByIdQuery } from '@/queries';
import { formatTime } from '@/utils';
import { type loader } from '.';

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

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* <!-- Box 1 --> */}
        <div className="md:col-span-1 md:row-span-3 rounded-lg bg-white h-80 p-5">
          <Image
            src={data?.imageSrc || ''}
            fallbackSrc={`https://source.unsplash.com/random/800x800/?${data?.name}-food`}
            className="w-full h-full object-cover"
          />
        </div>
        {/* <!-- Box 2 --> */}
        <div className="md:col-span-2 rounded-lg bg-white p-5">
          {/* <!-- Heading --> */}
          <div className="border-b border-gray2 mb-4">
            <div className="flex mb-6">
              <div className="w-full">
                <div className="flex">
                  <h1 className="text-2xl font-bold text-black flex-2 mb-4">
                    {data?.name}{' '}
                    <span className="text-sm text-gray-500">
                      by {data?.recipeAuthor}
                    </span>{' '}
                  </h1>
                  {data?.isAuthor && (
                    <div className="flex justify-end items-start flex-auto">
                      <button className="text-green text-sm font-semibold flex items-center">
                        <EditSvg height={24} width={24} />{' '}
                        <span className=" ml-2 ">Edit Recipe</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 mb-2">
                  {/* //info */}
                  <div className="flex-1">
                    <p className="mb-2 text-lg text-black">Info</p>
                    <p className="text-sm  mb-2 text-brownGrey">
                      Difficulty:
                      <span> {data?.difficulty}</span>
                    </p>
                    <p className="text-sm  mb-2 text-brownGrey">
                      Cuisine:
                      <span> {data?.cuisine}</span>
                    </p>
                    <p className="text-sm  mb-2 text-brownGrey">
                      Vegan:
                      <span>
                        {' '}
                        {data?.vegan ? (
                          <FontAwesomeIcon
                            size="xs"
                            icon={faCheck}
                            color="var(--green)"
                          />
                        ) : (
                          <FontAwesomeIcon
                            size="xs"
                            icon={faX}
                            color="var(--red)"
                          />
                        )}
                      </span>
                    </p>
                    <p className="text-sm  mb-2 text-brownGrey">
                      Vegetarian:
                      <span>
                        {' '}
                        {data?.vegetarian ? (
                          <FontAwesomeIcon
                            size="xs"
                            icon={faCheck}
                            color="var(--green)"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faX}
                            color="var(--red)"
                            size="xs"
                          />
                        )}
                      </span>
                    </p>
                  </div>

                  {/* //cooking times */}
                  <div className="text-lg text-black flex-1">
                    <p className=" mb-2">Cooking times</p>
                    <p className="text-sm  mb-2 text-brownGrey">
                      Preparation Time (±)
                      <span> {formatTime(data?.timeToCook?.Prep || 0)}</span>
                    </p>
                    <p className="text-sm  mb-2 text-brownGrey">
                      Cooking Time (±)
                      <span> {formatTime(data?.timeToCook?.Cook || 0)}</span>
                    </p>
                  </div>
                </div>
                {/* // description */}
                <div className="text-lg text-black ">
                  <h3 className="mb-2 text-xl">Description</h3>
                  <p className="text-sm font-normal">{data?.description}</p>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Ingredients --> */}
          <div>
            <h1 className="text-base font-bold text-black mb-4">Ingredients</h1>
            <div className="flex">
              <div className="flex flex-wrap">
                {data?.ingredients?.map((ingredient, index, array) => (
                  <div
                    className={`flex items-center text-sm text-black dark:text-white w-full md:w-1/2 last:mb-0 ${
                      index === array.length - 2 &&
                      array.length % 2 === 0 &&
                      index !== 0
                        ? 'mb-4 md:mb-0'
                        : 'mb-4'
                    }`}
                    key={index}
                  >
                    <Image
                      src="https://source.unsplash.com/random/800x800/?food"
                      fallbackSrc="https://source.unsplash.com/random/800x800/?food"
                      alt="food"
                      className="w-12 h-12 mr-2 rounded-full"
                    />
                    {`${ingredient.item} - ${ingredient.quantity} ${ingredient.measurement}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Box 3 --> */}
        <div className="md:col-start-2 md:col-span-2 rounded-lg h-fit bg-white p-5">
          <h1 className="text-base font-bold mb-7">How to cook</h1>
          <div className="flex flex-wrap">
            {data?.steps.map((step, index, array) => (
              <div
                className={`flex items-center text-md text-black dark:text-white w-full md:w-1/2 mb-4 last:mb-0 ${
                  index === array.length - 2 &&
                  array.length % 2 === 0 &&
                  index !== 0
                    ? 'mb-4 md:mb-0'
                    : 'mb-4'
                }`}
                key={index}
              >
                <div className="flex items-center justify-center w-6 h-6 mr-2 border-green border rounded-full">
                  <span className="text-green">{index + 1}</span>
                </div>
                {step}
              </div>
            ))}
          </div>
        </div>
        {/* <!-- Box 4 --> */}
        <div className="md:col-start-2 md:col-span-2 rounded-lg bg-white p-5">
          <h1 className="text-base font-bold">Additional Information</h1>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeById;
