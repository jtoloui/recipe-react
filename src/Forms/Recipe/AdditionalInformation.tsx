import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Options } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { CreateRecipeFormData } from '@/Forms/CreateRecipe';
import { Button } from '@/components/Button';
import {
  DynamicInput,
  DynamicInputProps,
} from '@/components/DynamicInput/DynamicInput';
import { usePopularLabels } from '@/queries';

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

type Props = {
  submitText?: string;
};

export const AdditionalInformation = ({
  submitText = 'Create Recipe',
}: Props) => {
  const [selectedLabelOption, setSelectedLabelOption] = useState<
    Options<{ value: string; label: string }>
  >([]);

  const [labelValues, setLabelValues] = useState<
    Options<{
      value: string;
      label: string;
    }>
  >([]);
  const {
    formState: { errors },
    control,
    getValues,
  } = useFormContext<CreateRecipeFormData>();

  const formLabels = getValues('labels');

  useEffect(() => {
    if (formLabels && formLabels.length > 0) {
      const labels = formLabels.map((label) => ({
        value: label,
        label: label,
      }));
      setLabelValues(labels);
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
      const options: Options<{
        value: string;
        label: string;
      }> = popularLabelData.labels.map((labels) => ({
        value: labels,
        label: labels,
      }));
      setSelectedLabelOption(options);
    }
  }, [popularLabelsIsFetching, popularLabelsError, popularLabelData]);

  return (
    <div className="md:col-start-2 md:col-span-2 rounded-lg bg-white-500 dark:bg-slate-700 p-5">
      <>
        <h1 className="text-base font-bold dark:text-white-500 mb-4">
          Additional Information
        </h1>
        <div className="flex gap-3 mb-2 flex-col md:flex-row">
          <div className="flex-1">
            <div className="mb-4 text-black-500 dark:text-white-500">
              Nutrition Facts
            </div>

            {nutritionFields.map((field) => (
              <DynamicInput<CreateRecipeFormData> key={field.id} {...field} />
            ))}
          </div>
          <div className="flex-1">
            <div className="mb-[1.41rem] text-black-500 dark:text-white-500">
              Labels & Portion
            </div>
            <div className="relative mb-2 mt-4 w-full">
              <Controller
                name={`labels`}
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <CreatableSelect
                    placeholder="Select or create a label"
                    isMulti
                    noOptionsMessage={() =>
                      'Type to create a label e.g. "Vegan"'
                    }
                    options={selectedLabelOption}
                    onCreateOption={(inputValue) => {
                      const labelValue =
                        inputValue.charAt(0).toUpperCase() +
                        inputValue.slice(1);
                      const newOption: {
                        value: string;
                        label: string;
                      } = {
                        value: labelValue,
                        label: labelValue,
                      };
                      setSelectedLabelOption([
                        ...selectedLabelOption,
                        newOption,
                      ]);
                      field.onChange([...field.value, labelValue]);

                      setLabelValues([...labelValues, newOption]);
                    }}
                    onChange={(option) => {
                      const labels = option.map((label) => label.value);
                      field.onChange(labels);
                      setLabelValues(option);
                    }}
                    value={labelValues}
                    styles={{
                      valueContainer: (provided) => ({
                        ...provided,
                        paddingLeft: 0,
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: 'var(--gray-500)',
                      }),
                      control: (provided) => ({
                        ...provided,
                        border: 'none',
                        flexGrow: 1,
                        minWidth: '10rem',
                        marginBottom: '0.18rem',
                        borderBottom: `${
                          errors.labels
                            ? '1px solid var(--red)'
                            : '1px solid var(--green)'
                        }`,
                        borderRadius: 'none',
                        boxShadow: 'none',
                        overflow: 'visible',
                        height: 'auto',
                        zIndex: 999,
                        '&:hover': {
                          border: 'none',
                          borderBottom: `${
                            errors.labels
                              ? '1px solid var(--red)'
                              : '1px solid var(--green)'
                          }`,
                          borderRadius: 'none',
                          boxShadow: 'none',
                        },
                      }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: '10rem',
                        overflow: 'scroll',
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                          ? 'var(--green)'
                          : 'var(--white)',
                        color: state.isSelected
                          ? 'var(--white)'
                          : 'var(--black)',
                        '&:hover': {
                          backgroundColor: state.isSelected
                            ? 'var(--green)'
                            : 'var(--green)',
                          color: state.isSelected
                            ? 'var(--white)'
                            : 'var(--white)',
                        },
                      }),
                      multiValueRemove: (provided) => ({
                        ...provided,
                        backgroundColor: 'var(--white)',
                        '&:hover': {
                          backgroundColor: 'var(--white)',
                        },
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: 'var(--white)',
                        border: '1px solid var(--green)',
                        color: 'var(--black)',
                      }),
                    }}
                  />
                )}
              />
              {errors.labels && errors.labels && (
                <p className="text-sm text-red-500">{errors.labels.message}</p>
              )}
            </div>

            <DynamicInput<CreateRecipeFormData>
              id="portionSize"
              name="portionSize"
              label="Portion Size (person)"
              type="number"
              setValueAs={(value) => parseFloat(value)}
            />
          </div>
        </div>
        <div className="flex justify-end w-full">
          <Button
            variant="primary"
            text={submitText}
            type="submit"
            buttonClassName="sm:w-auto"
          />
        </div>
      </>
    </div>
  );
};
