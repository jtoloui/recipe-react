import { useFieldArray, useFormContext } from 'react-hook-form';

import { CreateRecipeFormData } from '@/Forms/CreateRecipe';
import { Button } from '@/components/Button';

export const Instructions = () => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<CreateRecipeFormData>();

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({ control, name: 'steps' });
  return (
    <div className="md:col-start-2 md:col-span-2 rounded-lg h-fit bg-white-500 dark:bg-slate-700 p-5">
      <h1 className="text-base font-bold mb-7 dark:text-white-500">
        How to cook
      </h1>

      <div className="flex flex-col space-y-4 overflow-auto">
        {stepFields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 flex-wrap"
          >
            <div className="flex flex-col flex-grow lg:flex-basis-0">
              <input
                {...register(`steps.${index}.step`)}
                placeholder={`e.g. Step ${index + 1}`}
                className={`border-b px-3 py-2 ${
                  errors.steps && errors.steps[index]
                    ? 'border-red-500'
                    : 'border-green-500'
                }`}
                defaultValue={field.step}
              />

              {errors.steps && errors.steps[index] && (
                <span className="text-red-500 text-sm">
                  {errors.steps[index]?.step?.message}
                </span>
              )}
            </div>

            <div>
              <Button
                variant="cancelOutline"
                onClick={() => removeStep(index)}
                text="Remove"
                type="button"
              />
            </div>
          </div>
        ))}

        <Button
          variant="secondary"
          onClick={() => appendStep({ step: '' })}
          text="Add Step"
          type="button"
        />

        {errors.steps && (
          <span className="text-red-500 text-sm">{errors.steps.message}</span>
        )}
      </div>
    </div>
  );
};
