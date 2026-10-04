import {
  faArrowUpRightFromSquare,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext, useWatch } from 'react-hook-form';

import { CreateRecipeFormData, isHttpUrl } from '@/Forms/CreateRecipe';

const fieldClass = (hasError?: boolean) =>
  `w-full rounded-lg border bg-white-500 dark:bg-slate-800/60 px-3 py-2.5 text-sm text-black-500 dark:text-white-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all ${
    hasError ? 'border-red-500' : 'border-gray2-500 dark:border-slate-600'
  }`;

const labelClass =
  'block text-xs font-semibold text-brownishGrey-700 dark:text-white-700 mb-1.5 uppercase tracking-wide';

const sectionHeadClass =
  'text-xs font-bold uppercase tracking-wider text-brownishGrey-600 dark:text-white-700 mb-4 flex items-center gap-2';
const sectionBadge = (n: string) =>
  `inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold shrink-0 ${n}`;

/** Diet toggle rendered as a green pill — the native checkbox is visually
 *  hidden (sr-only) but still drives RHF + a11y; the pill fills green with a
 *  check when active. Replaces the browser's default blue checkbox. */
const DietToggle = ({
  name,
  label,
}: {
  name: 'vegan' | 'vegetarian';
  label: string;
}) => {
  const { register, control } = useFormContext<CreateRecipeFormData>();
  const checked = useWatch({ control, name });

  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        checked
          ? 'border-green-500 bg-green-500 text-white-500'
          : 'border-gray2-500 bg-white-500 text-brownishGrey-700 hover:border-green-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white-600'
      }`}
    >
      <input type="checkbox" {...register(name)} className="sr-only" />
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          checked
            ? 'border-white-500 bg-white-500/20'
            : 'border-gray2-500 dark:border-slate-500'
        }`}
      >
        {checked && <FontAwesomeIcon icon={faCheck} className="text-[9px]" />}
      </span>
      {label}
    </label>
  );
};

