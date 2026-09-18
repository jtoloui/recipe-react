import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { CreateRecipeFormData } from '@/Forms/CreateRecipe';

import { SortableRow } from '../../pages/CreateUpdateRecipe/Components/SortableRow';

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
    move: moveStep,
  } = useFieldArray({ control, name: 'steps' });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = stepFields.findIndex((f) => f.id === active.id);
      const newIndex = stepFields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) moveStep(oldIndex, newIndex);
    }
  };

  return (
    <div className="bg-white-500 dark:bg-slate-700 rounded-lg shadow-md p-5 md:p-6">
      <h2 className="text-sm font-bold text-charcoal-500 dark:text-white-500 mb-4 flex items-center gap-2">
        <span className="text-green-500">03</span> Method
      </h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={stepFields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {stepFields.map((field, index) => (
              <SortableRow
                key={field.id}
                id={field.id}
                lead={
                  <span className="shrink-0 w-6 h-6 rounded-full bg-green-500 text-white-500 text-xs font-bold grid place-items-center">
                    {index + 1}
                  </span>
                }
              >
                <div className="flex flex-1 flex-col">
                  <textarea
                    {...register(`steps.${index}.step`)}
                    placeholder={`Describe step ${index + 1}`}
                    rows={2}
                    defaultValue={field.step}
                    className={`w-full resize-y rounded-md border bg-white-500 dark:bg-slate-700 px-2.5 py-2 text-sm focus:outline-none focus:border-green-500 ${
                      errors.steps?.[index]
                        ? 'border-red-500'
                        : 'border-gray2-500 dark:border-slate-600'
                    }`}
                  />
                  {errors.steps?.[index] && (
                    <span className="text-red-500 text-xs mt-0.5">
                      {errors.steps[index]?.step?.message}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  aria-label="Remove step"
                  onClick={() => removeStep(index)}
                  className="shrink-0 self-start px-1.5 text-lg leading-none text-brownishGrey-600 hover:text-red-500"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </SortableRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={() => appendStep({ step: '' })}
        className="mt-3 w-full rounded-lg border-2 border-dashed border-green-300 py-2 text-sm font-semibold text-green-600 hover:border-green-500 hover:bg-subtleAccent transition"
      >
        + Add step
      </button>

      {errors.steps && !Array.isArray(errors.steps) && (
        <span className="text-red-500 text-sm mt-2 block">
          {errors.steps.message}
        </span>
      )}
    </div>
  );
};
