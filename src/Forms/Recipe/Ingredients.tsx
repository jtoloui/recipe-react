import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Options } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { CreateRecipeFormData } from '@/Forms/CreateRecipe';
import { Button } from '@/components/Button';
import { usePopularMeasurements } from '@/queries';

export const Ingredients = () => {
  const [selectedOption, setSelectedOption] = useState<
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
  } = useFieldArray({ control, name: 'ingredients' });

  const { data, isFetching, error } = usePopularMeasurements();

  useEffect(() => {
    if (!isFetching && !error && data?.measurements) {
      const options: Options<{
        value: string;
        label: string;
      }> = data.measurements.map((measurement) => ({
        value: measurement,
        label: measurement,
      }));
      setSelectedOption(options);
    }
  }, [isFetching, error, data]);

  return (
    <div>
      <h1 className="text-base font-bold text-black-500 dark:text-white-500 mb-4">
        Ingredients
      </h1>
      <div className="flex flex-col space-y-4">
        {ingredientFields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 flex-wrap"
          >
            <div className="flex flex-col flex-grow lg:flex-basis-0">
              <input
                {...register(`ingredients.${index}.item`)}
                placeholder="e.g flour, eggs, etc."
                className={`border-b px-3 py-2 ${
                  errors.ingredients && errors.ingredients[index]?.item
                    ? 'border-red-500'
                    : 'border-green-500'
                }`}
              />
              {errors.ingredients && errors.ingredients[index]?.item && (
                <span className="text-red-500 text-sm">
                  {errors.ingredients[index]?.item?.message}
                </span>
              )}
            </div>
            <div className="flex flex-col flex-grow lg:flex-basis-0">
              <Controller
                name={`ingredients.${index}.measurement`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    options={selectedOption}
                    placeholder="Choose or add measurement"
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        border: 'none',
                        flexGrow: 1,
                        minWidth: '10rem',
                        marginBottom: '0.18rem',
                        borderBottom: `${
                          errors.ingredients &&
                          errors.ingredients[index]?.measurement
                            ? '1px solid var(--red)'
                            : '1px solid var(--green)'
                        }`,
                        borderRadius: 'none',
                        boxShadow: 'none',
                        overflow: 'visible',
                        height: '30px',
                        zIndex: 999,
                        '&:hover': {
                          border: 'none',
                          borderBottom: `${
                            errors.ingredients &&
                            errors.ingredients[index]?.measurement
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
                      container: (provided) => ({
                        ...provided,
                        flexGrow: 1,
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        textOverflow: 'ellipsis',
                        width: '100%',
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
                    }}
                    className="mt-[0.18rem] react-select-container "
                    classNamePrefix="react-select"
                    onChange={(option) => field.onChange(option?.value || '')}
                    value={
                      selectedOption.find(
                        (option) => option.value === field.value
                      ) || { value: field.value, label: field.value }
                    }
                  />
                )}
              />
              {errors.ingredients && errors.ingredients[index]?.measurement && (
                <span className="text-red-500 text-sm">
                  {errors.ingredients[index]?.measurement?.message}
                </span>
              )}
            </div>
            <div className="flex flex-col flex-grow lg:flex-basis-0">
              <input
                {...register(`ingredients.${index}.quantity`, {
                  setValueAs: (value) => parseFloat(value),
                })}
                type="number"
                placeholder="Quantity"
                className={`border-b px-3 py-2 appearance-none ${
                  errors.ingredients && errors.ingredients[index]?.quantity
                    ? 'border-red-500'
                    : 'border-green-500'
                }`}
              />
              {errors.ingredients && errors.ingredients[index]?.quantity && (
                <span className="text-red-500 text-sm">
                  {errors.ingredients[index]?.quantity?.message}
                </span>
              )}
            </div>
            <div>
              <Button
                variant="cancelOutline"
                onClick={() => removeIngredient(index)}
                text="Remove"
                type="button"
              />
            </div>
          </div>
        ))}
        <Button
          variant="secondary"
          onClick={() =>
            appendIngredient({
              item: '',
              measurement: '',
              quantity: null as unknown as number,
            })
          }
          text="Add Ingredient"
          type="button"
        />

        {errors.ingredients && (
          <span className="text-red-500 text-sm">
            {errors.ingredients.message}
          </span>
        )}
      </div>
    </div>
  );
};
