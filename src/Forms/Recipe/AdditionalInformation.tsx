import { useEffect, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Options, StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { CreateRecipeFormData } from '@/Forms/CreateRecipe';
import {
  DynamicInput,
  DynamicInputProps,
} from '@/components/DynamicInput/DynamicInput';
import { usePopularLabels } from '@/queries';

import { NutritionButton } from './nutritionButton';

const nutritionFields: DynamicInputProps<CreateRecipeFormData>[] = [
  {
    id: 'nutritionFacts.kcal',
    name: 'nutritionFacts.kcal',
    label: 'Calories (kcal)',
    type: 'number',
    setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
  },
  {
    id: 'nutritionFacts.sugars',
    name: 'nutritionFacts.sugars',
    label: 'Sugars (g)',
    type: 'number',
    setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
  },
  {
    id: 'nutritionFacts.salt',
    name: 'nutritionFacts.salt',
    label: 'Salt (g)',
    type: 'number',
    setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
  },
  {
    id: 'nutritionFacts.carbs',
    name: 'nutritionFacts.carbs',
    label: 'Carbohydrates (g)',
    type: 'number',
    setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
  },
  {
    id: 'nutritionFacts.protein',
    name: 'nutritionFacts.protein',
    label: 'Protein (g)',
    type: 'number',
    setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
  },
  {
    id: 'nutritionFacts.fat',
    name: 'nutritionFacts.fat',
    label: 'Fat (g)',
    type: 'number',
    setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
  },
  {
    id: 'nutritionFacts.saturates',
    name: 'nutritionFacts.saturates',
    label: 'Saturated Fat (g)',
    type: 'number',
    setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
  },
  {
    id: 'nutritionFacts.fibre',
    name: 'nutritionFacts.fibre',
    label: 'Fibre (g)',
    type: 'number',
    setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
  },
];

export const AdditionalInformation = () => {
  const [selectedLabelOption, setSelectedLabelOption] = useState<
    Options<{ value: string; label: string }>
  >([]);

  const [labelValues, setLabelValues] = useState<
    Options<{ value: string; label: string }>
  >([]);

  const {
    formState: { errors },
    control,
  } = useFormContext<CreateRecipeFormData>();

  // Subscribe to `labels` via useWatch so we get a stable reference between
  // renders. Using getValues() here returned a fresh array every render and
  // drove an effect -> setState -> render loop (hung jsdom, thrashed React 19).
  const formLabels = useWatch({ control, name: 'labels' });

  useEffect(() => {
    if (formLabels && formLabels.length > 0) {
      setLabelValues(formLabels.map((label) => ({ value: label, label })));
    }
  }, [formLabels]);

  const {
    data: popularLabelData,
    isFetching: popularLabelsIsFetching,
    error: popularLabelsError,
  } = usePopularLabels();

  useEffect(() => {
    if (
      !popularLabelsIsFetching &&
      !popularLabelsError &&
      popularLabelData?.labels
    ) {
      setSelectedLabelOption(
        popularLabelData.labels.map((labels) => ({
          value: labels,
          label: labels,
        }))
      );
    }
  }, [popularLabelsIsFetching, popularLabelsError, popularLabelData]);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-5">
      {/* Labels */}
      <div className="bg-white-500 dark:bg-slate-700 rounded-xl border border-gray2-400 dark:border-slate-600 shadow-sm p-5 md:p-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brownishGrey-600 dark:text-white-700 mb-4 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold shrink-0">04</span>
          Labels
        </h2>
        <Controller
          name="labels"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <CreatableSelect
              placeholder="Select or create a label"
              isMulti
              noOptionsMessage={() => 'Type to create a label e.g. "Vegan"'}
              options={selectedLabelOption}
              onCreateOption={(inputValue) => {
                const labelValue =
                  inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                const newOption = { value: labelValue, label: labelValue };
                setSelectedLabelOption([...selectedLabelOption, newOption]);
                field.onChange([...field.value, labelValue]);
                setLabelValues([...labelValues, newOption]);
              }}
              onChange={(option) => {
                field.onChange(option.map((label) => label.value));
                setLabelValues(option);
              }}
              value={labelValues}
              styles={
                {
                  control: (provided) => ({
                    ...provided,
                    minHeight: '42px',
                    border: `1px solid ${
                      errors.labels
                        ? 'var(--red)'
                        : 'var(--color-gray2-500)'
                    }`,
                    borderRadius: '0.5rem',
                    boxShadow: 'none',
                    '&:hover': { borderColor: 'var(--green)' },
                  }),
                  // Kill the @tailwindcss/forms focus ring on react-select's
                  // inner <input> (the "blue box" that appeared on focus).
                  input: (provided) => ({
                    ...provided,
                    boxShadow: 'none',
                    '& input': { boxShadow: 'none !important' },
                  }),
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: '10rem',
                    overflow: 'auto',
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? 'var(--green)'
                      : 'var(--white)',
                    color: state.isSelected ? 'var(--white)' : 'var(--black)',
                    '&:hover': {
                      backgroundColor: 'var(--green)',
                      color: 'var(--white)',
                    },
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: 'var(--subtle-accent)',
                    border: '1px solid var(--green)',
                    borderRadius: '9999px',
                    color: 'var(--black)',
                  }),
                  multiValueRemove: (provided) => ({
                    ...provided,
                    '&:hover': {
                      backgroundColor: 'var(--green)',
                      color: 'var(--white)',
                    },
                  }),
                } as StylesConfig<{ value: string; label: string }, true>
              }
            />
          )}
        />
        {errors.labels && (
          <p className="text-sm text-red-500 mt-1">{errors.labels.message}</p>
        )}
        <p className="text-xs text-brownishGrey-600 mt-3">
          Add tags like "Quick", "Gluten-free", or "Family favourite".
        </p>
      </div>

      {/* Nutrition */}
      <div className="bg-white-500 dark:bg-slate-700 rounded-xl border border-gray2-400 dark:border-slate-600 shadow-sm p-5 md:p-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brownishGrey-600 dark:text-white-700 mb-4 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold shrink-0">05</span>
          Nutrition
          <span className="text-xs font-normal normal-case tracking-normal text-brownishGrey-500">(per serving)</span>
        </h2>
        <NutritionButton />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
          {nutritionFields.map((field) => (
            <DynamicInput<CreateRecipeFormData> key={field.id} {...field} />
          ))}
        </div>
      </div>
    </section>
  );
};