/** Optional credit for recipes adapted from a website, book or person. */
const SourceFields = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateRecipeFormData>();
  const [name, url] = useWatch({ control, name: ['sourceName', 'sourceUrl'] });
  const previewUrl = url?.trim();
  const showPreview = !!name?.trim() && isHttpUrl(previewUrl);

  return (
    <fieldset className="sm:col-span-2 rounded-lg border border-dashed border-gray2-500 dark:border-slate-600 p-4">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-brownishGrey-700 dark:text-white-700">
        Recipe source <span className="font-normal normal-case tracking-normal text-brownishGrey-500">(optional)</span>
      </legend>
      <p className="mb-3 text-xs text-brownishGrey-600 dark:text-white-600">
        Adapted this from somewhere? Credit the original — it's shown on the recipe as a link that opens in a new tab.
        Clear both fields to remove it.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-4">
        <div>
          <label htmlFor="sourceName" className={labelClass}>
            Source name
          </label>
          <input
            id="sourceName"
            type="text"
            autoComplete="off"
            {...register('sourceName')}
            placeholder="e.g. BBC Food"
            aria-invalid={!!errors.sourceName}
            aria-describedby={errors.sourceName ? 'sourceName-error' : undefined}
            className={fieldClass(!!errors.sourceName)}
          />
          {errors.sourceName && (
            <p id="sourceName-error" className="text-xs text-red-500 mt-1">
              {errors.sourceName.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="sourceUrl" className={labelClass}>
            Link to original recipe
          </label>
          <input
            id="sourceUrl"
            type="url"
            inputMode="url"
            autoComplete="off"
            {...register('sourceUrl')}
            placeholder="https://www.example.com/recipe"
            aria-invalid={!!errors.sourceUrl}
            aria-describedby={errors.sourceUrl ? 'sourceUrl-error' : undefined}
            className={fieldClass(!!errors.sourceUrl)}
          />
          {errors.sourceUrl && (
            <p id="sourceUrl-error" className="text-xs text-red-500 mt-1">
              {errors.sourceUrl.message}
            </p>
          )}
        </div>
      </div>
      {showPreview && (
        <p className="mt-3 text-sm text-brownishGrey-600 dark:text-white-600">
          Shown as: Recipe source:{' '}
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-green-600 underline-offset-2 hover:underline dark:text-green-400"
          >
            {name?.trim()}
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </p>
      )}
    </fieldset>
  );
};

export const BasicInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateRecipeFormData>();

  return (
    <div className="bg-white-500 dark:bg-slate-700 rounded-xl border border-gray2-400 dark:border-slate-600 shadow-sm p-5 md:p-6">
      <h2 className={sectionHeadClass}>
        <span className={sectionBadge('')}>01</span>
        Basics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recipe name */}
        <div className="sm:col-span-2">
          <label htmlFor="recipeName" className={labelClass}>
            Recipe name
          </label>
          <input
            id="recipeName"
            type="text"
            {...register('recipeName')}
            placeholder="e.g. Charred Corn Tacos"
            className={fieldClass(!!errors.recipeName)}
          />
          {errors.recipeName && (
            <p className="text-xs text-red-500 mt-1">
              {errors.recipeName.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label htmlFor="recipeDescription" className={labelClass}>
            Description
          </label>
          <textarea
            id="recipeDescription"
            {...register('recipeDescription')}
            placeholder="A short, tempting summary of the dish"
            rows={2}
            className={`${fieldClass(!!errors.recipeDescription)} resize-y`}
          />
          {errors.recipeDescription && (
            <p className="text-xs text-red-500 mt-1">
              {errors.recipeDescription.message}
            </p>
          )}
        </div>

        {/* Cuisine */}
        <div>
          <label htmlFor="cuisine" className={labelClass}>
            Cuisine
          </label>
          <input
            id="cuisine"
            type="text"
            {...register('cuisine')}
            placeholder="e.g. Mexican"
            className={fieldClass(!!errors.cuisine)}
          />
          {errors.cuisine && (
            <p className="text-xs text-red-500 mt-1">
              {errors.cuisine.message}
            </p>
          )}
        </div>

        {/* Portion size */}
        <div>
          <label htmlFor="portionSize" className={labelClass}>
            Portion size (people)
          </label>
          <input
            id="portionSize"
            type="number"
            {...register('portionSize', {
              // Whole-person count; matches the parseInt used on the load path.
              setValueAs: (value) => parseInt(value, 10),
            })}
            placeholder="4"
            className={fieldClass(!!errors.portionSize)}
          />
          {errors.portionSize && (
            <p className="text-xs text-red-500 mt-1">
              {errors.portionSize.message}
            </p>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className={labelClass}>
            Difficulty
          </label>
          <select
            id="difficulty"
            {...register('difficulty')}
            className={fieldClass(!!errors.difficulty)}
          >
            <option value="" hidden>
              Select difficulty
            </option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          {errors.difficulty && (
            <p className="text-xs text-red-500 mt-1">
              {errors.difficulty.message}
            </p>
          )}
        </div>

        {/* Visibility */}
        <div>
          <label htmlFor="visibility" className={labelClass}>
            Visibility
          </label>
          <select
            id="visibility"
            {...register('visibility')}
            className={fieldClass(!!errors.visibility)}
          >
            <option value="" hidden>
              Select visibility
            </option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          {errors.visibility && (
            <p className="text-xs text-red-500 mt-1">
              {errors.visibility.message}
            </p>
          )}
        </div>

        {/* Prep time */}
        <div>
          <label htmlFor="prepTime" className={labelClass}>
            Prep time (minutes)
          </label>
          <input
            id="prepTime"
            type="number"
            {...register('prepTime', {
              setValueAs: (value) => parseFloat(value),
            })}
            placeholder="15"
            className={fieldClass(!!errors.prepTime)}
          />
          {errors.prepTime && (
            <p className="text-xs text-red-500 mt-1">
              {errors.prepTime.message}
            </p>
          )}
        </div>

        {/* Cook time */}
        <div>
          <label htmlFor="cookTime" className={labelClass}>
            Cook time (minutes)
          </label>
          <input
            id="cookTime"
            type="number"
            {...register('cookTime', {
              setValueAs: (value) => parseFloat(value),
            })}
            placeholder="20"
            className={fieldClass(!!errors.cookTime)}
          />
          {errors.cookTime && (
            <p className="text-xs text-red-500 mt-1">
              {errors.cookTime.message}
            </p>
          )}
        </div>

        {/* Dietary flags */}
        <div className="sm:col-span-2">
          <span className={labelClass}>Dietary</span>
          <div className="flex flex-wrap gap-3">
            <DietToggle name="vegetarian" label="Vegetarian" />
            <DietToggle name="vegan" label="Vegan" />
          </div>
        </div>

        <SourceFields />
      </div>
    </div>
  );
};
