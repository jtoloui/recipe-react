import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Options, StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { CreateRecipeFormData } from '@/Forms/CreateRecipe';
import { usePopularMeasurements } from '@/queries';

import { SortableRow } from '../../pages/CreateUpdateRecipe/Components/SortableRow';

const announcements = {
  onDragStart: ({
    active,
  }: {
    active: { data: { current?: { sortable?: { index: number } } } };
  }) => `Picked up ingredient ${(active.data.current?.sortable?.index ?? 0) + 1}.`,
  onDragOver: ({
    over,
  }: {
    over: { data: { current?: { sortable?: { index: number } } } } | null;
  }) =>
    over
      ? `Ingredient moved over position ${(over.data.current?.sortable?.index ?? 0) + 1}.`
      : undefined,
  onDragEnd: ({
    over,
  }: {
    over: { data: { current?: { sortable?: { index: number } } } } | null;
  }) =>
    over
      ? `Ingredient dropped at position ${(over.data.current?.sortable?.index ?? 0) + 1}.`
      : 'Ingredient returned to its original position.',
  onDragCancel: () => 'Reordering cancelled.',
};

const selectStyles = (
  hasError?: boolean
): StylesConfig<{ value: string; label: string }, false> => ({
  control: (provided) => ({
    ...provided,
    minHeight: '38px',
    border: `1px solid ${hasError ? 'var(--red)' : 'var(--color-gray2-500)'}`,
    borderRadius: '0.375rem',
    boxShadow: 'none',
    '&:hover': { borderColor: 'var(--green)' },
  }),
  menu: (provided) => ({ ...provided, zIndex: 9999 }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '10rem',
    overflow: 'auto',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'var(--green)' : 'var(--white)',
    color: state.isSelected ? 'var(--white)' : 'var(--black)',
    '&:hover': {
      backgroundColor: 'var(--green)',
      color: 'var(--white)',
    },
  }),
});

export const Ingredients = () => {
  const [measurementOptions, setMeasurementOptions] = useState<
    Options<{ value: string; label: string }>
  >([
    { value: 'grams', label: 'Grams' },
    { value: 'cups', label: 'Cups' },
    { value: 'tablespoons', label: 'Tablespoons' },
  ]);

  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<CreateRecipeFormData>();

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
    move: moveIngredient,
  } = useFieldArray({ control, name: 'ingredients' });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = ingredientFields.findIndex((f) => f.id === active.id);
      const newIndex = ingredientFields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) moveIngredient(oldIndex, newIndex);
    }
  };

  const { data, isFetching, error } = usePopularMeasurements();

  useEffect(() => {
    if (!isFetching && !error && data?.measurements) {
      setMeasurementOptions(
        data.measurements.map((measurement) => ({
          value: measurement,
          label: measurement,
        }))
      );
    }
  }, [isFetching, error, data]);

  return (
    <div className="bg-white-500 dark:bg-slate-700 rounded-lg shadow-md p-5 md:p-6">
      <h2 className="text-sm font-bold text-charcoal-500 dark:text-white-500 mb-4 flex items-center gap-2">
        <span className="text-green-500">02</span> Ingredients
      </h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        accessibility={{ announcements }}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={ingredientFields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {ingredientFields.map((field, index) => (
              <SortableRow key={field.id} id={field.id}>
                <div className="flex flex-1 flex-col">
                  <input
                    {...register(`ingredients.${index}.item`)}
                    placeholder="e.g. flour, eggs"
                    className={`w-full rounded-md border bg-white-500 dark:bg-slate-700 px-2.5 py-2 text-sm focus:outline-none focus:border-green-500 ${
                      errors.ingredients?.[index]?.item
                        ? 'border-red-500'
                        : 'border-gray2-500 dark:border-slate-600'
                    }`}
                  />
                  {errors.ingredients?.[index]?.item && (
                    <span className="text-red-500 text-xs mt-0.5">
                      {errors.ingredients[index]?.item?.message}
                    </span>
                  )}
                </div>

                <div className="w-32 shrink-0">
                  <Controller
                    name={`ingredients.${index}.measurement`}
                    control={control}
                    defaultValue=""
                    render={({ field: selectField }) => (
                      <CreatableSelect<{ value: string; label: string }, false>
                        {...selectField}
                        options={measurementOptions}
                        placeholder="Unit"
                        styles={selectStyles(
                          !!errors.ingredients?.[index]?.measurement
                        )}
                        classNamePrefix="react-select"
                        onChange={(option) =>
                          selectField.onChange(option?.value || '')
                        }
                        value={
                          measurementOptions.find(
                            (option) => option.value === selectField.value
                          ) || {
                            value: selectField.value,
                            label: selectField.value,
                          }
                        }
                      />
                    )}
                  />
                </div>

                <div className="w-20 shrink-0">
                  <input
                    {...register(`ingredients.${index}.quantity`, {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    type="number"
                    placeholder="Qty"
                    className={`w-full rounded-md border bg-white-500 dark:bg-slate-700 px-2.5 py-2 text-sm appearance-none focus:outline-none focus:border-green-500 ${
                      errors.ingredients?.[index]?.quantity
                        ? 'border-red-500'
                        : 'border-gray2-500 dark:border-slate-600'
                    }`}
                  />
                </div>

                <button
                  type="button"
                  aria-label="Remove ingredient"
                  onClick={() => removeIngredient(index)}
                  className="shrink-0 px-1.5 text-lg leading-none text-brownishGrey-600 hover:text-red-500"
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
        onClick={() =>
          appendIngredient({
            item: '',
            measurement: '',
            quantity: null as unknown as number,
          })
        }
        className="mt-3 w-full rounded-lg border-2 border-dashed border-green-300 py-2 text-sm font-semibold text-green-600 hover:border-green-500 hover:bg-subtleAccent transition"
      >
        + Add ingredient
      </button>

      {errors.ingredients && !Array.isArray(errors.ingredients) && (
        <span className="text-red-500 text-sm mt-2 block">
          {errors.ingredients.message}
        </span>
      )}
    </div>
  );
};
