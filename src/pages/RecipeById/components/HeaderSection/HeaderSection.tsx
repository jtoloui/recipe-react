import { faEarthEurope, faLock } from '@fortawesome/free-solid-svg-icons';
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

/** Small rounded pill for a single meta fact (difficulty, cuisine, a time). */
const MetaChip = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="inline-flex items-center gap-1.5 rounded-full bg-subtleAccent px-3 py-1.5 text-sm dark:bg-slate-600">
    <span className="font-semibold text-brownishGrey-600 dark:text-white-600">
      {label}
    </span>
    <span className="font-bold text-black-500 dark:text-white-500">
      {value}
    </span>
  </div>
);

/** Diet badge — green "Vegan"/"Vegetarian" pill when true, muted "Not …" when
 *  false, so it reads as a label rather than a bare tick/cross. */
const DietBadge = ({ active, label }: { active?: boolean; label: string }) =>
  active ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-500 px-3 py-1.5 text-sm font-semibold text-white-500">
      🌱 {label}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray2-500 px-3 py-1.5 text-sm font-medium text-brownishGrey-600 dark:border-slate-600 dark:text-white-600">
      Not {label.toLowerCase()}
    </span>
  );

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
    <div className="mb-5 border-b border-gray2-500 pb-5 dark:border-slate-600">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-black-500 dark:text-white-500 md:text-3xl">
            {name}
          </h1>
          <p className="mt-1 text-sm text-brownishGrey-600 dark:text-white-600">
            by {recipeAuthor}
          </p>
        </div>
        {isAuthor && (
          <Link
            to={`/recipe/${recipeId}/edit`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-green-500/40 px-3 py-1.5 text-sm font-semibold text-green-600 transition-colors hover:bg-green-500 hover:text-white-500"
          >
            <EditSvg height={18} width={18} />
            <span className="hidden sm:inline">Edit</span>
          </Link>
        )}
      </div>

      {/* Diet badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        <DietBadge active={vegan} label="Vegan" />
        <DietBadge active={vegetarian} label="Vegetarian" />
        {isAuthor && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray2-500 px-3 py-1.5 text-sm font-medium text-brownishGrey-600 dark:border-slate-600 dark:text-white-600">
            <FontAwesomeIcon
              icon={visibility?.public ? faEarthEurope : faLock}
              color="var(--green)"
            />
            {visibility?.public ? 'Public' : 'Private'}
          </span>
        )}
      </div>

      {/* Meta chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {difficulty && <MetaChip label="Difficulty" value={difficulty} />}
        {cuisine && <MetaChip label="Cuisine" value={cuisine} />}
        {!!timeToCook.Prep && (
          <MetaChip label="Prep" value={formatTime(timeToCook.Prep)} />
        )}
        {!!timeToCook.Cook && (
          <MetaChip label="Cook" value={formatTime(timeToCook.Cook)} />
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="mt-5">
          <h3 className="mb-1.5 text-sm font-bold uppercase tracking-wider text-brownishGrey-600 dark:text-white-600">
            Description
          </h3>
          <p className="text-sm leading-relaxed text-black-500 dark:text-white-500">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};
