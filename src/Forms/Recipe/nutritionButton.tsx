import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext } from 'react-hook-form';

import { CreateRecipeFormData } from '@/Forms/CreateRecipe';
import { useEstimateNutrition, NutritionValues } from '@/queries';

const CONFIDENCE_STYLES: Record<string, string> = {
  high: 'bg-green-500/10 text-green-600',
  medium: 'bg-amber-500/10 text-amber-600',
  low: 'bg-red-500/10 text-red-600',
};

/**
 * "Estimate nutrition with AI" button for the recipe form's Nutrition section.
 * Reads the current ingredients + servings from the form, calls the stateless
 * nutrition endpoint, and populates the editable nutritionFacts.* fields so the
 * user can review/tweak before saving. Values persist with the normal submit.
 */
export const NutritionButton = () => {
  const { getValues, setValue } = useFormContext<CreateRecipeFormData>();
  const { mutate, isPending, data, error, isSuccess } = useEstimateNutrition();

  const handleEstimate = () => {
    const values = getValues();
    const ingredients = (values.ingredients || [])
      .filter((i) => i && i.item)
      .map((i) => ({
        item: i.item,
        quantity: i.quantity,
        measurement: i.measurement,
      }));
    const servings = Number(values.portionSize);

    if (ingredients.length === 0 || !Number.isFinite(servings) || servings <= 0) {
      return;
    }

    mutate(
      { name: values.recipeName, servings, ingredients },
      {
        onSuccess: (estimate) => {
          const ps = estimate.perServing;
          (Object.keys(ps) as (keyof NutritionValues)[]).forEach((k) => {
            // form field names: nutritionFacts.kcal, .sugars, etc.
            setValue(`nutritionFacts.${k}` as never, Math.round(ps[k]) as never, {
              shouldValidate: true,
              shouldDirty: true,
            });
          });
        },
      },
    );
  };

  const values = getValues();
  const canEstimate =
    (values.ingredients || []).some((i) => i && i.item) &&
    Number(values.portionSize) > 0;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleEstimate}
          disabled={isPending || !canEstimate}
          className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-white-500 shadow-sm transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FontAwesomeIcon
            icon={faWandMagicSparkles}
            className={isPending ? 'animate-pulse' : ''}
          />
          {isPending ? 'Estimating…' : 'Estimate nutrition with AI'}
        </button>
        {isSuccess && data && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
              CONFIDENCE_STYLES[data.confidence] || CONFIDENCE_STYLES.medium
            }`}
          >
            {data.confidence} confidence
          </span>
        )}
      </div>
      {!canEstimate && (
        <p className="mt-2 text-xs text-brownishGrey-500">
          Add ingredients and a serving count first.
        </p>
      )}
      {error && (
        <p className="mt-2 text-xs text-red-500">
          Could not estimate nutrition right now — please try again or enter it
          manually.
        </p>
      )}
      {isSuccess && data && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-brownishGrey-600 dark:text-white-700">
            AI estimate — review and adjust the values below. Assumptions made
          </summary>
          <ul className="mt-1 list-disc pl-5 text-xs text-brownishGrey-500">
            {data.assumptions.map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
};

export default NutritionButton;
