import {
  faCheck,
  faEarthEurope,
  faLock,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import EditSvg from '@/assets/EditSvg';
import { type RecipeById } from '@/queries/types';
import { formatTime } from '@/utils';

type HeaderSectionProps = Omit<
  RecipeById,
  | '_id'
  | 'imageSrc'
  | 'ingredients'
  | 'labels'
  | 'portions'
  | 'steps'
  | 'nutrition'
> & {
  recipeId: string;
};

export const HeaderSection = ({
  name,
  recipeAuthor,
  isAuthor,
  difficulty,
  cuisine,
  vegan,
  vegetarian,
  timeToCook,
  description,
  recipeId,
  visibility,
}: HeaderSectionProps) => {
  return (
    <div className="border-b border-gray2-500 mb-4">
      <div className="flex mb-6">
        <div className="w-full">
          <div className="flex">
            <h1 className="text-2xl font-bold text-black-500 dark:text-white-500 flex-2 mb-4">
              {name}{' '}
              <span className="text-sm text-gray-500 dark:text-white-500">
                by {recipeAuthor}
              </span>{' '}
            </h1>
            {isAuthor && (
              <div className="flex justify-end items-start flex-auto">
                {/* <button className="text-green-500 text-sm font-semibold flex items-center"> */}
                <Link
                  to={`/recipe/${recipeId}/edit`}
                  className="text-green-500 text-sm font-semibold flex items-center"
                >
                  <EditSvg height={24} width={24} className="sm:mr-2" />{' '}
                  <span className="hidden sm:contents">Edit Recipe</span>
                </Link>
                {/* </button> */}
              </div>
            )}
          </div>
          {/* Visibility */}
          {isAuthor && (
            <div className="flex gap-3 mb-2">
              <p className="text-sm text-black-500 dark:text-white-500">
                Visibility:
                <span className="text-green-500 ml-2">
                  <FontAwesomeIcon
                    size="lg"
                    icon={visibility?.public ? faEarthEurope : faLock}
                    color="var(--green)"
                  />
                </span>
              </p>
            </div>
          )}
          <div className="flex gap-3 mb-2">
            {/* //info */}
            <div className="flex-1">
              <p className="mb-2 text-lg text-black-500 dark:text-white-500">
                Info
              </p>
              <p className="text-sm  mb-2 text-brownGrey-500 dark:text-white-500">
                Difficulty:
                <span> {difficulty}</span>
              </p>
              <p className="text-sm  mb-2 text-brownGrey-500 dark:text-white-500">
                Cuisine:
                <span> {cuisine}</span>
              </p>
              <p className="text-sm mb-2 text-brownGrey-500 dark:text-white-500 flex gap-1">
                Vegan:
                <span className="items-center inline-flex">
                  {' '}
                  {vegan ? (
                    <FontAwesomeIcon
                      size="xs"
                      icon={faCheck}
                      color="var(--green)"
                    />
                  ) : (
                    <FontAwesomeIcon size="xs" icon={faX} color="var(--red)" />
                  )}
                </span>
              </p>
              <p className="text-sm mb-2 text-brownGrey-500 dark:text-white-500 flex gap-1">
                Vegetarian:
                <span className="items-center inline-flex">
                  {' '}
                  {vegetarian ? (
                    <FontAwesomeIcon
                      size="xs"
                      icon={faCheck}
                      color="var(--green)"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faX} color="var(--red)" size="xs" />
                  )}
                </span>
              </p>
            </div>

            {/* //cooking times */}
            <div className="text-lg text-black-500 dark:text-white-500 flex-1">
              <p className=" mb-2">Cooking times</p>
              <p className="text-sm  mb-2 text-brownGrey-500 dark:text-white-500">
                Preparation Time (±)
                <span> {formatTime(timeToCook.Prep || 0)}</span>
              </p>
              <p className="text-sm  mb-2 text-brownGrey-500 dark:text-white-500">
                Cooking Time (±)
                <span> {formatTime(timeToCook.Cook || 0)}</span>
              </p>
            </div>
          </div>
          {/* // description */}
          <div className="text-lg text-black-500 dark:text-white-500 ">
            <h3 className="mb-2 text-xl">Description</h3>
            <p className="text-sm font-normal">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
